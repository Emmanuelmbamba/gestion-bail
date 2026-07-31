import api from "./axios";

export const addFavori = (id) =>
    api.post(`/favoris/${id}`);

export const removeFavori = (id) =>
    api.delete(`/favoris/${id}`);

export const checkFavori = (id) =>
    api.get(`/favoris/check/${id}`);

export const getFavoris = () =>
    api.get("/favoris");    