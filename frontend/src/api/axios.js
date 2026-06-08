import axios from "axios";
import conf from "../src/conf/conf.js";

const api = axios.create({
  baseURL: conf.apiBaseUrl,
  withCredentials: true,
});

export default api;