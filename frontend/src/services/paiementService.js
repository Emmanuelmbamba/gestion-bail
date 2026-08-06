import api from "../api/axios";

// Liste paiements
export const getPaiements = async () => {
  const response = await api.get("/paiements");
  return response.data;
};

// Création paiement (Locataire)
export const createPaiement = async (data) => {
  const response = await api.post("/paiements", data);
  return response.data;
};

// Confirmation paiement (Bailleur / Admin)
export const confirmerPaiement = async (id) => {
  const response = await api.put(`/paiements/confirmer/${id}`);
  return response.data;
};