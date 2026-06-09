import api from "./api";

export const getInformasi = () => api.get("/informasi");
export const getInformasiById = (id) => api.get(`/informasi/${id}`);
export const createInformasi = (data) => api.post("/informasi", data);
export const updateInformasi = (id, data) => api.put(`/informasi/${id}`, data);
export const deleteInformasi = (id) => api.delete(`/informasi/${id}`);
