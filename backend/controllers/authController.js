const User = require("../models/User");
const Contrat = require("../models/Contrat");
const Locataire = require("../models/Locataire");
const Bailleur = require("../models/Bailleur");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const envoyerEmail = require("../services/emailService");

// ======================
// REGISTER
// ======================
    
// ======================
// REGISTER
// ======================
exports.register = async (req, res) => {
  console.log("=== REGISTER ===");
  console.log("Body reçu :", req.body);

  try {
    console.log("Données reçues :", req.body);

    const { nom, email, password, role } = req.body;

    const existe = await User.findOne({ email });

    if (existe) {
      return res.status(400).json({
        message: "Email déjà utilisé",
      });
    }

    // ... le reste de ton code 

    const hashPassword = await bcrypt.hash(password, 10);

    const token = crypto.randomBytes(30).toString("hex");

    const user = await User.create({
      nom,
      email,
      password: hashPassword,
      role,
      estConfirme: false, // remettre false quand l'email fonctionnera
      verificationToken: token,
    });

    // ======================
    // Email désactivé temporairement
    // ======================
    
    const urlConfirmation = `https://gestion-bail.onrender.com/api/auth/verify/${token}`;

    try {
  await envoyerEmail(
    email,
    "Confirmation de votre compte",
    `Bonjour ${nom},

Merci pour votre inscription.

Veuillez confirmer votre compte :
${urlConfirmation}
`
  );

  console.log("✅ Email envoyé à :", email);

} catch (emailError) {
  console.log("❌ ERREUR EMAIL :", emailError);
}

    return res.status(201).json({
  message: "Compte créé. Vérifiez votre email pour activer votre compte.",
  user: {
    nom: user.nom,
    email: user.email,
    role: user.role
  },
});

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

// ======================
// LOGIN
// ======================
exports.login = async (req, res) => {
  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "Utilisateur introuvable",
      });
    }

    // Vérification email désactivée
    if (!user.estConfirme) {
    return res.status(403).json({
    message: "Veuillez confirmer votre adresse e-mail."
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
      process.env.JWT_SECRET,
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
// LOCATAIRES
// ======================
exports.getLocataires = async (req, res) => {
  try {
    const locataires = await User.find({ role: "locataire" }).select("-password");
    res.json(locataires);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ======================
// BAILLEURS
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
        message: "Utilisateur introuvable",
      });
    }

    const token = crypto.randomBytes(20).toString("hex");

    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000;

await user.save();

const resetUrl =`https://gestion-bail-frontend.onrender.com/reset-password?token=${token}`;

try {
  await envoyerEmail(  email,  "Réinitialisation du mot de passe",  `Bonjour ${user.nom},

Vous avez demandé une modification de votre mot de passe.

Cliquez sur ce lien pour créer un nouveau mot de passe :

${resetUrl}

Ce lien expire dans 1 heure.

Gestion-Bail RDC`
);

  console.log("✅ Email reset envoyé à :", email);

} catch (emailError) {
  console.log("❌ Erreur envoi reset :", emailError);
}

res.json({
  message: "Un lien de réinitialisation a été envoyé à votre adresse email.",
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

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Jeton invalide ou expiré",
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
      $or: [
        { locataire: userId },
        { bailleur: userId },
      ],
    });

    if (hasContract) {
      return res.status(400).json({
        message: "Impossible de supprimer le compte car un contrat existe.",
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

    const user = await User.findOne({
      verificationToken: req.params.token,
    });

    if (!user) {
      return res.status(400).send("Lien invalide.");
    }

    user.estConfirme = true;
    user.verificationToken = null;

    await user.save();

    res.redirect(
  `${process.env.FRONTEND_URL}/login?verified=true`
);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};