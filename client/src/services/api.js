// import axios from 'axios';

// const API_BASE_URL = 'http://localhost:5000/api';

// const api = axios.create({
//   baseURL: API_BASE_URL,
// });

// // Helper function to handle API requests with error logging
// const handleApiRequest = async (requestFunc) => {
//   try {
//     const response = await requestFunc();
//     return response.data;
//   } catch (error) {
//     console.error('API request error:', error.response ? error.response.data : error.message);
//     throw error.response ? error.response.data : error; // Re-throw error so it can be caught in the components
//   }
// };

// // Function to create a customer with error handling
// export const createCustomer = (customerData) => 
//   handleApiRequest(() => api.post('/customers', customerData));

// // Function to create an order with error handling
// export const createOrder = (orderData) => 
//   handleApiRequest(() => api.post('/orders', orderData));

// // Function to create an audience for a campaign with error handling
// export const createAudience = (audienceData) => 
//   handleApiRequest(() => api.post('/campaigns/audience', audienceData));

// // Function to get campaigns with error handling
// export const getCampaigns = () => 
//   handleApiRequest(() => api.get('/campaigns'));


import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const createCustomer = (customerData) => api.post('/customers', customerData);

export const createOrder = (orderData) => {
  const googleId = localStorage.getItem('googleId'); // Retrieve googleId from local storage
  if (!googleId) {
    return Promise.reject(new Error('googleId not found. Please log in again.'));
  }
  return api.post('/orders', { ...orderData, googleId }); // Include googleId in the payload
};

export const createAudience = (audienceData) => api.post('/campaigns/audience', audienceData);
export const getCampaigns = (googleId) => api.get(`/campaigns?googleId=${googleId}`);
export const deleteCampaign = (id) => api.delete(`/campaigns/${id}`);