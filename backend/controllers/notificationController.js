const Notification = require("../models/Notification");
const Contrat = require("../models/Contrat");
const Paiement = require("../models/Paiement");

const mesNotifications = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Check for Expiring Contracts
    const activeContrats = await Contrat.find({
      $or: [{ bailleur: userId }, { locataire: userId }],
      statut: "actif"
    }).populate("bien locataire bailleur");

    const now = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(now.getDate() + 30);

    for (const contrat of activeContrats) {
      if (contrat.dateFin && new Date(contrat.dateFin) <= thirtyDaysFromNow) {
        const formattedDate = new Date(contrat.dateFin).toLocaleDateString("fr-FR");
        const message = `Le contrat ${contrat.numeroContrat} pour le bien "${contrat.bien?.titre || 'Bien'}" expire le ${formattedDate}.`;
        
        const exists = await Notification.findOne({
          user: userId,
          titre: "Contrat expirant",
          message: message
        });

        if (!exists) {
          await Notification.create({
            user: userId,
            titre: "Contrat expirant",
            message: message,
            type: "rappel"
          });
        }
      }
    }

    // 2. Check for Rent Due (Loyer à payer)
    const locataireContrats = await Contrat.find({
      locataire: userId,
      statut: "actif"
    }).populate("bien");

    const moisList = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
    const currentMonth = `${moisList[now.getMonth()]} ${now.getFullYear()}`;

    for (const contrat of locataireContrats) {
      const paymentExists = await Paiement.findOne({
        contrat: contrat._id,
        mois: currentMonth,
        typePaiement: "loyer"
      });

      if (!paymentExists) {
        const message = `Votre loyer de ${contrat.montantLoyer} USD pour le mois de ${currentMonth} (${contrat.bien?.titre || 'Bien'}) est à payer.`;
        
        const exists = await Notification.findOne({
          user: userId,
          titre: "Loyer à payer",
          message: message
        });

        if (!exists) {
          await Notification.create({
            user: userId,
            titre: "Loyer à payer",
            message: message,
            type: "rappel"
          });
        }
      }
    }

    const notifications = await Notification.find({
      user: userId
    }).sort({
      createdAt: -1
    });

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const marquerLu = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(
      req.params.id,
      { lu: true }
    );
    res.json({ message: "Notification lue" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  mesNotifications,
  marquerLu
};