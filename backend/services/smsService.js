const SibApiV3Sdk = require("sib-api-v3-sdk");

function normalizePhone(telephone) {
  let phone = String(telephone || "")
    .trim()
    .replace(/\s+/g, "")
    .replace(/-/g, "")
    .replace(/\(/g, "")
    .replace(/\)/g, "");

  if (phone.startsWith("00")) {
    phone = "+" + phone.substring(2);
  }

  if (phone.startsWith("0")) {
    phone = "+243" + phone.substring(1);
  }

  if (!phone.startsWith("+") && phone.startsWith("243")) {
    phone = "+" + phone;
  }

  if (!phone.startsWith("+") && phone.length >= 9) {
    phone = "+243" + phone;
  }

  const phoneRegex = /^\+[1-9]\d{7,14}$/;

  if (!phoneRegex.test(phone)) {
    throw new Error("Numero de telephone invalide : " + phone);
  }

  return phone;
}

async function sendSMSCode(telephone, code) {
  const message =
    "[Gestion-Bail] Votre code de confirmation de compte est : " +
    code +
    ". Il expire dans 15 minutes.";

  let cleanPhone;

  try {
    cleanPhone = normalizePhone(telephone);
  } catch (error) {
    console.error("Erreur numero telephone :", error.message);

    return {
      success: false,
      telephone,
      code,
      error: error.message
    };
  }

  console.log("==========================================");
  console.log("SMS SERVICE");
  console.log("Numero :", cleanPhone);
  console.log("Message :", message);
  console.log("==========================================");

  let sent = false;

  // BREVO
  if (process.env.BREVO_API_KEY) {
    try {
      const defaultClient = SibApiV3Sdk.ApiClient.instance;

      const apiKey =
        defaultClient.authentications["api-key"];

      apiKey.apiKey = process.env.BREVO_API_KEY;

      const apiInstance =
        new SibApiV3Sdk.TransactionalSMSApi();

      const sendTransacSms =
        new SibApiV3Sdk.SendTransacSms();

      sendTransacSms.sender = "GestionBail";

      sendTransacSms.recipient =
        cleanPhone.replace("+", "");

      sendTransacSms.content = message;
      sendTransacSms.type = "transactional";

      const data =
        await apiInstance.sendTransacSms(
          sendTransacSms
        );

      console.log(
        "SMS Brevo accepte :",
        cleanPhone
      );

      console.log(
        "Reponse Brevo :",
        data
      );

      sent = true;

    } catch (error) {
      console.error(
        "Erreur Brevo :",
        error.response?.body?.message ||
        error.message ||
        error
      );
    }
  }

  // TWILIO
  if (
    !sent &&
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    process.env.TWILIO_PHONE_NUMBER
  ) {
    try {
      const client =
        require("twilio")(
          process.env.TWILIO_ACCOUNT_SID,
          process.env.TWILIO_AUTH_TOKEN
        );

      const response =
        await client.messages.create({
          body: message,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: cleanPhone
        });

      console.log(
        "SMS Twilio accepte :",
        cleanPhone
      );

      console.log(
        "Twilio SID :",
        response.sid
      );

      sent = true;

    } catch (error) {
      console.error(
        "Erreur Twilio :",
        error.message
      );
    }
  }

  if (!sent) {
    console.error(
      "Aucun fournisseur SMS n'a reussi a envoyer le SMS."
    );
  }

  return {
    success: sent,
    telephone: cleanPhone,
    code
  };
}

module.exports = {
  sendSMSCode,
  normalizePhone
};