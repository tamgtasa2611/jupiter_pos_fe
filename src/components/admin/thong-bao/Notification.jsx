import React, { useState, useEffect, use } from 'react';
import {getNotifications} from '@requests/notification';

export default function Notification() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await getNotifications();
        setNotifications(res.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();

    

    // Optionally, you can set up an interval to fetch notifications periodically
    const intervalId = setInterval(fetchNotifications, 30000); // every 30 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }
  , []);
  console.log(notifications);

  return (
    <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 9999 }}>
      {notifications.map((noti, idx) => (
        <div key={idx} style={{
          background: '#fff',
          border: '1px solid #ccc',
          padding: 10,
          marginBottom: 10,
          borderRadius: 4,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <strong>{noti.title}</strong>
          <div>{noti.message}</div>
        </div>
      ))}
    </div>
  );
}
