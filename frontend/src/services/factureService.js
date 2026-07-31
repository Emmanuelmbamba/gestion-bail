import api from "../api/axios";



export const getFactures =
async()=>{


const response =
await api.get(
"/factures"
);


return response.data;


};




export const downloadFacture = async (id, filename = "facture.pdf") => {
  try {
    const response = await api.get(`/factures/download/${id}`, { responseType: "blob" });
    const blob = new Blob([response.data], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(link.href);
  } catch (error) {
    console.error("Erreur lors du téléchargement de la facture PDF:", error);
  }
};  