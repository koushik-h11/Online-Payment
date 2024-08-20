import  { useState } from 'react';
import axios from 'axios';

function FraudDetection() {
  const [formData, setFormData] = useState({
    step: '',
    type: '',
    amount: '',
    oldbalanceOrg: '',
    newbalanceOrig: '',
    oldbalanceDest: '',
    newbalanceDest: ''
  });
  const [prediction, setPrediction] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:3000/predict', formData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setPrediction(response.data.prediction);
    } catch (error) {
      console.error('Prediction failed', error);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Fraud Detection</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label>
            Step:
            <input
              type="number"
              name="step"
              value={formData.step}
              onChange={handleChange}
              style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
            />
          </label>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>
            Type:
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
            >
              <option value="CASH_OUT">CASH_OUT</option>
              <option value="PAYMENT">PAYMENT</option>
              <option value="CASH_IN">CASH_IN</option>
              <option value="TRANSFER">TRANSFER</option>
              <option value="DEBIT">DEBIT</option>
            </select>
          </label>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>
            Amount:
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
            />
          </label>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>
            Old Balance Org:
            <input
              type="number"
              name="oldbalanceOrg"
              value={formData.oldbalanceOrg}
              onChange={handleChange}
              style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
            />
          </label>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>
            New Balance Orig:
            <input
              type="number"
              name="newbalanceOrig"
              value={formData.newbalanceOrig}
              onChange={handleChange}
              style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
            />
          </label>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>
            Old Balance Dest:
            <input
              type="number"
              name="oldbalanceDest"
              value={formData.oldbalanceDest}
              onChange={handleChange}
              style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
            />
          </label>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>
            New Balance Dest:
            <input
              type="number"
              name="newbalanceDest"
              value={formData.newbalanceDest}
              onChange={handleChange}
              style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
            />
          </label>
        </div>
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '0.25rem',
            cursor: 'pointer',
            marginTop: '1rem',
          }}
        >
          Predict
        </button>
      </form>
      {prediction !== null && (
        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <h2>Prediction: {prediction === 1 ? 'Fraudulent' : 'Not Fraudulent'}</h2>
        </div>
      )}
    </div>
  );
}

export default FraudDetection;
