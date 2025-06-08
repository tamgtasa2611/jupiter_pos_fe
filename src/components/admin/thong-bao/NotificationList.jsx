"use client";
import React, { useEffect, useState } from "react";
import { Button, Spin, Empty } from "antd";
import { getNotifications } from "../../../requests/notification";

export default function NotificationList({ onClose }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getNotifications();
        setNotifications(data || []);
      } catch (error) {
        console.error("Lỗi khi tải thông báo:", error);
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div className="absolute top-16 right-6 w-96 max-w-full bg-white shadow-lg border border-gray-200 rounded-lg p-4 z-20 animate-fadeIn">
      <div className="flex justify-between items-center mb-4">
        <span className="font-bold text-lg">Tất cả thông báo</span>
        <Button size="small" type="link" onClick={onClose}>
          Đóng
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <Spin />
        </div>
      ) : notifications.length === 0 ? (
        <Empty description="Không có thông báo nào." />
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="p-3 rounded-md border border-gray-100 hover:shadow-sm transition"
            >
              <div className="font-semibold text-blue-600">{notification.title}</div>
              <div className="text-sm text-gray-600">{notification.body}</div>
              <div className="text-xs text-gray-400 mt-1">
                {new Date(notification.date).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}