const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    nom: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    role: {
        type: String,
        enum: ["bailleur", "locataire", "admin", "agent"],
        default: "locataire"
    },

    resetPasswordToken: {
        type: String,
        default: null
    },

    resetPasswordExpires: {
        type: Date,
        default: null
    },

    estConfirme: {
        type: Boolean,
        default: false
    },

    verificationToken: {
        type: String,
        default: null
    }

}, {
    timestamps: true
});


module.exports = mongoose.model("User", userSchema);    