// frontend/src/services/paiementService.js

import api from "../api/axios";


// Récupérer tous les paiements
export const getPaiements = async () => {

    const token = localStorage.getItem("token");

    const response = await api.get(
        "/paiements",
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return response.data;

};




// Créer un paiement
export const createPaiement = async (data) => {

    const token = localStorage.getItem("token");


    const response = await api.post(
        "/paiements",
        data,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );


    return response.data;

};