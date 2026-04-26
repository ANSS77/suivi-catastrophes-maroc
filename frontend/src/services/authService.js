import api from '../api/axios';

export const register = async (data) => {

  const response = await api.post('/auth/register/', data);
  return response.data;

};

export const login = async (data) => {

  const response = await api.post('/auth/login/', data);
  localStorage.setItem('access_token', response.data.access);
  localStorage.setItem('refresh_token', response.data.refresh);
  return response.data;

};

export const logout = async () => {

  const refresh = localStorage.getItem('refresh_token');
  await api.post('/auth/logout/', { refresh });
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  
};