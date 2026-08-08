import api from "./api";

export const getAdminProdi = () => api.get("/admin-prodi");
export const createAdminProdi = (data) => api.post("/admin-prodi", data);
export const updateAdminProdi = (id, data) => api.put(`/admin-prodi/${id}`, data);
export const deleteAdminProdi = (id) => api.delete(`/admin-prodi/${id}`);
