import api from "./api";

export const getBerkas = (params) => api.get("/berkas", { params });
export const uploadBerkas = (formData) =>
  api.post("/berkas", formData, { headers: { "Content-Type": "multipart/form-data" } });
export const verifikasiBerkas = (id, data) => api.put(`/berkas/${id}/verifikasi`, data);
export const deleteBerkas = (id) => api.delete(`/berkas/${id}`);
