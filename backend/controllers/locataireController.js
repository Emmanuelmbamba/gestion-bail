const Locataire = require("../models/Locataire");
const Contrat = require("../models/Contrat");

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

// GET ALL LOCATAIRES
exports.getLocataires = async (req, res) => {
  try {
    let query = {};
    if (req.user && req.user.role === "bailleur") {
      const contrats = await Contrat.find({ bailleur: req.user.id }).select("locataire");
      const locataireIds = contrats.map((c) => c.locataire).filter(Boolean);
      query = {
        $or: [
          { user: { $in: locataireIds } },
          { _id: { $in: locataireIds } }
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