const express = require("express");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");
require("dotenv").config();
const dns = require("dns");

dns.setDefaultResultOrder("ipv4first");

const connectDB = require("./config/database");

// Import Routes
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const bienRoutes = require("./routes/bienRoutes");
const contratRoutes = require("./routes/contratRoutes");
const locataireRoutes = require("./routes/locataireRoutes");
const bailleurRoutes = require("./routes/bailleurRoutes");
const factureRoutes = require("./routes/factureRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const paiementRoutes = require("./routes/paiementRoutes");
const favorieRoutes = require("./routes/favorieRoutes");
const visiteRoutes = require("./routes/visiteRoutes");
const contactRoutes = require("./routes/contactRoutes");

const app = express();

// ===============================
// Connexion MongoDB
// ===============================
connectDB();

// ===============================
// Sécurité Helmet
// ===============================
app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
    frameguard: {
      action: "sameorigin",
    },
  })
);

// ===============================
// Content Security Policy (CSP)
// ===============================
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],

      scriptSrc: ["'self'"],

      styleSrc: [
        "'self'",
        "'unsafe-inline'"
      ],

      imgSrc: [
        "'self'",
        "data:",
        "https:"
      ],

      fontSrc: [
        "'self'",
        "https:"
      ],

      connectSrc: [
        "'self'",
        "http://localhost:5000",
        "http://localhost:5173",
        "https://gestion-bail-frontend.onrender.com",
        "https://gestion-bail-backend.onrender.com"
      ],

      frameAncestors: ["'self'"],

      objectSrc: ["'none'"],
    },
  })
);

// ===============================
// Middlewares
// ===============================
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());

// ===============================
// Route principale
// ===============================
app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "API Gestion-Bail sécurisée",
  });
});

// ===============================
// Health Check pour Render
// ===============================
app.get("/healthz", (req, res) => {
  res.status(200).json({
    status: "OK",
  });
});

// ===============================
// Fichiers Upload
// ===============================
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// ===============================
// Routes API
// ===============================
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/biens", bienRoutes);
app.use("/api/contrats", contratRoutes);
app.use("/api/locataires", locataireRoutes);
app.use("/api/bailleurs", bailleurRoutes);
app.use("/api/factures", factureRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/paiements", paiementRoutes);
app.use("/api/favoris", favorieRoutes);
app.use("/api/visites", visiteRoutes);
app.use("/api/contact", contactRoutes);

// ===============================
// Gestion erreurs 404
// ===============================
app.use((req, res) => {
  res.status(404).json({
    message: "Route introuvable",
  });
});

// ===============================
// Gestionnaire global des erreurs
// ===============================
app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Erreur interne du serveur",
  });
});

// ===============================
// Démarrage serveur
// ===============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Serveur lancé sur le port ${PORT}`);
});