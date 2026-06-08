import axios from "axios";
import conf from "../conf/conf";
const api = axios.create({
  baseURL: conf.apiBaseUrl,
  withCredentials: true,
});

export default api;