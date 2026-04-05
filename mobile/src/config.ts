// React Native config

// Use local IP for physical device or emulator access to local network
export const LOCAL_IP = '10.16.134.131';
export const PORT = '5001';

// Since you are using Expo Tunnel, we are tunneling the backend too!
export const TUNNEL_URL = 'https://hungry-phones-push.loca.lt';

export const API_URL = `${TUNNEL_URL}/api/requests`;
export const SOCKET_URL = TUNNEL_URL;
