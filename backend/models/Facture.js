const mongoose = require("mongoose");

const factureSchema = new mongoose.Schema({
    numeroFacture: {
        type: String,
        unique: true,
        required: true
    },
    paiement: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Paiement",
        required: true
    },
    locataire: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    montant: {
        type: Number,
        required: true
    },
    dateEmission: {
        type: Date,
        default: Date.now
    },
    fichierPDF: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Facture", factureSchema);