// Quick test file to verify API connectivity
// Run this: node test-api.js

const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

console.log('Testing backend API connection...\n');

// Test 1: Health Check
axios.get(`${API_URL}/health`)
  .then(response => {
    console.log('✅ Health Check SUCCESS:');
    console.log(JSON.stringify(response.data, null, 2));
  })
  .catch(error => {
    console.log('❌ Health Check FAILED:');
    console.log(error.message);
    if (error.code) console.log('Error code:', error.code);
  });

// Test 2: Try signup
setTimeout(() => {
  console.log('\nTesting signup endpoint...');
  axios.post(`${API_URL}/auth/signup`, {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123'
  })
    .then(response => {
      console.log('✅ Signup SUCCESS:');
      console.log(JSON.stringify(response.data, null, 2));
    })
    .catch(error => {
      console.log('❌ Signup FAILED:');
      if (error.response) {
        console.log('Status:', error.response.status);
        console.log('Message:', error.response.data.message);
      } else {
        console.log(error.message);
      }
    });
}, 1000);
