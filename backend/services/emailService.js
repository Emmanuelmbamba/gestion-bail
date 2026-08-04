const SibApiV3Sdk = require("sib-api-v3-sdk");


const envoyerEmail = async (email, sujet, message) => {

  try {

    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();


    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();


    sendSmtpEmail.subject = sujet;


    sendSmtpEmail.textContent = message;


    sendSmtpEmail.sender = {
      name: "Gestion-Bail RDC",
      email: process.env.EMAIL_FROM
    };


    sendSmtpEmail.to = [
      {
        email: email
      }
    ];


    const apiClient = SibApiV3Sdk.ApiClient.instance;


    apiClient.authentications["api-key"].apiKey =
      process.env.BREVO_API_KEY;


    await apiInstance.sendTransacEmail(
      sendSmtpEmail
    );


    console.log("✅ Email envoyé :", email);


  } catch(error) {

    console.error(
      "❌ Erreur Brevo :",
      error
    );

    throw error;

  }

};


module.exports = envoyerEmail;