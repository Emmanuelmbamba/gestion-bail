const SibApiV3Sdk = require("sib-api-v3-sdk");


const envoyerEmail = async (email, sujet, message) => {

  try {

    // Configuration clé API Brevo
    const defaultClient = SibApiV3Sdk.ApiClient.instance;

    defaultClient.authentications["api-key"].apiKey =
      process.env.BREVO_API_KEY;


    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();


    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();


    sendSmtpEmail.sender = {
      name: "Gestion-Bail RDC",
      email: process.env.EMAIL_FROM
    };


    sendSmtpEmail.to = [
      {
        email: email
      }
    ];


    sendSmtpEmail.subject = sujet;


    sendSmtpEmail.textContent = message;


    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);


    console.log("✅ Email envoyé :", email);

    return result;


  } catch (error) {

    console.error(
      "❌ Erreur Brevo :",
      error.response?.body || error.message
    );

    throw error;

  }

};


module.exports = envoyerEmail;