import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { getSocketIo } from '../../socket/socket.oi';

const instance = axios.create({
  // Must match the backend mount point: app.use('/api/v1', Routers)
  // The Vite dev proxy forwards /api → http://localhost:5000, so
  // the full path /api/v1/... is required here.
  baseURL: '/api/v1',
  withCredentials: true,
});

instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshPromise: Promise<string> | null = null;

const refreshAccessToken = async (): Promise<string> => {
  if (!refreshPromise) {
    refreshPromise = axios
      .post(
        '/api/v1/auth/refresh-token',
        {},
        {
          baseURL: undefined,
          withCredentials: true,
        }
      )
      .then(({ data }) => {
        const newToken = data.data.accessToken as string;
        localStorage.setItem('accessToken', newToken);

        const socket = getSocketIo();
        if (socket) {
          (socket as any).auth = { token: newToken };
          socket.emit('reauthenticate', newToken);
        }

        window.dispatchEvent(
          new CustomEvent('story-spark-token-refreshed', {
            detail: { token: newToken },
          })
        );

        return newToken;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

instance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newToken = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return instance(originalRequest);
      } catch {
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
export { instance };
