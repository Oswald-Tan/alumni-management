import api from "./api";

// Periode Tracer
export const getPeriods = () => api.get("/tracer/periods");
export const createPeriod = (data) => api.post("/tracer/periods", data);
export const updatePeriod = (id, data) => api.put(`/tracer/periods/${id}`, data);
export const deletePeriod = (id) => api.delete(`/tracer/periods/${id}`);

// Pertanyaan Dinamis
export const getQuestions = () => api.get("/tracer/questions");
export const createQuestion = (data) => api.post("/tracer/questions", data);
export const updateQuestion = (id, data) => api.put(`/tracer/questions/${id}`, data);
export const deleteQuestion = (id) => api.delete(`/tracer/questions/${id}`);

// Alumni Portal
export const checkEligibility = () => api.get("/tracer/eligibility");
export const getActiveQuestions = () => api.get("/tracer/active-questions");
export const submitResponse = (data) => api.post("/tracer/responses", data);

// Monitoring & Laporan
export const getMonitoring = (params) => api.get("/tracer/monitoring", { params });
export const getReport = (params) => api.get("/tracer/report", { params });
