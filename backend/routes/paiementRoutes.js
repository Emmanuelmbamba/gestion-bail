const express = require("express");
const router = express.Router();

const {
  creerPaiement,
  listePaiements,
  confirmerPaiement
} = require("../controllers/paiementController");

const auth = require("../middleware/authMiddleware");

// Liste paiements
router.get("/", auth, listePaiements);

// Création paiement (locataire)
router.post("/", auth, creerPaiement);

// Confirmation paiement (bailleur / admin)
router.put("/confirmer/:id", auth, confirmerPaiement);
router.put("/:id/confirmer", auth, confirmerPaiement);

module.exports = router;