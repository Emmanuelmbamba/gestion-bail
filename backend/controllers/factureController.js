const Facture = require("../models/Facture");
const Contrat = require("../models/Contrat");
const Paiement = require("../models/Paiement");
const path = require("path");
const genererNumeroFacture = require("../utils/factureNumber");

const creerFacture = async (req, res) => {
  try {
    const facture = await Facture.create({
      numeroFacture: genererNumeroFacture(),
      paiement: req.body.paiement,
      locataire: req.body.locataire,
      montant: req.body.montant
    });
    res.status(201).json({
      message: "Facture créée",
      facture
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const listeFactures = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === "locataire") {
      query = { locataire: req.user.id };
    } else if (req.user.role === "bailleur") {
      const contrats = await Contrat.find({ bailleur: req.user.id }).select("_id");
      const contratIds = contrats.map(c => c._id);
      const paiements = await Paiement.find({ contrat: { $in: contratIds } }).select("_id");
      const paiementIds = paiements.map(p => p._id);
      query = { paiement: { $in: paiementIds } };
    }

    const factures = await Facture.find(query)
      .populate("locataire", "nom email")
      .populate("paiement");
    res.json(factures);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const downloadFacture = async (req, res) => {
  try {
    const facture = await Facture.findById(req.params.id);
    if (!facture) {
      return res.status(404).json({ message: "Facture introuvable" });
    }
    res.download(path.resolve(facture.fichierPDF));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  creerFacture,
  listeFactures,
  downloadFacture
};