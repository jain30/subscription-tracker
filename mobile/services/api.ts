import axios from 'axios';

import { API_BASE_URL } from '@/constants/config';

/**
 * Shared Axios client — configured for future Express API.
 * No endpoints or requests are called in Phase 12.
 */
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

export type ApiClient = typeof apiClient;
