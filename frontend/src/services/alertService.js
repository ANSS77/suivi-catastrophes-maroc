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

// POST marquer toutes les notifications comme lues
export const markAllNotificationsAsRead = async () => {
  const response = await api.post('/notifications/mark-all-read/');
  return response.data;
};

// POST déclencher une collecte manuelle (admin)
export const triggerManualCollection = async (source = 'all') => {
  const response = await api.post('/admin/collect/', { source });
  return response.data;
};

// GET statut du collecteur (admin)
export const getCollectorStatus = async () => {
  const response = await api.get('/admin/collect/');
  return response.data;
};
