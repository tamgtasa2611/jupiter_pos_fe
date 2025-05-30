import { useEffect } from 'react';

export function useSSE(url, onMessage) {
  useEffect(() => {
    const eventSource = new EventSource(url);

    eventSource.onmessage = (event) => {
      if (onMessage) {
        onMessage(event.data);
      }
    };

    eventSource.onerror = (err) => {
      console.error('SSE error:', err);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [url, onMessage]);
}
