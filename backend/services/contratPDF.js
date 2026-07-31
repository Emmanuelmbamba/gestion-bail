const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const genererContratPDF = (contrat) => {

    const dossier = path.join(__dirname, "../uploads/contrats");

    if (!fs.existsSync(dossier)) {
        fs.mkdirSync(dossier, { recursive: true });
    }

    const chemin = path.join(dossier, `${contrat._id}.pdf`);

    const doc = new PDFDocument({ margin: 50 });

    doc.pipe(fs.createWriteStream(chemin));

    // Title
    doc.fontSize(20).text("CONTRAT DE BAIL DE RESIDENCE", { align: "center", underline: true });
    doc.moveDown(1.5);

    // General Details
    doc.fontSize(12).text(`Numero de Contrat : ${contrat.numeroContrat || 'N/A'}`);
    doc.text(`Statut actuel du Contrat : ${contrat.statut.toUpperCase()}`);
    doc.text(`Date de creation : ${new Date(contrat.createdAt).toLocaleDateString()}`);
    doc.moveDown(1.5);

    // Parties Section
    doc.fontSize(14).text("1. PARTIES CONTRACTANTES", { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12).text(`Bailleur (Proprietaire) : ${contrat.bailleur?.nom || 'Non specifie'}`);
    doc.text(`Email du Bailleur : ${contrat.bailleur?.email || 'N/A'}`);
    doc.moveDown(0.5);
    doc.text(`Locataire (Locateur) : ${contrat.locataire?.nom || 'Non specifie'}`);
    doc.text(`Email du Locataire : ${contrat.locataire?.email || 'N/A'}`);
    doc.moveDown(1.5);

    // Property Section
    doc.fontSize(14).text("2. DESCRIPTION DU BIEN", { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12).text(`Designation : ${contrat.bien?.titre || 'Non specifie'}`);
    doc.text(`Description : ${contrat.bien?.description || 'N/A'}`);
    doc.text(`Localisation : ${contrat.bien?.ville || 'N/A'}`);
    doc.moveDown(1.5);

    // Lease Terms
    doc.fontSize(14).text("3. CONDITIONS FINANCIERES ET DUREE", { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12).text(`Date de debut : ${new Date(contrat.dateDebut).toLocaleDateString()}`);
    doc.text(`Date de fin : ${new Date(contrat.dateFin).toLocaleDateString()}`);
    doc.text(`Duree totale : ${contrat.dureeMois} mois`);
    doc.text(`Montant du loyer mensuel : ${contrat.montantLoyer} $`);
    doc.text(`Montant de la caution : ${contrat.caution} $`);
    if (contrat.conditions) {
        doc.text(`Conditions particulieres : ${contrat.conditions}`);
    }
    doc.moveDown(1.5);

    // Signatures Section
    doc.fontSize(14).text("4. SIGNATURES ET ACCEPTATIONS DES PARTIES", { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12).text(`Signature electronique requise : ${contrat.signatureElectronique ? "Oui" : "Non"}`);
    doc.moveDown(0.5);
    doc.text(`Acceptation du Bailleur : ${contrat.signeBailleur ? "ACCEPTE ET SIGNE ELECTRONIQUEMENT" : "EN ATTENTE D'ACCEPTATION"}`);
    doc.text(`Acceptation du Locataire : ${contrat.signeLocataire ? "ACCEPTE ET SIGNE ELECTRONIQUEMENT" : "EN ATTENTE D'ACCEPTATION"}`);
    doc.moveDown(1);
    doc.fontSize(10).text("Ce document constitue un bail officiel signe numeriquement et stocke de maniere securisee.", { italic: true });

    doc.end();

    return chemin;
};

module.exports = genererContratPDF;