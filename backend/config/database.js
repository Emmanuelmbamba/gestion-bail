    const mongoose = require("mongoose");

    const connectDB = async () => {
        try {
            console.log("MONGO_URI =", process.env.MONGO_URI);
            console.log("Mongoose version :", mongoose.version);
            await mongoose.connect(process.env.MONGO_URI);

            console.log("✅ MongoDB connecté");

        } catch (error) {

            console.error(
                "❌ Erreur de connexion MongoDB :",
                error.message
            );

            process.exit(1);
        }
    };

    module.exports = connectDB;