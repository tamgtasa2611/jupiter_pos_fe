import { useEffect } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

export default function useStockNotification() {
  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
      onConnect: () => {
        client.subscribe("/topic/stock-alert", (msg) => {
          const message = JSON.parse(msg.body).content;
          alert("⚠️ " + message);
        });
      },
    });

    client.activate();

    return () => {
      client.deactivate();
    };
  }, []);
}
