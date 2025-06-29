import { useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

export default function useStockNotification() {
  const [messages, setMessages] = useState([]);
  const idRef = useRef(0);

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS('https://jupiterstore.onrender.com/ws'),
      onConnect: () => {
        client.subscribe('/topic/stock-alert', (msg) => {
          const content = JSON.parse(msg.body).content;
          const id = idRef.current++;
          setMessages((prev) => [...prev, { id, content }]);
          setTimeout(() => {
            setMessages((prev) => prev.filter((m) => m.id !== id));
          }, 4500);
        });
      },
    });

    client.activate();

    return () => {
      client.deactivate();
    };
  }, []);

  const removeMessage = (id) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
  };

  return { messages, removeMessage };
}
