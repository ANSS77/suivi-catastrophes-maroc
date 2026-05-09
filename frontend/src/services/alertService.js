 import api from '../api/axios';

// GET toutes les alertes
export const getAlerts = async () => {
  const response = await api.get('/alerts/');
  return response.data;
};

// GET toutes les notifications
export const getNotifications = async () => {
  const response = await api.get('/notifications/');
  return response.data;
};

// PATCH marquer une notification comme lue
export const markNotificationAsRead = async (id) => {
  const response = await api.patch(`/notifications/${id}/read/`);
  return response.data;
};
