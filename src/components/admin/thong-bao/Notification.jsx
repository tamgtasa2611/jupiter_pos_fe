"use client";
import React from 'react';
import { CloseOutlined } from '@ant-design/icons';

export default function Notification({ message, onClose }) {
  if (!message) return null;

return (
    <div
        style={{
            position: 'fixed',
            bottom: '40px',
            right: '30px',
            backgroundColor: '#fef08a',
            color: '#92400e',
            padding: '16px',
            borderRadius: '10px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
            zIndex: 9999,
            cursor: 'default',
            fontSize: '14px',
            fontWeight: 'bold',
            minHeight: '54px',
            display: 'flex',
            alignItems: 'center',
            minWidth: '220px',
            position: 'fixed',
        }}
        onClick={onClose}
    >
        <span style={{ marginLeft: 8, flex: 1 }}>⚠️ {message}</span>
        {/* Nut dong thong bao */}
        <button
            onClick={e => {
                e.stopPropagation();
                onClose();
            }}
            style={{
                marginLeft: 12,
                background: 'transparent',
                border: 'none',
                color: '#92400e',
                fontSize: 20,
                fontWeight: 'bold',
                cursor: 'pointer',
                zIndex: 10000,
                display: 'flex',
                alignItems: 'center',
            }}
            aria-label="Đóng thông báo"
        >
            <CloseOutlined />
        </button>
    </div>
);
}