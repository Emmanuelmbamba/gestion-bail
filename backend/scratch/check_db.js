const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");

const checkDb = async () => {
  const envPath = path.join(__dirname, "../.env");
  if (fs.existsSync(envPath)) {
    require("dotenv").config({ path: envPath });
  }
  
  const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/gestion_bail";
  console.log("Connecting to:", mongoUri);

  try {
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB.");

    const User = mongoose.model("User", new mongoose.Schema({}, { strict: false }), "users");
    const Bien = mongoose.model("Bien", new mongoose.Schema({}, { strict: false }), "biens");
    const DemandeVisite = mongoose.model("DemandeVisite", new mongoose.Schema({}, { strict: false }), "demandevisites");

    const users = await User.find();
    console.log("\n=== USERS ===");
    users.forEach(u => {
      console.log(`- ID: ${u._id} | Nom: ${u.nom} | Email: ${u.email} | Role: ${u.role}`);
    });

    const biens = await Bien.find();
    console.log("\n=== BIENS ===");
    biens.forEach(b => {
      console.log(`- ID: ${b._id} | Titre: ${b.titre} | Proprietaire: ${b.proprietaire} | Type: ${typeof b.proprietaire}`);
    });

    const visites = await DemandeVisite.find();
    console.log("\n=== VISITES ===");
    visites.forEach(v => {
      console.log(`- ID: ${v._id} | Client: ${v.client} | Bien: ${v.bien} | Statut: ${v.statut}`);
    });

  } catch (error) {
    console.error("Error checking DB:", error);
  } finally {
    await mongoose.connection.close();
    console.log("Closed connection.");
  }
};

checkDb();
