import axios from 'axios';
import { getSocketIo } from '../../socket/socket.oi';
import { removeUserInfo, storeUserInfo } from '../../services/auth.service';

const instance = axios.create({
<<<<<<< HEAD
  baseURL: '/api',
  withCredentials: true,
=======
  // Must match the backend mount point: app.use('/api/v1', Routers)
  // The Vite dev proxy forwards /api → http://localhost:5000, so
  // the full path /api/v1/... is required here.
  baseURL: '/api/v1',
>>>>>>> origin/main
});

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
<<<<<<< HEAD
        const { data } = await axios.post('/api/auth/refresh-token', {}, {
          withCredentials: true,
        });
=======
        const { data } = await axios.post('/api/v1/auth/refresh-token');
>>>>>>> origin/main
        const newToken = data.data.accessToken;
        storeUserInfo({ accessToken: newToken });

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

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return instance(originalRequest);
      } catch {
        removeUserInfo();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
export { instance };
