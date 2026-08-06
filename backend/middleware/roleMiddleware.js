const verifierRole = (...roles) => {

    return (req, res, next) => {

        console.log("=== VERIFICATION ROLE ===");
        console.log("USER COMPLET :", req.user);
        console.log("ROLE RECU :", req.user?.role);
        console.log("ROLES AUTORISES :", roles);


        if (!req.user) {
            return res.status(401).json({
                message: "Utilisateur non authentifié"
            });
        }


        if (!roles.includes(req.user.role)) {

            return res.status(403).json({
                message: "Permission refusée",
                roleRecu: req.user.role,
                rolesAutorises: roles
            });

        }


        next();

    };

};

module.exports = verifierRole;