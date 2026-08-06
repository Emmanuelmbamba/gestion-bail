import api from "../api/axios";



// Liste paiements

export const getPaiements = async()=>{

    const response =
    await api.get("/paiements");


    return response.data;

};




// Création paiement

export const createPaiement = async(data)=>{


    const response =
    await api.post(
        "/paiements",
        data
    );


    return response.data;


};