const express = require("express");
const router = express.Router();
const categorieController = require("../controllers/categorieController");
const auth = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

router.get("/", categorieController.getCategories);
router.post("/", auth, authorize("admin", "bailleur"), categorieController.createCategorie);
router.put("/:id", auth, authorize("admin", "bailleur"), categorieController.updateCategorie);
router.delete("/:id", auth, authorize("admin"), categorieController.deleteCategorie);

module.exports = router;
