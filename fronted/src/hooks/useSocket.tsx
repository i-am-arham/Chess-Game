import { useEffect, useRef, useState } from "react";

const WS_URL = "ws://localhost:8000";

export const useSocket = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const wsRef = useRef<WebSocket | null>(null); // Keep track of the actual WS instance

  useEffect(() => {
    const connect = () => {
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        setSocket(ws);
      };

      ws.onclose = () => {
        wsRef.current = null;
        setSocket(null);
        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, 3000);
      };
    };

    connect();

    // Cleanup on unmount
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close(); // Actually close the connection!
      }
    };
  }, []);

  return socket;
};
