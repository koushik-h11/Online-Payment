require('dotenv').config();
const express = require("express");
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());


mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));


const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};


app.post('/register', async (req, res) => {
    try {
      const existingUser = await User.findOne({ username: req.body.username });
      if (existingUser) {
        return res.status(400).json({ error: 'Username already exists' });
      }
  
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const user = new User({
        username: req.body.username,
        password: hashedPassword
      });
      await user.save();
      res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Error creating user' });
    }
  });
  
  app.post('/login', async (req, res) => {
    try {
      console.log(req.body);
      const user = await User.findOne({ username: req.body.username });
      if (!user) {
        return res.status(400).json({ error: 'User not found', register: true });
      }
      
      if (await bcrypt.compare(req.body.password, user.password)) {
        const accessToken = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ accessToken: accessToken });
      } else {
        res.status(400).json({ error: 'Invalid credentials' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Login failed' });
    }
  });

app.post("/predict", authenticateToken, async (req, res) => {
  try {
    console.log(req.body);
    let input=req.body.inputData;
    let sendingRes={};
    Object.entries(input).map(([key,value])=>{
        if(key!=='type')sendingRes[key]=Number(value);
        else sendingRes[key]=value;
    })
    console.log(sendingRes);
    const flaskResponse = await axios.post('http://127.0.0.1:5000/predict', sendingRes);
    res.json(flaskResponse.data);
  } catch (error) {
    res.status(500).send('Error making prediction');
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});