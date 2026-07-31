import api from "../api/axios";

// Get locataire profiles
export const getLocataires = async () => {
  const response = await api.get("/locataires");
  return response.data.data;
};

// Get locataire by ID
export const getLocataireById = async (id) => {
  const response = await api.get(`/locataires/${id}`);
  return response.data;
};

// Create a locataire profile
export const createLocataire = async (data) => {
  const response = await api.post("/locataires", data);
  return response.data.data;
};

// Update locataire profile
export const updateLocataire = async (id, data) => {
  const response = await api.put(`/locataires/${id}`, data);
  return response.data.data;
};

// Delete a locataire profile
export const deleteLocataire = async (id) => {
  const response = await api.delete(`/locataires/${id}`);
  return response.data;
};

// Get registered users with 'locataire' role (for dropdowns)
export const getLocataireUsers = async () => {
  const response = await api.get("/auth/locataires");
  return response.data;
};

// Search locataires by name, email, phone
export const searchLocataires = async (query) => {
  const response = await api.get(`/locataires?search=${query}`);
  return response.data.data;
};
