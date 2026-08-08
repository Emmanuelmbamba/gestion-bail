/**
 * Service d'envoi de SMS (Code de confirmation OTP)
 */
const sendSMSCode = async (telephone, code) => {
  const message = `[Gestion-Bail] Votre code de confirmation de compte est : ${code}. Il expire dans 15 minutes.`;

  console.log("==========================================");
  console.log(`📲 [SMS SERVICE] ENVOI SMS AU : ${telephone}`);
  console.log(`💬 MESSAGE : ${message}`);
  console.log("==========================================");

  // Si des clés d'API SMS (Twilio, Infobip, etc.) sont configurées dans l'environnement :
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER) {
    try {
      const client = require("twilio")(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
      await client.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: telephone
      });
      console.log("✅ SMS envoyé avec succès via Twilio à", telephone);
    } catch (err) {
      console.error("❌ Erreur envoi SMS Twilio :", err.message);
    }
  }

  return { success: true, telephone, code };
};

module.exports = { sendSMSCode };
