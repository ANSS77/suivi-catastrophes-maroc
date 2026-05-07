import api from '../api/axios';
import { jwtDecode } from 'jwt-decode';

export const register = async (data) => {
  const response = await api.post('/auth/register/', data);
  return response.data;
};

export const login = async (data) => {
  const response = await api.post('/auth/login/', data);
  const { access, refresh } = response.data;
  
  localStorage.setItem('access_token', access);
  localStorage.setItem('refresh_token', refresh);

  // Décoder le token pour obtenir les infos user (role, nom, etc)
  const decoded = jwtDecode(access);
  
  const userData = {
    ...decoded,
    access,
    refresh
  };

  return userData;
};

export const logout = async () => {

  const refresh = localStorage.getItem('refresh_token');
  await api.post('/auth/logout/', { refresh });
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  
};