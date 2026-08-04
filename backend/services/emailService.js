const SibApiV3Sdk = require("sib-api-v3-sdk");


const envoyerEmail = async (email, sujet, message) => {

  try {

    if(!process.env.BREVO_API_KEY){
      throw new Error("BREVO_API_KEY manquante");
    }


    const client = SibApiV3Sdk.ApiClient.instance;


    client.authentications["api-key"].apiKey =
      process.env.BREVO_API_KEY;


    const apiInstance =
      new SibApiV3Sdk.TransactionalEmailsApi();


    const mail =
      new SibApiV3Sdk.SendSmtpEmail();


    mail.sender = {
      name: "Gestion-Bail RDC",
      email: process.env.EMAIL_FROM
    };


    mail.to = [
      {
        email: email
      }
    ];


    mail.subject = sujet;


    mail.textContent = message;


    const response =
      await apiInstance.sendTransacEmail(mail);


    console.log(
      "Email envoyé avec succès:",
      email
    );


    return response;


  } catch(error){

    console.log(
      "Erreur Brevo:",
      error.message
    );

    throw error;

  }

};


module.exports = envoyerEmail;