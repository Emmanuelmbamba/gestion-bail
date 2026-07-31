const mongoose = require("mongoose");

const contratSchema = new mongoose.Schema({
    numeroContrat: {
        type: String,
        unique: true,
        required: true
    },
    contratSigne: {
        url: String,
        public_id: String
    },
    bien: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bien",
        required: true
    },
    bailleur: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    locataire: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    dateDebut: {
        type: Date,
        required: true
    },
    dateFin: {
        type: Date,
        required: true
    },
    dureeMois: {
        type: Number,
        default: 0
    },
    montantLoyer: {
        type: Number,
        required: true
    },
    caution: {
        type: Number,
        default: 0
    },
    conditions: {
        type: String,
        default: ""
    },
    signatureElectronique: {
        type: Boolean,
        default: false
    },
    signeBailleur: {
        type: Boolean,
        default: false
    },
    signeLocataire: {
        type: Boolean,
        default: false
    },
    statut: {
        type: String,
        enum: ["actif", "expire", "resilie", "en_attente"],
        default: "en_attente"
    },
    contratPDF: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Contrat", contratSchema);