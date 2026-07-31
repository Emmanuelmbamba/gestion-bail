const express = require("express");
const router = express.Router();
const proteger = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

const {
  createBailleur,
  getBailleurs,
  getBailleurById,
  updateBailleur,
  deleteBailleur
} = require("../controllers/bailleurController");

router.post("/", proteger, role("admin", "agent"), createBailleur);
router.get("/", proteger, getBailleurs);
router.get("/:id", proteger, getBailleurById);
router.put("/:id", proteger, role("admin", "agent", "bailleur"), updateBailleur);
router.delete("/:id", proteger, role("admin", "agent"), deleteBailleur);

module.exports = router;