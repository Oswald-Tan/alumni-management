import api from "./api";

export const getDashboard = () => api.get("/dashboard");
export const getDashboardAlumni = () => api.get("/dashboard/alumni");
