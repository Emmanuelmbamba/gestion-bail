const express = require("express");
const router = express.Router();
const proteger = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const {
  creerFacture,
  listeFactures,
  downloadFacture
} = require("../controllers/factureController");

router.post("/", proteger, role("admin", "agent", "bailleur"), creerFacture);
router.get("/", proteger, listeFactures);
router.get("/download/:id", proteger, downloadFacture);

module.exports = router;