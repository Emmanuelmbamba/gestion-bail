const Notification = require("../models/Notification");
const Contrat = require("../models/Contrat");
const Paiement = require("../models/Paiement");
const Bien = require("../models/Bien");
const DemandeVisite = require("../models/DemandeVisite");

const mesNotifications = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Alertes de contrats expirant (Pour bailleur et locataire)
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
        const message = `Le contrat pour le bien "${contrat.bien?.titre || 'Bien'}" expire le ${formattedDate}.`;

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

    // 2. Alertes de loyer à payer pour les locataires
    if (req.user.role === "locataire") {
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
    }

    // 3. Alertes pour les bailleurs (Demandes de visite en attente)
    if (req.user.role === "bailleur" || req.user.role === "admin") {
      const mesBiens = await Bien.find({ bailleur: userId }).select("_id titre");
      const bienIds = mesBiens.map((b) => b._id);

      const pendingVisites = await DemandeVisite.find({
        bien: { $in: bienIds },
        statut: "En attente"
      }).populate("client bien");

      for (const visite of pendingVisites) {
        const clientNom = visite.client?.nom || "Un candidat";
        const bienTitre = visite.bien?.titre || "votre bien";
        const message = `${clientNom} a sollicité une visite pour "${bienTitre}".`;

        const exists = await Notification.findOne({
          user: userId,
          titre: "Demande de visite",
          message: message
        });

        if (!exists) {
          await Notification.create({
            user: userId,
            titre: "Demande de visite",
            message: message,
            type: "visite"
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