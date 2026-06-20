import api from "./api";

export const login = (data) => api.post("/auth/login", data);
export const logout = () => api.post("/auth/logout");
export const getProfile = () => api.get("/auth/profile");
export const checkSession = () => api.get("/auth/me");
export const updateAdminFoto = (formData) => api.put("/auth/profile/foto", formData, { headers: { "Content-Type": "multipart/form-data" } });
export const deleteAdminFoto = () => api.delete("/auth/profile/foto");
