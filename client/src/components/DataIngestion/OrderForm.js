import React, { useState } from 'react';
import { createOrder } from '../../services/api'; // Ensure this is the correct path to your API file
import './OrderForm.css';

const OrderForm = () => {
  const [customerId, setCustomerId] = useState('');
  const [amount, setAmount] = useState('');
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(''); // State for backend error

  const validate = () => {
    const newErrors = {};

    if (!customerId.trim()) {
      newErrors.customerId = 'Customer ID is required';
    }

    if (!amount.trim()) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(amount) || parseFloat(amount) <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await createOrder({ customerId: customerId, amount: parseFloat(amount) });
      alert('Order created successfully');
      setCustomerId('');
      setAmount('');
      setErrors({});
      setApiError(''); // Clear any previous backend error
    } catch (err) {
      console.error('Error creating order:', err);
      setApiError(err.response?.data?.message || 'Error creating order'); // Display backend error if available
    }
  };

  return (
    <div className="container">
      <h2 className="heading">Create Order</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <input
            type="text"
            placeholder="Customer ID"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            required
            className="input"
          />
          {errors.customerId && <div className="error">{errors.customerId}</div>}
        </div>
        <div className="form-group">
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            className="input"
          />
          {errors.amount && <div className="error">{errors.amount}</div>}
        </div>
        <button type="submit" className="button" disabled={Object.keys(errors).length > 0}>Create Order</button>
        {apiError && <div className="error">{apiError}</div>} {/* Display backend error */}
      </form>
    </div>
  );
};

export default OrderForm;