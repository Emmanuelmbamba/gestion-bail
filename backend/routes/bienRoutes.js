const express = require("express");
const router = express.Router();

const {
  createBien,
  getBiens,
  getBienById,
  searchBien,
  deleteBien
} = require("../controllers/bienController");

const auth = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.post(
  "/",
  auth,
  upload.any(),
  createBien
);

router.get(
  "/",
  getBiens
);

router.get(
  "/search",
  searchBien
);

router.get(
  "/:id",
  getBienById
);

router.delete(
  "/:id",
  auth,
  deleteBien
);

module.exports = router;