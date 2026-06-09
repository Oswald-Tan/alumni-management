import api from "./api";

export const getProdi = () => api.get("/prodi");
export const createProdi = (data) => api.post("/prodi", data);
export const updateProdi = (id, data) => api.put(`/prodi/${id}`, data);
export const deleteProdi = (id) => api.delete(`/prodi/${id}`);
