//import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import FraudDetection from './components/FraudDetection';
import PropTypes from 'prop-types';

// PrivateRoute component for React Router v6
function PrivateRoute({ element: Element, ...rest }) {
  const isAuthenticated = localStorage.getItem('token'); // Check if token exists
  return (
    <Route
      {...rest}
      element={isAuthenticated ? <Element {...rest} /> : <Navigate to="/login" />}
    />
  );
}

PrivateRoute.propTypes = {
  element: PropTypes.elementType.isRequired, // Ensure `element` is a React component
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<PrivateRoute element={FraudDetection} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
