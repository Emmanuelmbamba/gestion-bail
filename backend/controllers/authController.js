const User = require("../models/User");
const Contrat = require("../models/Contrat");
const Locataire = require("../models/Locataire");
const Bailleur = require("../models/Bailleur");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const envoyerEmail = require("../services/emailService");
const smsService = require("../services/smsService");

const BACKEND_URL = process.env.BACKEND_URL || "https://gestion-bail-backend.onrender.com";
const FRONTEND_URL = process.env.FRONTEND_URL || "https://gestion-bail-frontend.onrender.com";

// ======================
// REGISTER (Inscription avec Code SMS)
// ======================
exports.register = async (req, res) => {
  console.log("=== REGISTER (SMS OPTION) ===");
  console.log("Body reçu :", req.body);

  try {
    const { nom, email, password, role, telephone } = req.body;

    const existe = await User.findOne({ email });
    if (existe) {
      return res.status(400).json({
        message: "Email déjà utilisé",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const userPhone = telephone && telephone.trim() ? telephone.trim() : "Non renseigné";
    
    // Génération du code de validation SMS à 6 chiffres
    const smsCode = Math.floor(100000 + Math.random() * 900000).toString();
    const smsCodeExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    const user = await User.create({
      nom,
      email,
      password: hashPassword,
      role: role || "locataire",
      telephone: userPhone,
      estConfirme: false,
      smsCode,
      smsCodeExpires
    });

    // Création automatique du profil Locataire ou Bailleur avec le téléphone rattaché
    if (user.role === "locataire") {
      await Locataire.create({
        user: user._id,
        nom: user.nom,
        email: user.email,
        telephone: userPhone
      });
    } else if (user.role === "bailleur") {
      await Bailleur.create({
        user: user._id,
        nom: user.nom,
        email: user.email,
        telephone: userPhone
      });
    }

    // Envoi du code SMS
    await smsService.sendSMSCode(userPhone, smsCode);

    return res.status(201).json({
      message: "Compte créé avec succès ! Un code de confirmation à 6 chiffres vous a été envoyé par SMS.",
      requireSmsVerification: true,
      email: user.email,
      telephone: user.telephone,
      smsCode: smsCode, // transmis pour démonstration/test immédiat
      user: {
        nom: user.nom,
        email: user.email,
        telephone: user.telephone,
        role: user.role
      },
    });
  } catch (error) {
    console.error("Erreur Inscription:", error);
    return res.status(500).json({
      message: error.message || "Erreur serveur lors de l'inscription",
    });
  }
};

// ======================
// VÉRIFICATION CODE SMS
// ======================
exports.verifySmsCode = async (req, res) => {
  try {
    const { identifier, code } = req.body;

    if (!identifier || !code) {
      return res.status(400).json({ message: "Veuillez fournir le numéro de téléphone/e-mail et le code SMS." });
    }

    const cleanCode = code.toString().trim();

    const user = await User.findOne({
      $or: [
        { email: identifier.trim() },
        { telephone: identifier.trim() }
      ]
    });

    if (!user) {
      return res.status(404).json({ message: "Compte utilisateur introuvable." });
    }

    if (user.estConfirme) {
      return res.status(400).json({ message: "Ce compte est déjà confirmé. Vous pouvez vous connecter." });
    }

    if (!user.smsCode || user.smsCode !== cleanCode) {
      return res.status(400).json({ message: "Code de confirmation SMS incorrect." });
    }

    if (user.smsCodeExpires && user.smsCodeExpires < Date.now()) {
      return res.status(400).json({ message: "Le code SMS a expiré. Veuillez demander un nouveau code." });
    }

    user.estConfirme = true;
    user.smsCode = null;
    user.smsCodeExpires = null;
    await user.save();

    // Génération automatique du token JWT de connexion
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        nom: user.nom,
        email: user.email,
      },
      process.env.JWT_SECRET || "SUPER_SECRET_KEY",
      {
        expiresIn: "7d",
      }
    );

    res.json({
      message: "Votre compte a été confirmé avec succès par SMS !",
      token,
      user: {
        id: user._id,
        nom: user.nom,
        email: user.email,
        role: user.role,
        telephone: user.telephone
      }
    });
  } catch (error) {
    console.error("Erreur vérification SMS:", error);
    res.status(500).json({ message: error.message || "Erreur lors de la vérification du code SMS" });
  }
};

// ======================
// RENVOYER CODE SMS
// ======================
exports.resendSmsCode = async (req, res) => {
  try {
    const { identifier } = req.body;

    if (!identifier) {
      return res.status(400).json({ message: "Veuillez fournir le numéro de téléphone ou l'adresse e-mail." });
    }

    const user = await User.findOne({
      $or: [
        { email: identifier.trim() },
        { telephone: identifier.trim() }
      ]
    });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable." });
    }

    if (user.estConfirme) {
      return res.status(400).json({ message: "Ce compte a déjà été confirmé." });
    }

    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.smsCode = newCode;
    user.smsCodeExpires = Date.now() + 15 * 60 * 1000;
    await user.save();

    await smsService.sendSMSCode(user.telephone || identifier, newCode);

    res.json({
      message: "Un nouveau code de confirmation SMS vous a été envoyé.",
      smsCode: newCode
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Erreur lors du renvoi du code SMS" });
  }
};

// ======================
// LOGIN
// ======================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      $or: [
        { email: email ? email.trim() : "" },
        { telephone: email ? email.trim() : "" }
      ]
    });

    if (!user) {
      return res.status(404).json({
        message: "Utilisateur introuvable",
      });
    }

    if (!user.estConfirme) {
      return res.status(403).json({
        message: "Veuillez valider votre compte avec le code à 6 chiffres reçu par SMS.",
        requireSmsVerification: true,
        identifier: user.telephone || user.email
      });
    }

    const valide = await bcrypt.compare(password, user.password);
    if (!valide) {
      return res.status(400).json({
        message: "Mot de passe incorrect",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        nom: user.nom,
        email: user.email,
      },
      process.env.JWT_SECRET || "SUPER_SECRET_KEY",
      {
        expiresIn: "7d",
      }
    );

    res.json({
      token,
      user: {
        id: user._id,
        nom: user.nom,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ======================
// LOCATAIRES (Users list)
// ======================
exports.getLocataires = async (req, res) => {
  try {
    const userRole = (req.user?.role || "").toLowerCase();
    const userIdStr = req.user?.id ? req.user.id.toString() : "";

    if (userRole === "bailleur") {
      const Bailleur = require("../models/Bailleur");
      const Bien = require("../models/Bien");
      const DemandeVisite = require("../models/DemandeVisite");
      const Contrat = require("../models/Contrat");

      const bailleurProfile = await Bailleur.findOne({ user: userIdStr });
      const bailleurIds = [userIdStr];
      if (bailleurProfile) {
        bailleurIds.push(bailleurProfile._id.toString());
      }

      // 1. Vos biens
      const mesBiens = await Bien.find({
        $or: [
          { bailleur: { $in: bailleurIds } },
          { proprietaire: { $in: bailleurIds } }
        ]
      }).select("_id");
      const bienIds = mesBiens.map((b) => b._id);

      // 2. Utilisateurs ayant demandé une visite pour vos biens
      const visites = await DemandeVisite.find({ bien: { $in: bienIds } }).select("client");
      const visitClientIds = visites.map((v) => v.client).filter(Boolean);

      // 3. Locataires sous contrat avec vous
      const contrats = await Contrat.find({
        $or: [
          { bailleur: { $in: bailleurIds } }
        ]
      }).select("locataire");
      const contratLocataireIds = contrats.map((c) => c.locataire).filter(Boolean);

      const allowedUserIds = [...new Set([...visitClientIds, ...contratLocataireIds].map(id => id.toString()))];

      const locataires = await User.find({
        _id: { $in: allowedUserIds },
        role: "locataire"
      }).select("-password");

      return res.json(locataires);
    }

    // Admin / Agent : tous les locataires
    const locataires = await User.find({ role: "locataire" }).select("-password");
    res.json(locataires);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ======================
// BAILLEURS (Users list)
// ======================
exports.getBailleursUsers = async (req, res) => {
  try {
    const bailleurs = await User.find({ role: "bailleur" }).select("-password");
    res.json(bailleurs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ======================
// MOT DE PASSE OUBLIÉ
// ======================
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "Utilisateur introuvable avec cet e-mail",
      });
    }

    const token = crypto.randomBytes(20).toString("hex");

    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 heure
    await user.save();

    const resetUrl = `${FRONTEND_URL}/reset-password/${token}`;

    try {
      await envoyerEmail(
        email,
        "Réinitialisation du mot de passe - Gestion-Bail",
        `Bonjour ${user.nom},

Vous avez demandé la réinitialisation de votre mot de passe.

Veuillez cliquer sur le lien ci-dessous pour créer votre nouveau mot de passe :
${resetUrl}

Ce lien expire dans 1 heure.

L'équipe Gestion-Bail`
      );
      console.log("✅ Email de réinitialisation envoyé à :", email);
    } catch (emailError) {
      console.log("❌ Erreur envoi réinitialisation :", emailError);
    }

    res.json({
      message: "Un lien de réinitialisation valide a été envoyé à votre e-mail.",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ======================
// RESET PASSWORD
// ======================
exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token) {
      return res.status(400).json({
        message: "Jeton de réinitialisation manquant.",
      });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Jeton invalide ou expiré.",
      });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.json({
      message: "Mot de passe modifié avec succès.",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ======================
// SUPPRESSION COMPTE
// ======================
exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    const hasContract = await Contrat.findOne({
      $or: [{ locataire: userId }, { bailleur: userId }],
    });

    if (hasContract) {
      return res.status(400).json({
        message: "Impossible de supprimer le compte car un contrat de bail actif est rattaché.",
      });
    }

    await Locataire.findOneAndDelete({ user: userId });
    await Bailleur.findOneAndDelete({ user: userId });
    await User.findByIdAndDelete(userId);

    res.json({
      message: "Compte supprimé avec succès.",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ======================
// CONFIRMATION EMAIL
// ======================
exports.verifyEmail = async (req, res) => {
  try {
    const token = req.params.token;

    const user = await User.findOne({
      verificationToken: token,
    });

    if (!user) {
      return res.status(400).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Lien invalide - Gestion-Bail</title>
          <style>
            body { font-family: system-ui, sans-serif; text-align: center; padding: 60px 20px; background-color: #f8fafc; color: #1e293b; }
            .card { background: white; border-radius: 24px; padding: 40px; max-width: 450px; margin: auto; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
            h2 { color: #dc2626; margin-bottom: 12px; }
            p { color: #64748b; font-size: 14px; line-height: 1.6; }
            a { display: inline-block; margin-top: 20px; padding: 12px 24px; background: #2563eb; color: white; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="card">
            <h2>Lien invalide ou expiré ❌</h2>
            <p>Ce lien de confirmation a déjà été utilisé ou n'existe plus.</p>
            <a href="${FRONTEND_URL}/login">Se connecter</a>
          </div>
        </body>
        </html>
      `);
    }

    user.estConfirme = true;
    user.verificationToken = null;
    await user.save();

    res.redirect(`${FRONTEND_URL}/login?verified=true`);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};