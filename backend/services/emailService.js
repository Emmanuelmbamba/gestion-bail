const brevo = require("@getbrevo/brevo").default;


const envoyerEmail = async (email, sujet, message) => {
  try {

    const apiInstance = new brevo.TransactionalEmailsApi();


    apiInstance.setApiKey(
      brevo.TransactionalEmailsApiApiKeys.apiKey,
      process.env.BREVO_API_KEY
    );


    const sendSmtpEmail = new brevo.SendSmtpEmail();


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


    const response = await apiInstance.sendTransacEmail(
      sendSmtpEmail
    );


    console.log("✅ Email envoyé :", email);


    return response;


  } catch(error) {

    console.error(
      "❌ Erreur Brevo :",
      error
    );

    throw error;

  }
};


module.exports = envoyerEmail;