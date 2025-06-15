"use client";
import React, { useEffect, useState, useRef } from "react";
import { Button, Spin, Empty } from "antd";
import { getNotifications } from "../../../requests/notification";

export default function NotificationList({ onClose }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const listRef = useRef(null);

  const fetchNotifications = async (page) => {
    setLoading(true);
    try {
      const data = await getNotifications(page);
      if (data && data.length > 0) {
        setNotifications((prev) => [...prev, ...data]);
        setHasMore(true);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      setHasMore(false);
      console.error("Lỗi khi tải thông báo:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications(page);
  }, [page]);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight - 10 && !loading && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <div className="absolute top-16 right-6 w-96 max-w-full bg-white shadow-lg border border-gray-200 rounded-lg p-4 z-20 animate-fadeIn">
      <div className="flex justify-between items-center mb-4">
        <span className="font-bold text-lg">Tất cả thông báo</span>
        <Button size="small" type="link" onClick={onClose}>
          Đóng
        </Button>
      </div>

      {loading && notifications.length === 0 ? (
        <div className="flex justify-center items-center h-32">
          <Spin />
        </div>
      ) : notifications.length === 0 ? (
        <Empty description="Không có thông báo nào." />
      ) : (
        <div
          className="space-y-3 max-h-96 overflow-y-auto"
          style={{ height: 384 }}
          ref={listRef}
          onScroll={handleScroll}
        >
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="p-3 rounded-md border border-gray-100 hover:shadow-sm transition"
            >
              <div className="font-semibold text-blue-600">
                {notification.title}
              </div>
              <div className="text-sm text-gray-600">{notification.body}</div>
              <div className="text-xs text-gray-400 mt-1">
                {new Date(notification.date).toLocaleString()}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-center items-center py-2">
              <Spin size="small" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
