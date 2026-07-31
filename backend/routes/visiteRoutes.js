const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");

const {
    creerVisite,
    listeVisites,
    modifierStatut
} = require("../controllers/visiteController");

router.post("/", auth, creerVisite);

router.get("/", auth, listeVisites);

router.put("/:id", auth, modifierStatut);

module.exports = router;    