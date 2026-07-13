import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

const client = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

const withAuth = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const login = (payload) => client.post('/auth/login', payload);
export const signup = (payload) => client.post('/auth/signup', payload);
export const fetchUsers = (token) => client.get('/users', withAuth(token));
export const createUser = (token, payload) => client.post('/users', payload, withAuth(token));
export const updateUser = (token, id, payload) => client.put(`/users/${id}`, payload, withAuth(token));
export const deleteUser = (token, id) => client.delete(`/users/${id}`, withAuth(token));
