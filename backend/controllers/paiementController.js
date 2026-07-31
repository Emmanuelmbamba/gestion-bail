const Paiement = require("../models/Paiement");
const Facture = require("../models/Facture");
const Contrat = require("../models/Contrat");
const genererNumeroFacture = require("../utils/factureNumber");
const genererPDF = require("../services/facturePDF");
const envoyerEmail = require("../services/emailService");
const envoyerNotification = require("../services/notificationService");

const creerPaiement = async (req, res) => {
  try {
    const contratObj = await Contrat.findById(req.body.contrat);

    if (!contratObj) {
      return res.status(404).json({
        message: "Contrat introuvable pour ce paiement."
      });
    }

    const locataireId = contratObj.locataire;
    const statut = req.body.statut || "payé";

    const paiement = await Paiement.create({
      contrat: req.body.contrat,
      locataire: locataireId,
      montant: req.body.montant,
      mois: req.body.mois,
      modePaiement: req.body.modePaiement,
      typePaiement: req.body.typePaiement || "loyer",
      statut
    });


    let facture = await Facture.create({
      numeroFacture: genererNumeroFacture(),
      paiement: paiement._id,
      locataire: locataireId,
      montant: paiement.montant
    });


    facture = await Facture.findById(facture._id)
      .populate("locataire")
      .populate("paiement");


    const pdf = genererPDF(facture);

    facture.fichierPDF = pdf;

    await facture.save();


    await envoyerNotification(
      locataireId,
      "Paiement reçu",
      `Le paiement de ${paiement.montant} a bien été enregistré.`,
      "paiement"
    );


    if (facture.locataire?.email) {
      try {

        await envoyerEmail(
          facture.locataire.email,
          "Reçu de paiement",
          `Bonjour, votre paiement de ${paiement.montant} a été enregistré avec succès.`
        );

      } catch(emailError){

        console.error("Erreur envoi email", emailError);

      }
    }


    res.status(201).json({
      message:"Paiement enregistré",
      paiement,
      facture
    });


  } catch(error){

    res.status(500).json({
      message:error.message
    });

  }
};



const listePaiements = async (req,res)=>{

  try {
    let query = {};
    if (req.user.role === "locataire") {
      query = { locataire: req.user.id };
    } else if (req.user.role === "bailleur") {
      const contrats = await Contrat.find({ bailleur: req.user.id }).select("_id");
      const contratIds = contrats.map(c => c._id);
      query = { contrat: { $in: contratIds } };
    }

    const paiements = await Paiement.find(query)
      .populate("contrat")
      .populate("locataire");

    res.json(paiements);

  } catch(error){

    res.status(500).json({
      message:error.message
    });

  }

};



module.exports = {
  creerPaiement,
  listePaiements
};