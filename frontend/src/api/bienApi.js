import api from "./axios";


export const getBiens=()=>{

return api.get("/biens");

};



export const getBienById=(id)=>{

return api.get(`/biens/${id}`);

};



export const searchBien=(params)=>{

return api.get(
"/biens/search",
{
params
}
);

};