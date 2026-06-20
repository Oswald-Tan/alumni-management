import api from "./api";

export const getJurusan = () => api.get("/jurusan");
export const createJurusan = (data) => api.post("/jurusan", data);
export const updateJurusan = (id, data) => api.put(`/jurusan/${id}`, data);
export const deleteJurusan = (id) => api.delete(`/jurusan/${id}`);
