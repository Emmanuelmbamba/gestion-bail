const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");

const run = async () => {
  const envPath = path.join(__dirname, "../.env");
  if (fs.existsSync(envPath)) {
    require("dotenv").config({ path: envPath });
  }
  
  await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/gestion_bail");

  const User = mongoose.model("User", new mongoose.Schema({}, { strict: false }), "users");
  const Bien = mongoose.model("Bien", new mongoose.Schema({}, { strict: false }), "biens");
  const DemandeVisite = mongoose.model("DemandeVisite", new mongoose.Schema({}, { strict: false }), "demandevisites");

  const landlordId = "6a68d3aea17f5e96a2c9128a"; // Elroi (bailleur)
  const user = { id: landlordId, role: "bailleur" };

  const visites = await DemandeVisite.find();
  console.log("\n=== EVALUATING ALL VISITES ===");
  for (const visite of visites) {
    const bien = await Bien.findById(visite.bien);
    if (!bien) {
      console.log(`Visite: ${visite._id} | Bien associated not found in DB!`);
      continue;
    }
    const isOwner = bien.proprietaire && bien.proprietaire.toString() === user.id;
    const isClient = visite.client && visite.client.toString() === user.id;
    console.log(`Visite: ${visite._id} | Client: ${visite.client} | Bien: ${visite.bien} | Owner of Bien: ${bien.proprietaire} | isOwner: ${isOwner} | isClient: ${isClient}`);
  }
  process.exit(0);
};

run().catch(err => {
  console.error(err);
  process.exit(1);
});
