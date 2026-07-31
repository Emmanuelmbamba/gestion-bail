const express = require("express");
const router = express.Router();

const { envoyerMessage } = require("../controllers/contactController");

router.post("/", envoyerMessage);

module.exports = router;