import api from "./api";

export const getPengambilan = (params) => api.get("/pengambilan", { params });
export const createPengambilan = (data) => api.post("/pengambilan", data);
