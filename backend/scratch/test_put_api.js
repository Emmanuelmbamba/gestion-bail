const jwt = require("jsonwebtoken");
const axios = require("axios");
const path = require("path");
const fs = require("fs");

const run = async () => {
  const envPath = path.join(__dirname, "../.env");
  if (fs.existsSync(envPath)) {
    require("dotenv").config({ path: envPath });
  }

  const jwtSecret = process.env.JWT_SECRET || "MonSuperSecretJWT2026";
  const landlordId = "6a68d3aea17f5e96a2c9128a"; // Elroi
  
  // Generate a valid landlord token
  const token = jwt.sign(
    {
      id: landlordId,
      role: "bailleur",
      nom: "Elroi",
      email: "elroimbamba@gmail.com"
    },
    jwtSecret,
    { expiresIn: "1h" }
  );

  console.log("Generated token:", token);

  const url = "http://localhost:5000/api/visites/6a6b1b6954be281ac69eadf0";
  console.log("Sending PUT request to:", url);

  try {
    const res = await axios.put(
      url,
      { statut: "Acceptée" },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    console.log("SUCCESS RESPONSE:");
    console.log("Status:", res.status);
    console.log("Data:", res.data);
  } catch (error) {
    console.log("ERROR RESPONSE:");
    if (error.response) {
      console.log("Status:", error.response.status);
      console.log("Data:", error.response.data);
    } else {
      console.log("Message:", error.message);
    }
  }
};

run();
