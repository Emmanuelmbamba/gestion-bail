const User = require("../models/User");
const Contrat = require("../models/Contrat");
const Locataire = require("../models/Locataire");
const Bailleur = require("../models/Bailleur");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const envoyerEmail = require("../services/emailService");


// REGISTER

exports.register = async (req, res) => {

    try {

        const {
            nom,
            email,
            password,
            role
        } = req.body;


        const existe = await User.findOne({email});

        if(existe){
            return res.status(400).json({
                message:"Email déjà utilisé"
            });
        }


        const hashPassword = await bcrypt.hash(password,10);

        const token = crypto.randomBytes(30).toString("hex");

        const user = await User.create({

            nom,
            email,
            password: hashPassword,
            role,
            estConfirme: false,
            verificationToken: token

        });

        // Envoi de l'e-mail de confirmation
        const urlConfirmation = `http://localhost:5000/api/auth/verify/${token}`;
        try {
            await envoyerEmail(
                email,
                "Confirmation de votre compte",
                `Bonjour ${nom},\n\nMerci de vous être inscrit sur notre plateforme. Veuillez confirmer votre adresse e-mail en cliquant sur le lien suivant :\n\n${urlConfirmation}\n\nSi vous n'êtes pas à l'origine de cette inscription, vous pouvez ignorer cet e-mail.\n`
            );
        } catch (emailError) {
            console.error("Erreur envoi email confirmation:", emailError.message);
        }

        res.status(201).json({

            message: "Compte créé. Veuillez vérifier votre boîte mail pour confirmer votre compte Gmail.",
            user

        });


    } catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};




// LOGIN

exports.login = async(req,res)=>{


    try{


        const {
            email,
            password
        } = req.body;



        const user = await User.findOne({email});


        if(!user){

            return res.status(404).json({
                message:"Utilisateur introuvable"
            });

        }

        if (user.estConfirme === false) {
            return res.status(403).json({
                message: "Veuillez confirmer votre adresse e-mail avant de vous connecter. Un e-mail de confirmation vous a été envoyé."
            });
        }



        const valide = await bcrypt.compare(
            password,
            user.password
        );


        if(!valide){

            return res.status(400).json({
                message:"Mot de passe incorrect"
            });

        }



        const token = jwt.sign(

            {
                id:user._id,
                role:user.role,
                nom:user.nom,
                email:user.email
            },

            process.env.JWT_SECRET,

            {
                expiresIn:"7d"
            }

        );



        res.json({

            token,

            user:{
                id:user._id,
                nom:user.nom,
                email:user.email,
                role:user.role
            }

        });


    }catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};

exports.getLocataires = async (req, res) => {
    try {
        const locataires = await User.find({ role: "locataire" }).select("-password");
        res.json(locataires);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getBailleursUsers = async (req, res) => {
    try {
        const bailleurs = await User.find({ role: "bailleur" }).select("-password");
        res.json(bailleurs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "Utilisateur introuvable avec cet email." });
        }

        const token = crypto.randomBytes(20).toString("hex");
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 heure
        await user.save();

        const resetUrl = `http://localhost:5173/reset-password?token=${token}`;
        console.log(`\n======================================================`);
        console.log(`REINITIALISATION DE MOT DE PASSE POUR: ${email}`);
        console.log(`Lien de réinitialisation: ${resetUrl}`);
        console.log(`======================================================\n`);

        try {
            await envoyerEmail(
                email,
                "Réinitialisation de votre mot de passe",
                `Bonjour,\n\nVous recevez cet e-mail car vous (ou quelqu'un d'autre) avez demandé la réinitialisation du mot de passe de votre compte.\n\nVeuillez cliquer sur le lien suivant, ou le copier dans votre navigateur, pour compléter le processus dans l'heure qui suit :\n\n${resetUrl}\n\nSi vous n'avez pas demandé cela, veuillez ignorer cet e-mail.\n`
            );
        } catch (emailError) {
            console.error("Erreur envoi email réinitialisation:", emailError.message);
        }

        res.json({ message: "E-mail de réinitialisation envoyé avec succès. (Vérifiez également les logs console du serveur)" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;
        
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: "Le jeton de réinitialisation est invalide ou a expiré." });
        }

        const hashPassword = await bcrypt.hash(password, 10);
        user.password = hashPassword;
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await user.save();

        res.json({ message: "Votre mot de passe a été modifié avec succès." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    // Vérifier si l'utilisateur est associé à un contrat (comme locataire ou bailleur)
    const hasContract = await Contrat.findOne({
      $or: [
        { locataire: userId },
        { bailleur: userId }
      ]
    });

    if (hasContract) {
      return res.status(400).json({
        message: "Impossible de supprimer votre compte : vous avez des contrats de bail établis sur la plateforme."
      });
    }

    // Supprimer les profils locataire ou bailleur correspondants
    await Locataire.findOneAndDelete({ user: userId });
    await Bailleur.findOneAndDelete({ user: userId });

    // Supprimer l'utilisateur
    await User.findByIdAndDelete(userId);

    res.json({ message: "Votre compte utilisateur a été supprimé avec succès." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.verifyEmail = async (req, res) => {
    try {
        const user = await User.findOne({ verificationToken: req.params.token });
        
        if (!user) {
            return res.status(400).send("Lien de confirmation invalide ou expiré.");
        }

        user.estConfirme = true;
        user.verificationToken = null;
        await user.save();

        res.redirect("http://localhost:5173/login?verified=true");
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};