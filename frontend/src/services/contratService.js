import api from "../api/axios";


export const getContrats =
async()=>{

const res =
await api.get(
"/contrats"
);

return res.data;

};



export const createContrat =
async(data)=>{


const res =
await api.post(

"/contrats",

data

);


return res.data;


}; 
export const downloadContrat = async (id, filename = "contrat.pdf") => {
  try {
    const response = await api.get(`/contrats/download/${id}`, { responseType: "blob" });
    const blob = new Blob([response.data], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(link.href);
  } catch (error) {
    console.error("Erreur lors du téléchargement du contrat PDF:", error);
  }
};   

export const signerContrat = async (id) => {
  const res = await api.put(`/contrats/signer/${id}`);
  return res.data;
};