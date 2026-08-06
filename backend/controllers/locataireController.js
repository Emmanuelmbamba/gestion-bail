const Locataire = require("../models/Locataire");
const Contrat = require("../models/Contrat");
const Bien = require("../models/Bien");
const DemandeVisite = require("../models/DemandeVisite");

// CREATE LOCATAIRE
exports.createLocataire = async (req, res) => {
  try {
    const locataire = await Locataire.create(req.body);
    res.status(201).json({
      message: "Locataire créé avec succès",
      data: locataire
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL LOCATAIRES (Filtré pour le bailleur : locataires ayant sollicité une visite ou ayant un contrat)
exports.getLocataires = async (req, res) => {
  try {
    let query = {};

    if (req.user && req.user.role === "bailleur") {
      // 1. Biens du bailleur
      const mesBiens = await Bien.find({ bailleur: req.user.id }).select("_id");
      const bienIds = mesBiens.map((b) => b._id);

      // 2. Clients ayant fait une demande de visite pour ses biens
      const visites = await DemandeVisite.find({ bien: { $in: bienIds } }).select("client");
      const visitClientIds = visites.map((v) => v.client).filter(Boolean);

      // 3. Locataires sous contrat avec le bailleur
      const contrats = await Contrat.find({ bailleur: req.user.id }).select("locataire");
      const contratLocataireIds = contrats.map((c) => c.locataire).filter(Boolean);

      // Regroupement de tous les IDs utilisateurs/locataires associés au bailleur
      const allAssociatedIds = [...visitClientIds, ...contratLocataireIds];

      query = {
        $or: [
          { user: { $in: allAssociatedIds } },
          { _id: { $in: allAssociatedIds } }
        ]
      };
    }

    if (req.query.search) {
      const regex = new RegExp(req.query.search, "i");
      const searchConditions = [
        { nom: regex },
        { email: regex },
        { telephone: regex }
      ];
      if (query.$or) {
        query = { $and: [query, { $or: searchConditions }] };
      } else {
        query = { $or: searchConditions };
      }
    }

    const locataires = await Locataire.find(query).populate("user");

    res.json({
      data: locataires
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ONE LOCATAIRE
exports.getLocataireById = async (req, res) => {
  try {
    const locataire = await Locataire.findById(req.params.id).populate("user");
    if (!locataire) {
      return res.status(404).json({ message: "Locataire introuvable" });
    }
    res.json(locataire);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE LOCATAIRE
exports.updateLocataire = async (req, res) => {
  try {
    const locataire = await Locataire.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json({
      message: "Locataire modifié",
      data: locataire
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE LOCATAIRE
exports.deleteLocataire = async (req, res) => {
  try {
    await Locataire.findByIdAndDelete(req.params.id);
    res.json({ message: "Locataire supprimé" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};