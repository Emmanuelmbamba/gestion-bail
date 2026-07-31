const express = require("express");
const router = express.Router();
const proteger = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

const {
  createLocataire,
  getLocataires,
  getLocataireById,
  updateLocataire,
  deleteLocataire
} = require("../controllers/locataireController");

router.post("/", proteger, role("admin", "agent", "bailleur"), createLocataire);
router.get("/", proteger, getLocataires);
router.get("/:id", proteger, getLocataireById);
router.put("/:id", proteger, role("admin", "agent", "bailleur", "locataire"), updateLocataire);
router.delete("/:id", proteger, role("admin", "agent", "bailleur"), deleteLocataire);

module.exports = router;