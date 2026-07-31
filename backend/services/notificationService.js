const Notification = require("../models/Notification");


const envoyerNotification =
async(
user,
titre,
message,
type
)=>{


const notification =
await Notification.create({

user,

titre,

message,

type

});


return notification;

};



module.exports =
envoyerNotification;