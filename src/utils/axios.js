import axios from 'axios';

const API = axios.create({
  baseURL: 'https://my-blog-two-rouge.vercel.app/',
  // baseURL: 'http://localhost:3000/',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

export default API;
