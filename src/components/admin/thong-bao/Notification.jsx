"use client";
import React, { useEffect, useState } from "react";
import { List, Button, notification as antdNotification } from "antd";
import { getStream } from "@/requests/notification";

export default function Notification() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
          try {
            const data = await getStreams();
            setNotifications(data || []);
          } catch (error) {
            console.error("Lỗi khi tải thông báo:", error);
            setNotifications([]);
          } finally {
            setLoading(false);
          }
        };
        fetchNotifications();
      

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setNotifications((prev) => [data, ...prev]);

        // Optional: show popup notification của antd
        antdNotification.open({
          message: data.title,
          description: data.body,
          duration: 5,
        });
      } catch (err) {
        console.error("Error parsing SSE data:", err);
      }
    };

    eventSource.onerror = (err) => {
      console.error("EventSource failed:", err);
      eventSource.close();
    };

    // Cleanup khi component unmount
    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div className="notification-wrapper" style={{ position: "fixed", top: 80, right: 20, width: 320, zIndex: 9999 }}>
      <List
        size="small"
        header={<div><b>Thông báo realtime</b></div>}
        bordered
        dataSource={notifications}
        renderItem={item => (
          <List.Item>
            <List.Item.Meta
              title={item.title}
              description={
                <>
                  <div>{item.body}</div>
                  <small className="text-gray-400">{new Date(item.date).toLocaleString()}</small>
                </>
              }
            />
          </List.Item>
        )}
        locale={{emptyText: "Không có thông báo mới"}}
      />
    </div>
  );
}
