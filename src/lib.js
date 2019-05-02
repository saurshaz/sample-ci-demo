const axios = require('axios');

// TODO: make this conditional, not in case of production NODE_ENV
export const axiosInstance = axios.create({
  baseURL: ( process.env.NODE_ENV === 'development') ? 'http://localhost:3000/': '/',
});
