import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { markAllNotificationsAsRead } from '../../services/alertService';

const relativeTime = (dateString) => {
  const now = new Date();
  const date = new Date(dateString);
  const diffInMs = now - date;
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInHours < 1) return "À l'instant";
  if (diffInHours < 24) return `Il y a ${diffInHours}h`;
  if (diffInDays === 1) return "Hier";
  return `Il y a ${diffInDays} jours`;
};

const typeConfig = {
  earthquake: {
    icon: 'fa-solid fa-mountain-sun',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    label: 'Séisme'
  },
  flood: {
    icon: 'fa-solid fa-water',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    label: 'Inondation'
  },
  wildfire: {
    icon: 'fa-solid fa-fire',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    label: 'Incendie'
  },
};

export default function NotificationDropdown({ onClose, onMarkAllRead }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/notifications/');
      setNotifications(response.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read/`);
      setNotifications(prev =>
        prev.map(n => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      onMarkAllRead();
    } catch (error) {
      console.error("Error marking all as read:", error);
      // Fallback: marquer un par un
      const unread = notifications.filter(n => !n.isRead);
      try {
        await Promise.all(unread.map(n => api.patch(`/notifications/${n._id}/read/`)));
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        onMarkAllRead();
      } catch (e) {
        console.error("Fallback marking all as read failed:", e);
      }
    }
  };

  const handleItemClick = async (notif) => {
    if (!notif.isRead) {
      await markAsRead(notif._id);
    }
    onClose();
    navigate('/alerts');
  };

  return (
    <div className="absolute right-0 mt-3 w-[400px] bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-50 overflow-hidden z-[1001] animate-in fade-in slide-in-from-top-4 duration-300">

      {/* Header */}
      <div className="px-8 py-6 flex items-center justify-between border-b border-gray-50">
        <h3 className="text-2xl font-gara text-text-dark font-medium">Notifications</h3>
        <button
          onClick={markAllAsRead}
          className="text-primary-orange text-[13px] font-bold font-rope hover:opacity-80 transition-opacity"
        >
          Tout marquer comme lu
        </button>
      </div>

      {/* List */}
      <div className="max-h-[480px] overflow-y-auto scrollbar-hide">
        {loading ? (
          <div className="py-12 text-center text-gray-400 font-rope italic">Chargement...</div>
        ) : notifications.length === 0 ? (
          <div className="py-12 text-center text-gray-400 font-rope italic">Aucune notification</div>
        ) : (
          notifications.map((notif, index) => {
            const config = typeConfig[notif.type] || typeConfig.flood;

            // ✅ Extraire région depuis regionIds
            const region = Array.isArray(notif.regionIds) && notif.regionIds.length > 0
              ? notif.regionIds[0]
              : 'Région inconnue';

            return (
              <div
                key={notif._id || index}
                onClick={() => handleItemClick(notif)}
                className={`px-8 py-6 flex items-start gap-5 cursor-pointer transition-colors border-b border-gray-50 last:border-0 ${
                  !notif.isRead ? 'bg-[#FAF7F2]/50 hover:bg-[#FAF7F2]' : 'bg-white hover:bg-gray-50'
                }`}
              >
                {/* Icon */}
                <div className={`w-14 h-14 rounded-full flex-shrink-0 flex items-center justify-center ${config.bgColor}`}>
                  <i className={`${config.icon} ${config.color} text-xl`}></i>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[15px] font-bold font-rope text-text-dark">
                      {region}
                    </span>
                    <span className={`w-2.5 h-2.5 rounded-full ${!notif.isRead ? 'bg-primary-orange' : 'bg-gray-200'}`}></span>
                  </div>
                  <span className="text-[14px] font-medium font-rope text-gray-500">
                    {config.label}
                  </span>
                  <span className="text-[12px] font-medium font-rope text-gray-400">
                    {notif.date ? relativeTime(notif.date) : "Récemment"}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="p-6 bg-white border-t border-gray-50">
        <button
          onClick={() => { onClose(); navigate('/alerts'); }}
          className="w-full text-center text-primary-orange font-bold font-rope text-[15px] hover:opacity-80 transition-opacity"
        >
          Voir toutes les alertes
        </button>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}