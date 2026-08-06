const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        console.log("===== AUTH MIDDLEWARE =====");
        console.log("Authorization:", req.headers.authorization);
        console.log("JWT_SECRET:", process.env.JWT_SECRET);
        console.log("TOKEN DECODE :", req.user);

        const authHeader = req.headers.authorization;

        if (!authHeader) {
            console.log("Aucun header Authorization");
            return res.status(401).json({
                message: "Token manquant"
            });
        }

        const token = authHeader.split(" ")[1];
        console.log("Token:", token);

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded:", decoded);

        req.user = decoded;

        next();

    } catch (error) {
        console.log("JWT ERROR:", error.name);
        console.log("JWT MESSAGE:", error.message);

        return res.status(401).json({
            message: "Token invalide"
        });
    }
};