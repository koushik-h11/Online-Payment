import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function Predict() {
  const [inputData, setInputData] = useState({
    step: 0,
    type: '',
    amount: 0,
    oldbalanceOrg: 0,
    newbalanceOrig: 0,
    oldbalanceDest: 0,
    newbalanceDest: 0,
  });
  const [prediction, setPrediction] = useState(-1);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Predict component rendered');
    const token = localStorage.getItem('token');
    if (!token || isTokenExpired(token)) {
      navigate('/');
    }
  }, [navigate]);

  const isTokenExpired = (token) => {
    try {
      const decoded = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp < currentTime;
    } catch (error) {
      console.log(error);
      return true;
    }
  };

  const handlePredict = async () => {
    const token = localStorage.getItem('token');

    if (!token || isTokenExpired(token)) {
      setError('Your session has expired. Please log in again.');
      localStorage.removeItem('token');
      navigate('/');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ inputData }),
      });

      const data = await response.json();

      if (response.ok) {
        setPrediction(data.prediction);
        setError('');
      } else {
        setError(data.error || 'Prediction failed');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      console.error('Error:', error);
    }
  };

  const handleChange = (key, value) => {
    setInputData(prevState => ({
      ...prevState,
      [key]: value
    }));
  };

  return (
    <div>
      <h2>Predict</h2>
      {Object.entries(inputData).map(([key, value]) => (
        <div key={key}>
          <label>
            {key}
            <input
              type={typeof value === 'number' ? 'number' : 'text'}
              placeholder={`Enter ${key}`}
              value={value}
              onChange={(e) => handleChange(key, e.target.value)}
            />
          </label>
          <br />
        </div>
      ))}
      
      <button onClick={handlePredict}>Make Prediction</button>
      
      { (prediction!==-1) && <h1>Prediction: {prediction}</h1>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default Predict;