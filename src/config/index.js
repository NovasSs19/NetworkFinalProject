import { Platform } from 'react-native';

const API_URL = Platform.select({
  web: 'http://localhost:8000/api',
  default: 'http://192.168.1.5:8000/api', // Kendi IP adresinizi buraya yazın
});

export { API_URL };
