import instance from "../helpers/axios/axiosInstance";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000/api/v1";
export default instance;
