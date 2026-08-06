const express = require("express");
const router = express.Router();

const {
    creerPaiement,
    listePaiements
} = require("../controllers/paiementController");


const auth = require("../middleware/authMiddleware");



// Liste paiements
router.get(
    "/",
    auth,
    listePaiements
);



// Création paiement
router.post(
    "/",
    auth,
    creerPaiement
);


module.exports = router;