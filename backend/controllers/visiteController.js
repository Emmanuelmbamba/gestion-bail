const DemandeVisite = require("../models/DemandeVisite");
const Bien = require("../models/Bien");

// Créer une demande de visite
exports.creerVisite = async (req, res) => {
    try {
        const { bien, dateVisite, message } = req.body;

        if (!bien) {
            return res.status(400).json({
                message: "Le bien est obligatoire"
            });
        }

        const nouvelleVisite = await DemandeVisite.create({
            client: req.user.id,
            bien,
            dateVisite,
            message,
            statut: "En attente"
        });

        res.status(201).json({
            message: "Demande de visite envoyée",
            visite: nouvelleVisite
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Liste des visites
exports.listeVisites = async (req, res) => {
    try {

        let visites = [];

        if (req.user.role === "locataire") {

            visites = await DemandeVisite.find({
                client: req.user.id
            })
            .populate("client", "nom email")
            .populate("bien");

        } else if (req.user.role === "bailleur") {

            const toutesLesVisites = await DemandeVisite.find()
                .populate("client", "nom email")
                .populate("bien");

            visites = toutesLesVisites.filter(visite => 
                visite.bien && 
                visite.bien.bailleur && 
                visite.bien.bailleur.toString() === req.user.id
            );

        } else {

            visites = await DemandeVisite.find()
                .populate("client", "nom email")
                .populate("bien");

        }

        res.json(visites);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Modifier le statut
exports.modifierStatut = async (req, res) => {
    try {

        const { statut } = req.body;

        const visite = await DemandeVisite.findById(req.params.id);

        if (!visite) {
            return res.status(404).json({
                message: "Visite introuvable"
            });
        }

        const bien = await Bien.findById(visite.bien);
        if (!bien) {
            return res.status(404).json({
                message: "Bien associe introuvable"
            });
        }

        const getObjectIdString = (val) => {
            if (!val) return "";
            if (typeof val === "string") return val;
            if (val._id) return val._id.toString();
            return val.toString();
        };

        const userIdStr = req.user && req.user.id ? req.user.id.toString() : "";
        const isOwner = bien.bailleur && getObjectIdString(bien.bailleur) === userIdStr;
        const isAdminOrAgent = req.user && (req.user.role === "admin" || req.user.role === "agent");
        const isClient = visite.client && getObjectIdString(visite.client) === userIdStr;

        if (isAdminOrAgent) {
            // Admin/Agent can do any change
        } else if (isOwner) {
            // Landlord can accept/refuse/change status
        } else if (isClient) {
            // Locataire can only cancel
            if (statut !== "Annulée") {
                return res.status(403).json({
                    message: "En tant que locataire, vous pouvez uniquement annuler votre demande de visite."
                });
            }
        } else {
            return res.status(403).json({
                message: "Vous n'etes pas autorise a modifier cette visite."
            });
        }

        visite.statut = statut;

        await visite.save();

        res.json({
            message: "Statut mis a jour",
            visite
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};