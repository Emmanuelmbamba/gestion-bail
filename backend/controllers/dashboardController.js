const mongoose = require("mongoose");
const Bien = require("../models/Bien");
const Locataire = require("../models/Locataire");
const Contrat = require("../models/Contrat");
const Paiement = require("../models/Paiement");
const User = require("../models/User");

exports.getStats = async (req, res) => {
  try {
    const role = req.user.role;
    const userId = req.user.id;

    let biens = 0;
    let locataires = 0;
    let contrats = 0;
    let contratsActifs = 0;
    let contratsExpires = 0;
    let paiementsEnRetard = 0;
    let users = 0;

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    let matchQueryMensuel = { datePaiement: { $gte: startOfMonth }, statut: { $ne: "impayé" } };
    let matchQueryAnnuel = { datePaiement: { $gte: startOfYear }, statut: { $ne: "impayé" } };

    if (role === "locataire") {
      const userContrats = await Contrat.find({ locataire: userId }).select("bien");
      const bienIds = userContrats.map(c => c.bien);
      biens = new Set(bienIds.map(id => id.toString())).size;
      locataires = 1;
      contrats = userContrats.length;
      contratsActifs = await Contrat.countDocuments({ locataire: userId, statut: "actif" });
      contratsExpires = await Contrat.countDocuments({ locataire: userId, statut: "expire" });
      paiementsEnRetard = await Paiement.countDocuments({ locataire: userId, statut: "en_retard" });
      users = 1;

      matchQueryMensuel.locataire = new mongoose.Types.ObjectId(userId);
      matchQueryAnnuel.locataire = new mongoose.Types.ObjectId(userId);
    } else if (role === "bailleur") {
      biens = await Bien.countDocuments({ proprietaire: userId });
      
      const userContrats = await Contrat.find({ bailleur: userId }).select("_id locataire");
      const contratIds = userContrats.map(c => c._id);
      const locataireIds = userContrats.map(c => c.locataire);
      locataires = new Set(locataireIds.map(id => id.toString())).size;
      contrats = userContrats.length;
      contratsActifs = await Contrat.countDocuments({ bailleur: userId, statut: "actif" });
      contratsExpires = await Contrat.countDocuments({ bailleur: userId, statut: "expire" });
      paiementsEnRetard = await Paiement.countDocuments({ contrat: { $in: contratIds }, statut: "en_retard" });
      
      const associatedUsers = await User.find({ _id: { $in: locataireIds } }).countDocuments();
      users = associatedUsers;

      matchQueryMensuel.contrat = { $in: contratIds.map(id => new mongoose.Types.ObjectId(id)) };
      matchQueryAnnuel.contrat = { $in: contratIds.map(id => new mongoose.Types.ObjectId(id)) };
    } else {
      // Admin / Agent
      biens = await Bien.countDocuments();
      locataires = await Locataire.countDocuments();
      contrats = await Contrat.countDocuments();
      contratsActifs = await Contrat.countDocuments({ statut: "actif" });
      contratsExpires = await Contrat.countDocuments({ statut: "expire" });
      paiementsEnRetard = await Paiement.countDocuments({ statut: "en_retard" });
      users = await User.countDocuments();
    }

    const revenusMensuels = await Paiement.aggregate([
      { $match: matchQueryMensuel },
      { $group: { _id: null, total: { $sum: "$montant" } } }
    ]);

    const revenusAnnuels = await Paiement.aggregate([
      { $match: matchQueryAnnuel },
      { $group: { _id: null, total: { $sum: "$montant" } } }
    ]);

    res.json({
      biens,
      locataires,
      contrats,
      users,
      contratsActifs,
      contratsExpires,
      paiementsEnRetard,
      revenusMensuels: role === "locataire" ? 0 : (revenusMensuels[0]?.total || 0),
      revenusAnnuels: role === "locataire" ? 0 : (revenusAnnuels[0]?.total || 0),
      revenus: role === "locataire" ? 0 : (revenusAnnuels[0]?.total || 0)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};