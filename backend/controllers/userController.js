const User = require("../models/User");
const Locataire = require("../models/Locataire");
const Bailleur = require("../models/Bailleur");
const bcrypt = require("bcryptjs");

// GET ALL USERS (Admin)
exports.getAllUsers = async (req, res) => {
  try {
    let query = {};
    if (req.query.search) {
      const regex = new RegExp(req.query.search, "i");
      query = {
        $or: [{ nom: regex }, { email: regex }, { role: regex }],
      };
    }
    const users = await User.find(query).select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message || "Erreur serveur lors de la récupération des utilisateurs" });
  }
};

// CREATE USER (Admin)
exports.createUser = async (req, res) => {
  try {
    const { nom, email, password, role, estConfirme, telephone } = req.body;
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Un utilisateur existe déjà avec cet e-mail" });
    }
    const hashPassword = await bcrypt.hash(password || "123456", 10);
    const user = await User.create({
      nom,
      email,
      password: hashPassword,
      role: role || "locataire",
      estConfirme: estConfirme !== undefined ? estConfirme : true,
    });

    const userPhone = telephone || "Non renseigné";

    if (user.role === "locataire") {
      const locExist = await Locataire.findOne({ user: user._id });
      if (!locExist) {
        await Locataire.create({
          user: user._id,
          nom: user.nom,
          email: user.email,
          telephone: userPhone,
        });
      }
    } else if (user.role === "bailleur") {
      const bailExist = await Bailleur.findOne({ user: user._id });
      if (!bailExist) {
        await Bailleur.create({
          user: user._id,
          nom: user.nom,
          email: user.email,
          telephone: userPhone,
        });
      }
    }

    res.status(201).json({
      message: "Utilisateur créé avec succès",
      user: {
        _id: user._id,
        nom: user.nom,
        email: user.email,
        role: user.role,
        estConfirme: user.estConfirme,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Erreur serveur lors de la création d'utilisateur" });
  }
};

// UPDATE USER (Admin)
exports.updateUser = async (req, res) => {
  try {
    const { nom, email, role, estConfirme, password, telephone } = req.body;
    const updateData = { nom, email, role, estConfirme };

    if (password && password.trim()) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true }).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    // Synchronize associated Locataire or Bailleur profiles
    const userPhone = telephone || "Non renseigné";
    await Locataire.updateMany({ user: user._id }, { nom: user.nom, email: user.email, ...(telephone && { telephone }) });
    await Bailleur.updateMany({ user: user._id }, { nom: user.nom, email: user.email, ...(telephone && { telephone }) });

    if (user.role === "locataire") {
      const locExist = await Locataire.findOne({ user: user._id });
      if (!locExist) {
        await Locataire.create({
          user: user._id,
          nom: user.nom,
          email: user.email,
          telephone: userPhone,
        });
      }
    } else if (user.role === "bailleur") {
      const bailExist = await Bailleur.findOne({ user: user._id });
      if (!bailExist) {
        await Bailleur.create({
          user: user._id,
          nom: user.nom,
          email: user.email,
          telephone: userPhone,
        });
      }
    }

    res.json({ message: "Utilisateur mis à jour avec succès", user });
  } catch (error) {
    res.status(500).json({ message: error.message || "Erreur serveur lors de la mise à jour" });
  }
};

// DELETE USER (Admin)
exports.deleteUser = async (req, res) => {
  try {
    if (req.params.id === req.user.id) {
      return res.status(400).json({ message: "Vous ne pouvez pas supprimer votre propre compte administrateur connecté" });
    }
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    // Clean up associated profile records
    await Locataire.deleteMany({ user: req.params.id });
    await Bailleur.deleteMany({ user: req.params.id });

    res.json({ message: "Utilisateur et ses profils associés supprimés avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Erreur serveur lors de la suppression" });
  }
};
