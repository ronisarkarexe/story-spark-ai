import axios from 'axios';
import { getSocketIo } from '../../socket/socket.oi';
import { removeUserInfo, storeUserInfo } from '../../services/auth.service';

const instance = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { data } = await axios.post('/api/auth/refresh-token', {}, {
          withCredentials: true,
        });
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
