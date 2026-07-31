const transporter =
require("../config/email");


const envoyerEmail =
async(
email,
sujet,
message
)=>{


await transporter.sendMail({

from:
process.env.EMAIL_USER,


to:
email,


subject:
sujet,


text:
message


});


};


module.exports =
envoyerEmail;