import api from "./api";

export const getIjazah = (params) => api.get("/ijazah", { params });
export const getIjazahSaya = () => api.get("/ijazah/alumni-saya");
export const createIjazah = (data) => api.post("/ijazah", data);
export const updateIjazah = (id, data) => api.put(`/ijazah/${id}`, data);
