import { isDevMode } from '@angular/core';

export const API_BASE_URL = isDevMode() 
  ? 'http://localhost:3000' 
  : 'https://sarthi-backend-yczq.onrender.com';

export const SOCKET_URL = isDevMode() 
  ? 'http://localhost:3000' 
  : 'https://sarthi-backend-yczq.onrender.com';
