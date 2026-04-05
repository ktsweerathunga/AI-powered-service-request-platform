// React Native config

// Use local IP for physical device or emulator access to local network
// Replace the IP below with your actual machine's local IP if it changes.
// Android emulators can also use 10.0.2.2 to access host localhost.
export const LOCAL_IP = '10.16.134.131';
export const PORT = '5001';

export const API_URL = `http://${LOCAL_IP}:${PORT}/api/requests`;
export const SOCKET_URL = `http://${LOCAL_IP}:${PORT}`;
