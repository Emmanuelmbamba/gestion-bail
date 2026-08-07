const Bien = require("../models/Bien");
const Contrat = require("../models/Contrat");
const jwt = require("jsonwebtoken");
const jwtConfig = require("../config/jwt");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");
const path = require("path");

// =======================
// Ajouter un bien
// =======================
exports.createBien = async (req, res) => {
  try {
    console.log("========== CREATE BIEN ==========");
    console.log("BODY :", req.body);
    console.log("FILES :", req.files);
    console.log("USER :", req.user);

    let photos = [];

    // Upload images (Cloudinary avec fallback local)
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        let uploadedUrl = "";
        if (
          process.env.CLOUDINARY_CLOUD_NAME &&
          process.env.CLOUDINARY_API_KEY &&
          process.env.CLOUDINARY_API_SECRET
        ) {
          try {
            const result = await cloudinary.uploader.upload(file.path, {
              folder: "gestion-bail",
            });
            uploadedUrl = result.secure_url;
            if (fs.existsSync(file.path)) {
              fs.unlinkSync(file.path);
            }
          } catch (cloudinaryErr) {
            console.error("Cloudinary Error, fallback local:", cloudinaryErr.message);
          }
        }

        if (!uploadedUrl) {
          const targetDir = path.join(__dirname, "../uploads");
          if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
          }
          const targetPath = path.join(targetDir, file.filename);
          if (fs.existsSync(file.path)) {
            fs.renameSync(file.path, targetPath);
          }
          uploadedUrl = `/uploads/${file.filename}`;
        }

        photos.push(uploadedUrl);
      }
    }

    // Normalisation de l'enum status
    let statusValue = (req.body.status || req.body.statut || "disponible").toLowerCase();
    if (!["disponible", "occupé", "réservé", "en_visite"].includes(statusValue)) {
      statusValue = "disponible";
    }

    // Formatage de l'adresse
    let fullAdresse = req.body.adresse || "";
    if (req.body.quartier && !fullAdresse.includes(req.body.quartier)) {
      fullAdresse = `${fullAdresse}, ${req.body.quartier}`;
    }
    if (req.body.ville && !fullAdresse.includes(req.body.ville)) {
      fullAdresse = `${fullAdresse} (${req.body.ville})`;
    }

    const bien = await Bien.create({
      titre: req.body.titre,
      type: req.body.type || "Maison",
      adresse: fullAdresse,
      description: req.body.description || "",
      prix: Number(req.body.prix),
      chambres: Number(req.body.chambres || 0),
      sallesBain: Number(req.body.sallesBain || 0),
      images: photos,
      status: statusValue,
      bailleur: req.user.id,
    });

    res.status(201).json({
      message: "Bien publié avec succès",
      bien,
    });
  } catch (error) {
    console.error("ERREUR CREATE BIEN :", error);
    res.status(500).json({
      message: error.message || "Erreur lors de la création du bien",
    });
  }
};

// =======================
// Liste des biens
// =======================
exports.getBiens = async (req, res) => {
  try {
    let query = {};
    const { dashboard } = req.query;

    if (dashboard === "true") {
      const token = req.headers.authorization?.split(" ")[1];

      if (token) {
        try {
          const decoded = jwt.verify(token, jwtConfig.secret);

          if (decoded.role === "bailleur") {
            query = { bailleur: decoded.id };
          } else if (decoded.role === "locataire") {
            const contrats = await Contrat.find({ locataire: decoded.id }).select("bien");
            const ids = contrats.map((c) => c.bien);
            query = { _id: { $in: ids } };
          }
        } catch (err) {
          console.log("Token ignoré :", err.message);
        }
      }
    }

    const biens = await Bien.find(query)
      .populate("bailleur", "nom email")
      .sort({ createdAt: -1 });

    res.json(biens);
  } catch (error) {
    console.error("Erreur getBiens :", error);
    res.status(500).json({ message: error.message });
  }
};

// =======================
// Détail d'un bien
// =======================
exports.getBienById = async (req, res) => {
  try {
    const bien = await Bien.findById(req.params.id).populate("bailleur", "nom email");

    if (!bien) {
      return res.status(404).json({ message: "Bien introuvable" });
    }

    res.json(bien);
  } catch (error) {
    console.error("Erreur getBienById :", error);
    res.status(500).json({ message: error.message });
  }
};

// =======================
// Recherche des biens
// =======================
exports.searchBien = async (req, res) => {
  try {
    const { ville, type, min, max, statut, q } = req.query;
    let filtre = {};

    // Recherche par mots clés (ville, quartier, adresse, titre)
    const searchTerm = (q || ville || "").trim();
    if (searchTerm) {
      const regex = new RegExp(searchTerm, "i");
      filtre.$or = [
        { adresse: regex },
        { titre: regex },
        { description: regex }
      ];
    }

    // Type de bien (insensible à la casse)
    if (type && type.trim()) {
      filtre.type = new RegExp(`^${type.trim()}$`, "i");
    }

    // Statut
    if (statut && statut.trim()) {
      filtre.status = new RegExp(`^${statut.trim()}$`, "i");
    }

    // Filtrage précis par prix min et/ou max
    const minPrice = min !== undefined && min !== null && min !== "" ? Number(min) : null;
    const maxPrice = max !== undefined && max !== null && max !== "" ? Number(max) : null;

    if (minPrice !== null && !isNaN(minPrice) && maxPrice !== null && !isNaN(maxPrice)) {
      filtre.prix = { $gte: minPrice, $lte: maxPrice };
    } else if (minPrice !== null && !isNaN(minPrice)) {
      filtre.prix = { $gte: minPrice };
    } else if (maxPrice !== null && !isNaN(maxPrice)) {
      filtre.prix = { $lte: maxPrice };
    }

    console.log("=== FILTRE DE RECHERCHE BIENS ===", filtre);

    const biens = await Bien.find(filtre).sort({ prix: 1, createdAt: -1 });
    res.json(biens);
  } catch (error) {
    console.error("Erreur searchBien :", error);
    res.status(500).json({ message: error.message });
  }
};

// =======================
// Supprimer un bien
// =======================
exports.deleteBien = async (req, res) => {
  try {
    const bien = await Bien.findById(req.params.id);

    if (!bien) {
      return res.status(404).json({ message: "Bien introuvable" });
    }

    if (
      bien.bailleur &&
      bien.bailleur.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Action non autorisée" });
    }

    await Bien.findByIdAndDelete(req.params.id);

    res.json({ message: "Bien supprimé avec succès" });
  } catch (error) {
    console.error("Erreur deleteBien :", error);
    res.status(500).json({ message: error.message });
  }
};