import api from "./axios";

export const registerUser = (data) => api.post("/users/register", data);

export const verifyCode = (data) => api.post("/users/verify-code", data);

export const loginUser = (data) => api.post("/users/login", data);

export const logoutUser = () => api.post("/users/logout");

export const getMe = () => api.get("/users/me");

export const deleteAccount = () => api.delete("/users/delete-account");

export const checkUsername = (username) => api.get(`/users/check-username?username=${username}`);

export const toggleAcceptStatus = () => api.patch("/users/change-toggle");

export const getAcceptStatus = () => api.get("/users/accept-status");