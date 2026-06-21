import axios from 'axios';
import { getSocketIo } from '../../socket/socket.oi';

const instance = axios.create({
  baseURL: '/api',
});

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { data } = await axios.post('/api/auth/refresh-token');
        const newToken = data.data.accessToken;
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

        originalRequest.headers.Authorization = newToken;
        return instance(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    if (error.code === "ERR_NETWORK" || !error.response) {
      const errorObject = {
        statusCode: 503,
        message: "Network Error - Unable to connect to the server",
        errorMessages: [
          {
            path: "",
            message: "Unable to connect to the server. Please check your internet connection or try again later.",
          },
        ],
      };
      return Promise.reject(errorObject);
    }

    if (error.response) {
      const errorObject = {
        statusCode: error.response.data?.statusCode || 500,
        message: error.response.data?.message || "Something went wrong!",
        errorMessages: error.response.data?.errorMessages || [],
      };
      return Promise.reject(errorObject);
    }

    return Promise.reject(error);
  }
);

export default instance;
export { instance };
