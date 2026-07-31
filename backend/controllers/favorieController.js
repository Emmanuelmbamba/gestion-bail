const Favori = require("../models/Favori");

exports.addFavori = async (req, res) => {

    try {

        const existe = await Favori.findOne({
            user: req.user.id,
            bien: req.params.id
        });

        if (existe) {

            return res.json({
                message: "Déjà ajouté"
            });

        }

        const favori = new Favori({

            user: req.user.id,

            bien: req.params.id

        });

        await favori.save();

        res.json({
            message: "Favori ajouté"
        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

};

exports.removeFavori = async (req, res) => {

    await Favori.findOneAndDelete({

        user: req.user.id,

        bien: req.params.id

    });

    res.json({
        message: "Favori supprimé"
    });

};

exports.getFavoris = async (req, res) => {

    const favoris = await Favori.find({

        user: req.user.id

    }).populate("bien");

    res.json(favoris);

};

exports.isFavori = async (req, res) => {

    const favori = await Favori.findOne({

        user: req.user.id,

        bien: req.params.id

    });

    res.json({
        favori: !!favori
    });

};