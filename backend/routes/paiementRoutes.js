const express = require("express");
const router = express.Router();
const {
    creerPaiement,
    listePaiements
} = require("../controllers/paiementController");

const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

// Liste des paiements
router.get(
    "/",
    auth,
    listePaiements
);

// Création paiement
router.post(
    "/",
    auth,
    role("admin", "agent", "bailleur"),
    creerPaiement
);

module.exports = router;