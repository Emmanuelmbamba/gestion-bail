const DemandeVisite = require("../models/DemandeVisite");
const Bien = require("../models/Bien");
const Notification = require("../models/Notification");

// Créer une demande de visite
exports.creerVisite = async (req, res) => {
  try {
    const { bien, dateVisite, message } = req.body;

    if (!bien) {
      return res.status(400).json({
        message: "Le bien est obligatoire"
      });
    }

    const bienObj = await Bien.findById(bien);

    const nouvelleVisite = await DemandeVisite.create({
      client: req.user.id,
      bien,
      dateVisite,
      message,
      statut: "En attente"
    });

    // Envoyer une notification au bailleur du bien
    if (bienObj && bienObj.bailleur) {
      const dateStr = dateVisite ? new Date(dateVisite).toLocaleDateString("fr-FR") : "Prochainement";
      await Notification.create({
        user: bienObj.bailleur,
        titre: "Nouvelle demande de visite",
        message: `Un candidat locataire a sollicité une visite pour votre bien "${bienObj.titre}" (Date: ${dateStr}).`,
        type: "visite"
      });
    }

    res.status(201).json({
      message: "Demande de visite envoyée avec succès",
      visite: nouvelleVisite
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Liste des visites
exports.listeVisites = async (req, res) => {
  try {
    let visites = [];
    const userRole = (req.user?.role || "").toLowerCase();
    const userIdStr = req.user?.id ? req.user.id.toString() : "";

    if (userRole === "locataire") {
      visites = await DemandeVisite.find({
        client: userIdStr
      })
        .populate("client", "nom email telephone")
        .populate("bien");
    } else if (userRole === "bailleur") {
      const Bailleur = require("../models/Bailleur");
      const bailleurProfile = await Bailleur.findOne({ user: userIdStr });

      const bailleurIds = [userIdStr];
      if (bailleurProfile) {
        bailleurIds.push(bailleurProfile._id.toString());
      }

      // Trouver tous les biens appartenant à ce bailleur
      const mesBiens = await Bien.find({
        $or: [
          { bailleur: { $in: bailleurIds } },
          { proprietaire: { $in: bailleurIds } }
        ]
      }).select("_id");

      const mesBiensIds = mesBiens.map((b) => b._id);

      // Ne retourner QUE les visites pour les biens du bailleur connecté
      visites = await DemandeVisite.find({
        bien: { $in: mesBiensIds }
      })
        .populate("client", "nom email telephone")
        .populate("bien");
    } else {
      // Admin / Agent : accès à toutes les demandes de visites
      visites = await DemandeVisite.find()
        .populate("client", "nom email telephone")
        .populate("bien");
    }

    res.json(visites);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Modifier le statut d'une visite
exports.modifierStatut = async (req, res) => {
  try {
    const { statut } = req.body;

    const visite = await DemandeVisite.findById(req.params.id);

    if (!visite) {
      return res.status(404).json({
        message: "Visite introuvable"
      });
    }

    const bien = await Bien.findById(visite.bien);
    if (!bien) {
      return res.status(404).json({
        message: "Bien associé introuvable"
      });
    }

    const getObjectIdString = (val) => {
      if (!val) return "";
      if (typeof val === "string") return val;
      if (val._id) return val._id.toString();
      return val.toString();
    };

    const userIdStr = req.user && req.user.id ? req.user.id.toString() : "";
    const userRole = (req.user?.role || "").toLowerCase();

    const Bailleur = require("../models/Bailleur");
    const bailleurProfile = await Bailleur.findOne({ user: userIdStr });
    const bailleurIds = [userIdStr];
    if (bailleurProfile) {
      bailleurIds.push(bailleurProfile._id.toString());
    }

    const bienBailleurId = getObjectIdString(bien.bailleur || bien.proprietaire);
    const isOwner = bailleurIds.includes(bienBailleurId);
    const isAdminOrAgent = userRole === "admin" || userRole === "agent";
    const isClient = visite.client && getObjectIdString(visite.client) === userIdStr;

    if (isAdminOrAgent || isOwner) {
      // Autorisé à modifier le statut
    } else if (isClient) {
      if (statut !== "Annulée") {
        return res.status(403).json({
          message: "En tant que locataire, vous pouvez uniquement annuler votre demande de visite."
        });
      }
    } else {
      return res.status(403).json({
        message: "Vous n'êtes pas autorisé à modifier cette visite."
      });
    }

    visite.statut = statut;
    await visite.save();

    // Notifier le client de la décision
    if (visite.client) {
      await Notification.create({
        user: visite.client,
        titre: `Demande de visite ${statut}`,
        message: `Votre demande de visite pour le bien "${bien.titre}" a été mise à jour : ${statut}.`,
        type: "visite"
      });
    }

    res.json({
      message: "Statut mis à jour avec succès",
      visite
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};