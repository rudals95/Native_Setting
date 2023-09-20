import axios from 'axios';

const API = axios.create({
  baseURL: 'https://demo6754615.mockable.io',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

export default API;
