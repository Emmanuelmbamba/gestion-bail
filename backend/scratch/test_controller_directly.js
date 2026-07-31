const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
const { modifierStatut } = require("../controllers/visiteController");

const run = async () => {
  const envPath = path.join(__dirname, "../.env");
  if (fs.existsSync(envPath)) {
    require("dotenv").config({ path: envPath });
  }

  await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/gestion_bail");

  const landlordId = "6a68d3aea17f5e96a2c9128a"; // Elroi
  const req = {
    params: { id: "6a6b1b6954be281ac69eadf0" },
    body: { statut: "Acceptée" },
    user: { id: landlordId, role: "bailleur" }
  };

  const res = {
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      console.log("RESPONSE status:", this.statusCode || 200);
      console.log("RESPONSE data:", data);
    }
  };

  await modifierStatut(req, res);
  process.exit(0);
};

run().catch(err => {
  console.error(err);
  process.exit(1);
});
