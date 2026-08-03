const genererContratPDF = require("../services/contratPDF");
const Contrat = require("../models/Contrat");
const { generateContractNumber, calculateDurationInMonths, getContractStatus } = require("../utils/contratUtils");
const envoyerNotification = require("../services/notificationService");
const Bien = require("../models/Bien");
const creerContrat = async (req, res) => {
  try {
    let numeroContrat = req.body.numeroContrat;
    if (!numeroContrat || typeof numeroContrat !== "string" || numeroContrat.trim() === "") {
      numeroContrat = generateContractNumber();
    }
    const dureeMois = calculateDurationInMonths(req.body.dateDebut, req.body.dateFin);

    console.log("Tentative de création de contrat - numeroContrat résolu :", numeroContrat);

    const contrat = await Contrat.create({
      numeroContrat,
      bien: req.body.bien,
      bailleur: req.user.id,
      locataire: req.body.locataire,
      dateDebut: req.body.dateDebut,
      dateFin: req.body.dateFin,
      dureeMois,
      montantLoyer: req.body.montantLoyer,
      caution: req.body.caution || 0,
      conditions: req.body.conditions || "",
      signatureElectronique: Boolean(req.body.signatureElectronique),
      signeBailleur: false,
      signeLocataire: false,
      statut: "en_attente"
    });

    const contratComplet = await Contrat.findById(contrat._id)
      .populate("bien")
      .populate("locataire")
      .populate("bailleur");

    const contratPDF = genererContratPDF(contratComplet);
    contratComplet.contratPDF = contratPDF;
    await contratComplet.save();

    await envoyerNotification(req.user.id, "Nouveau contrat", `Le contrat ${numeroContrat} a été créé avec succès.`, "contrat");
    if (req.body.locataire) {
      await envoyerNotification(req.body.locataire, "Nouveau contrat", "Un nouveau contrat vous a été attribué.", "contrat");
    }

    res.status(201).json({
      message: "Contrat créé",
      contrat: contratComplet
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const listeContrats = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === "locataire") {
      query = { locataire: req.user.id };
    } else if (req.user.role === "bailleur") {
      query = { bailleur: req.user.id };
    }

    const contrats = await Contrat.find(query)
      .populate("bien")
      .populate("locataire")
      .populate("bailleur");

    res.json(contrats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const resilierContrat = async (req, res) => {
  try {
    const contrat = await Contrat.findById(req.params.id);
    if (!contrat) {
      return res.status(404).json({ message: "Contrat introuvable." });
    }

    // Seul le bailleur du contrat ou un admin/agent peut le résilier
    if (contrat.bailleur.toString() !== req.user.id && req.user.role !== "admin" && req.user.role !== "agent") {
      return res.status(403).json({ message: "Vous n'êtes pas autorisé à résilier ce contrat." });
    }

    contrat.statut = "resilie";
    await contrat.save();
    const bien = await Bien.findById(
  contrat.bien
);


if(bien){

  bien.status="disponible";

  await bien.save();

}

    await envoyerNotification(contrat.locataire, "Contrat résilié", `Le contrat de bail ${contrat.numeroContrat} a été résilié par le bailleur.`, "contrat");
    await envoyerNotification(contrat.bailleur, "Contrat résilié", `Vous avez résilié le contrat de bail ${contrat.numeroContrat}.`, "contrat");

    res.json({ message: "Le contrat de bail a été résilié avec succès.", contrat });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const signerContrat = async (req, res) => {
  try {
    const contrat = await Contrat.findById(req.params.id);
    if (!contrat) {
      return res.status(404).json({ message: "Contrat introuvable." });
    }

    // Identifier la partie qui signe le contrat
    if (req.user.id === contrat.bailleur.toString()) {
      contrat.signeBailleur = true;
    } else if (req.user.id === contrat.locataire.toString()) {
      contrat.signeLocataire = true;
    } else {
      return res.status(403).json({ message: "Vous n'êtes pas autorisé à signer ce contrat." });
    }

    // Si les deux parties ont signé, le contrat devient actif/expire selon ses dates
    if (contrat.signeBailleur && contrat.signeLocataire) {

  contrat.statut = getContractStatus(
    contrat.dateDebut,
    contrat.dateFin
  );


  // Si le contrat est actif, le bien devient occupé
  if (contrat.statut === "actif") {

    const bien = await Bien.findById(
      contrat.bien
    );


    if (bien) {

      bien.status = "occupé";

      await bien.save();

      console.log(
        `Bien ${bien._id} marqué comme occupé`
      );

    }

  }

}

    await contrat.save();

    const contratComplet = await Contrat.findById(contrat._id)
      .populate("bien")
      .populate("locataire")
      .populate("bailleur");

    // Générer/régénérer le contrat PDF avec les nouvelles signatures et statut
    const contratPDF = genererContratPDF(contratComplet);
    contratComplet.contratPDF = contratPDF;
    await contratComplet.save();

    // Notifications
    await envoyerNotification(req.user.id, "Signature enregistrée", `Vous avez signé le contrat ${contrat.numeroContrat}.`, "contrat");
    
    const autreUserId = req.user.id === contrat.bailleur.toString() ? contrat.locataire : contrat.bailleur;
    await envoyerNotification(autreUserId, "Signature de contrat", `L'autre partie a signé le contrat ${contrat.numeroContrat}.`, "contrat");

    if (contrat.signeBailleur && contrat.signeLocataire) {
      await envoyerNotification(contrat.bailleur, "Contrat validé", `Le contrat ${contrat.numeroContrat} est désormais actif !`, "contrat");
      await envoyerNotification(contrat.locataire, "Contrat validé", `Le contrat ${contrat.numeroContrat} est désormais actif !`, "contrat");
    }

    res.json({
      message: "Signature enregistrée avec succès.",
      contrat: contratComplet
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  creerContrat,
  listeContrats,
  resilierContrat,
  signerContrat
};
