const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");

const {
    addFavori,
    removeFavori,
    getFavoris,
    isFavori
} = require("../controllers/favorieController");

router.get("/", auth, getFavoris);

router.get("/check/:id", auth, isFavori);

router.post("/:id", auth, addFavori);

router.delete("/:id", auth, removeFavori);

module.exports = router;