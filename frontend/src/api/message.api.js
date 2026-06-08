import api from "./axios";

export const sendMessage = (username, data) => api.post(`/messages/send/${username}`, data);

export const getMessages = () => api.get("/messages");

export const deleteMessage = (messageId) => api.delete(`/messages/${messageId}`);

export const replyToMessage = (messageId, data) => api.post(`/messages/reply/${messageId}`, data);

export const checkThread = (threadToken) => api.get(`/messages/thread/${threadToken}`);