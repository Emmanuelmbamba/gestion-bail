import api from "../api/axios";



export const getNotifications =
async()=>{


const response =
await api.get(
"/notifications"
);


return response.data;


};



export const readNotification =
async(id)=>{


const response =
await api.put(

`/notifications/${id}`

);


return response.data;


};  