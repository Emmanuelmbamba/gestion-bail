import api from "../api/axios";


// Inscription

export const register = async(data)=>{

const response =
await api.post(
"/auth/register",
data
);

return response.data;

};



// Connexion

export const login = async(data)=>{


const response =
await api.post(
"/auth/login",
data
);


return response.data;


};