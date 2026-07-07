import api from "./axios";

export const registerUser = (data) => api.post("/users/register", data);


export const loginUser = (data) => api.post("/users/login", data);

export const logoutUser = () => api.get("/users/logout");

export const getMe = () => api.get("/users/me");

export const deleteAccount = () => api.delete("/users/delete-account");

export const checkUsername = (username) => api.get(`/users/check-username?username=${username}`);

export const toggleAcceptStatus = () => api.patch("/users/change-toggle");

export const getAcceptStatus = () => api.get("/users/accept-status");

// 

export const sendMessage = (username, data) => api.post(`/messages/send/${username}`, data);

export const getMessages = () => api.get("/messages");

export const deleteMessage = (messageId) => api.delete(`/messages/${messageId}`);

export const replyToMessage = (messageId, data) => api.post(`/messages/reply/${messageId}`, data);

export const checkThread = (threadToken) => api.get(`/messages/thread/${threadToken}`);

export const markAsSeen = (threadToken) => api.patch(`/messages/thread/${threadToken}/seen`);

export const getPublicAcceptStatus = (username) => api.get(`/users/accept-status/${username}`);