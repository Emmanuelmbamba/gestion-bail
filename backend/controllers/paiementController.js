const Paiement = require("../models/Paiement");
const Locataire = require("../models/Locataire");
const Contrat = require("../models/Contrat");
const Facture = require("../models/Facture");
const Notification = require("../models/Notification");
const genererNumeroFacture = require("../utils/factureNumber");

// =============================
// CREER UN PAIEMENT (LOCATAIRE)
// =============================
exports.creerPaiement = async (req, res) => {
  try {
    if (req.user.role !== "locataire") {
      return res.status(403).json({
        message: "Seul un locataire peut effectuer la déclaration d'un paiement"
      });
    }

    let locataireDoc = await Locataire.findOne({ user: req.user.id });
    const locataireId = locataireDoc ? locataireDoc._id : req.user.id;

    const { contrat, montant, mois, modePaiement, typePaiement } = req.body;

    const contratExiste = await Contrat.findById(contrat).populate("bien bailleur");
    if (!contratExiste) {
      return res.status(404).json({ message: "Contrat introuvable" });
    }

    const paiement = await Paiement.create({
      contrat,
      locataire: req.user.id,
      montant: Number(montant),
      mois,
      modePaiement: modePaiement || "mobile_money",
      typePaiement: typePaiement || "loyer",
      statut: "en_attente"
    });

    // Notifier le bailleur du paiement soumis par son locataire
    if (contratExiste.bailleur) {
      const bailleurUserId = contratExiste.bailleur._id || contratExiste.bailleur;
      await Notification.create({
        user: bailleurUserId,
        titre: "Nouveau paiement à confirmer",
        message: `Votre locataire a soumis un paiement de ${montant} USD pour le mois de ${mois} (${contratExiste.bien?.titre || 'Bien'}).`,
        type: "paiement"
      });
    }

    res.status(201).json({
      message: "Paiement enregistré avec succès. En attente de confirmation par le bailleur.",
      paiement
    });
  } catch (error) {
    console.error("Erreur création paiement:", error);
    res.status(500).json({ message: error.message || "Erreur serveur" });
  }
};

// =============================
// CONFIRMER UN PAIEMENT (BAILLEUR / ADMIN)
// =============================
exports.confirmerPaiement = async (req, res) => {
  try {
    const paiement = await Paiement.findById(req.params.id).populate({
      path: "contrat",
      populate: [{ path: "bien" }, { path: "bailleur" }]
    });

    if (!paiement) {
      return res.status(404).json({ message: "Paiement introuvable" });
    }

    const userIdStr = req.user.id.toString();
    const bailleurIdStr = (paiement.contrat?.bailleur?._id || paiement.contrat?.bailleur || "").toString();

    if (req.user.role !== "admin" && req.user.role !== "agent" && userIdStr !== bailleurIdStr) {
      return res.status(403).json({ message: "Vous n'êtes pas autorisé à confirmer ce paiement." });
    }

    paiement.statut = "payé";
    await paiement.save();

    // Créer la facture correspondante si elle n'existe pas déjà
    const factureExist = await Facture.findOne({ paiement: paiement._id });
    if (!factureExist) {
      await Facture.create({
        numeroFacture: genererNumeroFacture(),
        paiement: paiement._id,
        locataire: paiement.locataire,
        montant: paiement.montant
      });
    }

    // Notifier le locataire
    await Notification.create({
      user: paiement.locataire,
      titre: "Paiement confirmé",
      message: `Votre paiement de ${paiement.montant} USD pour le mois de ${paiement.mois} a été confirmé par le propriétaire.`,
      type: "paiement"
    });

    res.json({
      message: "Paiement confirmé avec succès et quittance générée !",
      paiement
    });
  } catch (error) {
    console.error("Erreur confirmation paiement:", error);
    res.status(500).json({ message: error.message || "Erreur serveur" });
  }
};

// =============================
// LISTE DES PAIEMENTS
// =============================
exports.listePaiements = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === "locataire") {
      let locataireDoc = await Locataire.findOne({ user: req.user.id });
      const locId = locataireDoc ? locataireDoc._id : null;
      query = {
        $or: [
          { locataire: req.user.id },
          ...(locId ? [{ locataire: locId }] : [])
        ]
      };
    } else if (req.user.role === "bailleur") {
      const contrats = await Contrat.find({ bailleur: req.user.id }).select("_id");
      const contratIds = contrats.map((c) => c._id);
      query = { contrat: { $in: contratIds } };
    }

    const paiements = await Paiement.find(query)
      .populate({
        path: "contrat",
        populate: [{ path: "bien" }, { path: "locataire" }, { path: "bailleur" }]
      })
      .populate("locataire")
      .sort({ createdAt: -1 });

    res.json(paiements);
  } catch (error) {
    console.error("Erreur récupération paiements:", error);
    res.status(500).json({ message: "Erreur récupération paiements" });
  }
};