const express = require("express");
const router = express.Router();

const proteger = require("../middleware/authMiddleware");

const {
    register,
    login,
    getLocataires,
    getBailleursUsers,
    forgotPassword,
    resetPassword,
    deleteAccount,
    verifyEmail
} = require("../controllers/authController");


router.post("/register", register);

router.post("/login", login);

router.get("/verify/:token", verifyEmail);


router.get("/locataires", proteger, getLocataires);

router.get("/bailleurs", proteger, getBailleursUsers);


router.post("/forgot-password", forgotPassword);

router.post("/reset-password", resetPassword);


router.delete("/delete-account", proteger, deleteAccount);


module.exports = router;