const mongoose = require("mongoose");

const paiementSchema = new mongoose.Schema({
    contrat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Contrat",
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
    mois: {
        type: String,
        required: true
    },
    datePaiement: {
        type: Date,
        default: Date.now
    },
    modePaiement: {
        type: String,
        enum: ["cash", "mobile_money", "virement"],
        default: "cash"
    },
    typePaiement: {
        type: String,
        enum: ["loyer", "avance", "caution", "penalite"],
        default: "loyer"
    },
    statut: {
        type: String,
        enum: ["payé", "en_retard", "impayé", "en_attente"],
        default: "en_attente"
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Paiement", paiementSchema);