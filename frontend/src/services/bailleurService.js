import api from "../api/axios";

// Get bailleur profiles
export const getBailleurs = async () => {
  const response = await api.get("/bailleurs");
  return response.data.data;
};

// Get bailleur by ID
export const getBailleurById = async (id) => {
  const response = await api.get(`/bailleurs/${id}`);
  return response.data;
};

// Create a bailleur profile
export const createBailleur = async (data) => {
  const response = await api.post("/bailleurs", data);
  return response.data.data;
};

// Update bailleur profile
export const updateBailleur = async (id, data) => {
  const response = await api.put(`/bailleurs/${id}`, data);
  return response.data.data;
};

// Delete a bailleur profile
export const deleteBailleur = async (id) => {
  const response = await api.delete(`/bailleurs/${id}`);
  return response.data;
};

// Get registered users with 'bailleur' role (for dropdowns)
export const getBailleurUsers = async () => {
  const response = await api.get("/auth/bailleurs");
  return response.data;
};

// Search bailleurs by name, email, phone
export const searchBailleurs = async (query) => {
  const response = await api.get(`/bailleurs?search=${query}`);
  return response.data.data;
};
