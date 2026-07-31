import api from "../api/axios";

// Récupérer les biens
export const getBiens = async (dashboard = false) => {
  const response = await api.get("/biens", {
    params: dashboard ? { dashboard: true } : {}
  });
  return response.data;
};

// Ajouter un bien
export const createBien = async (data) => {
  const response = await api.post("/biens", data);
  return response.data;
};

// Supprimer un bien
export const deleteBien = async (id) => {
  const response = await api.delete(`/biens/${id}`);
  return response.data;
};