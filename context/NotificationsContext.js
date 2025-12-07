import React, { createContext, useContext, useEffect, useState } from 'react';
import { onNotificationsListener } from '../services/notificationService';

const NotificationsContext = createContext();

export const NotificationsProvider = ({ currentUserId, children }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUserId) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsubscribe = onNotificationsListener(currentUserId, (data) => {
      setNotifications((prev) => {
        const newIds = new Set(prev.map((n) => n.id));
        const filtered = data.filter((n) => !newIds.has(n.id));
        return [...filtered, ...prev];
      });
      setLoading(false);
    });
    return () => unsubscribe();
  }, [currentUserId]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationsContext.Provider
      value={{ notifications, setNotifications, unreadCount, loading }}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationsContext);
