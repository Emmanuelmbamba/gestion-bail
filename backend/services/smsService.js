const SibApiV3Sdk = require("sib-api-v3-sdk");

/**
 * Service d'envoi de SMS (Code de confirmation OTP)
 */
const sendSMSCode = async (telephone, code) => {
  const message = `[Gestion-Bail] Votre code de confirmation de compte est : ${code}. Il expire dans 15 minutes.`;

  // Formatage du numéro au format international (ex: RDC +243...)
  let cleanPhone = (telephone || "").toString().replace(/\s+/g, "").replace(/-/g, "");
  if (cleanPhone.startsWith("0")) {
    cleanPhone = "+243" + cleanPhone.substring(1);
  } else if (!cleanPhone.startsWith("+") && cleanPhone.length >= 8) {
    cleanPhone = "+243" + cleanPhone;
  }

  console.log("==========================================");
  console.log(`📲 [SMS SERVICE] ENVOI SMS AU : ${cleanPhone}`);
  console.log(`💬 MESSAGE : ${message}`);
  console.log("==========================================");

  let sent = false;

  // 1. Envoi via Brevo (ex-Sendinblue) Transactional SMS
  if (process.env.BREVO_API_KEY) {
    try {
      const defaultClient = SibApiV3Sdk.ApiClient.instance;
      const apiKey = defaultClient.authentications["api-key"];
      apiKey.apiKey = process.env.BREVO_API_KEY;

      const apiInstance = new SibApiV3Sdk.TransactionalSMSApi();
      const sendTransacSms = new SibApiV3Sdk.SendTransacSms();

      // Format Brevo : Chiffres uniquement sans le signe +
      const recipientNumber = cleanPhone.replace("+", "");
      
      sendTransacSms.sender = "GestionBail";
      sendTransacSms.recipient = recipientNumber;
      sendTransacSms.content = message;
      sendTransacSms.type = "transactional";

      const data = await apiInstance.sendTransacSms(sendTransacSms);
      console.log("✅ SMS transmis avec succès à l'opérateur via Brevo pour :", cleanPhone, data);
      sent = true;
    } catch (err) {
      console.error("❌ Erreur envoi SMS Brevo :", err.response?.body?.message || err.message || err);
    }
  }

  // 2. Envoi via Twilio SMS (si configuré)
  if (!sent && process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER) {
    try {
      const client = require("twilio")(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
      await client.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: cleanPhone
      });
      console.log("✅ SMS envoyé avec succès via Twilio à :", cleanPhone);
      sent = true;
    } catch (err) {
      console.error("❌ Erreur envoi SMS Twilio :", err.message);
    }
  }

  return { success: sent, telephone: cleanPhone, code };
};

module.exports = { sendSMSCode };

