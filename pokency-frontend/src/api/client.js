import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  timeout: 40000,
});

export default api;
