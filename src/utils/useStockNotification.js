import { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

export default function useStockNotification() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS('https://jupiterstore.onrender.com/ws'),
      onConnect: () => {
        client.subscribe('/topic/stock-alert', (msg) => {
          const content = JSON.parse(msg.body).content;
          setMessage(content);
          setTimeout(() => setMessage(''), 4800);
        });
      },
    });

    client.activate();

    return () => {
      client.deactivate();
    };
  }, []);
  
  return { message, setMessage };
}
