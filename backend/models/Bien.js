const mongoose = require("mongoose");

const BienSchema = new mongoose.Schema({
  titre: {
    type: String,
    required: true,
  },
  description: String,
  type: {
    type: String,
    enum: ["Appartement", "Maison", "Villa", "Terrain", "Bureau", "Studio"],
  },
  prix: {
    type: Number,
    required: true,
  },
  surface: Number,
  chambres: Number,
  adresse: String,
  ville: String,
  quartier: String,
  images: [String],
  statut: {
    type: String,
    enum: ["Disponible", "Loué", "Réservé"],
    default: "Disponible",
  },
  proprietaire: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Bien", BienSchema);