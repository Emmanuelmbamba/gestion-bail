/* const brevo = require("@getbrevo/brevo");

const envoyerEmail = async (email, sujet, message) => {
  try {

    const apiInstance = new brevo.TransactionalEmailsApi();

    apiInstance.setApiKey(
      brevo.TransactionalEmailsApiApiKeys.apiKey,
      process.env.BREVO_API_KEY
    );

    const mail = new brevo.SendSmtpEmail();

    mail.subject = sujet;
    mail.textContent = message;

    mail.sender = {
      name: "Gestion-Bail",
      email: process.env.EMAIL_FROM,
    };

    mail.to = [
      {
        email: email,
      },
    ];

    await apiInstance.sendTransacEmail(mail);

    console.log("✅ Email envoyé :", email);

  } catch (error) {
    console.error("❌ Erreur Brevo :", error);
    throw error;
  }
};

module.exports = envoyerEmail;*/

const brevo = require("@getbrevo/brevo");

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


    await apiInstance.sendTransacEmail(sendSmtpEmail);

    console.log("✅ Email envoyé :", email);

  } catch (error) {

    console.error(
      "❌ Erreur Brevo :",
      error
    );

    throw error;
  }
};


module.exports = envoyerEmail;