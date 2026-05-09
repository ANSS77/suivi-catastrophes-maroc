 import api from '../api/axios';

// GET tous les disasters
export const getDisasters = async () => {
  const response = await api.get('/disasters/');
  return response.data;
};

// GET disasters filtrés par type
export const filterDisasters = async (type) => {
  const response = await api.get(`/disasters/filter/?type=${type}`);
  return response.data;
};

// GET un disaster par id
export const getDisasterById = async (id) => {
  const response = await api.get(`/disasters/${id}/`);
  return response.data;
};