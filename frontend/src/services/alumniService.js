import api from "./api";

export const getAlumni = (params) => api.get("/alumni", { params });
export const getAlumniById = (id) => api.get(`/alumni/${id}`);
export const createAlumni = (data) => api.post("/alumni", data);
export const updateAlumni = (id, data) => api.put(`/alumni/${id}`, data);
export const deleteAlumni = (id) => api.delete(`/alumni/${id}`);
export const gantiPassword = (data) => api.put("/alumni/akun/ganti-password", data);
