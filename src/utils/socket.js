import io from "socket.io-client";

export const createSocketConnection = () => {
  const SOCKET_URL =
    import.meta.env.VITE_API_URL?.replace("/api/", "") ||
    "http://localhost:7777";
  return io(SOCKET_URL, {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
  });
};
