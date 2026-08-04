const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const genererFacturePDF = (facture) => {
  const dossier = path.join(__dirname, "../uploads/factures");

  if (!fs.existsSync(dossier)) {
    fs.mkdirSync(dossier, { recursive: true });
  }

  const cheminAbsolu = path.join(dossier, `${facture.numeroFacture}.pdf`);
  const cheminRelatif = `uploads/factures/${facture.numeroFacture}.pdf`;
  const doc = new PDFDocument({ margin: 50 });

  doc.pipe(fs.createWriteStream(cheminAbsolu));

  // Colors & Styles
  const primaryColor = "#1e3a8a"; // Blue 800
  const secondaryColor = "#4b5563"; // Slate 600
  const successColor = "#10b981"; // Emerald 500

  // Header Title
  doc.fillColor(primaryColor)
     .fontSize(22)
     .text("REÇU DE PAIEMENT & FACTURE", { align: "center", bold: true });
  
  doc.moveDown(0.5);
  doc.fillColor(secondaryColor)
     .fontSize(10)
     .text(`Numéro de Facture : ${facture.numeroFacture}`, { align: "center" });

  doc.moveDown(1.5);

  // Draw separator line
  doc.strokeColor("#e5e7eb")
     .lineWidth(1)
     .moveTo(50, doc.y)
     .lineTo(550, doc.y)
     .stroke();

  doc.moveDown(1.5);

  // Bill To / Bill From Info
  const startY = doc.y;
  doc.fillColor(primaryColor)
     .fontSize(12)
     .text("ÉMETTEUR :", 70, startY, { bold: true });
  doc.fillColor("#1f2937")
     .fontSize(10)
     .text("Gestion-Bail Inc.", 70, startY + 18)
     .text("Service de Gestion Immobilière", 70, startY + 32);

  doc.fillColor(primaryColor)
     .fontSize(12)
     .text("DESTINATAIRE (LOCATAIRE) :", 320, startY, { bold: true });
  doc.fillColor("#1f2937")
     .fontSize(10)
     .text(`${facture.locataire?.nom || "Locataire inconnu"}`, 320, startY + 18)
     .text(`E-mail : ${facture.locataire?.email || "N/A"}`, 320, startY + 32);

  doc.moveDown(3);

  // Draw table header
  const tableY = doc.y + 15;
  doc.rect(70, tableY, 470, 25)
     .fill("#f3f4f6");

  doc.fillColor("#374151")
     .fontSize(10)
     .text("Description", 85, tableY + 8, { bold: true })
     .text("Mois / Période", 240, tableY + 8, { bold: true })
     .text("Mode", 360, tableY + 8, { bold: true })
     .text("Montant", 450, tableY + 8, { bold: true, align: "right" });

  // Draw table row
  const rowY = tableY + 25;
  doc.rect(70, rowY, 470, 35)
     .strokeColor("#e5e7eb")
     .lineWidth(1)
     .stroke();

  const typeLabel = facture.paiement?.typePaiement
    ? facture.paiement.typePaiement.toUpperCase()
    : "LOYER";
  const modeLabel = facture.paiement?.modePaiement
    ? facture.paiement.modePaiement.toUpperCase().replace("_", " ")
    : "CASH";

  doc.fillColor("#1f2937")
     .fontSize(10)
     .text(`Paiement de ${typeLabel}`, 85, rowY + 12)
     .text(`${facture.paiement?.mois || "N/A"}`, 240, rowY + 12)
     .text(`${modeLabel}`, 360, rowY + 12)
     .text(`${facture.montant} USD`, 450, rowY + 12, { align: "right" });

  doc.moveDown(3);

  // Total section
  const totalY = doc.y + 20;
  doc.rect(320, totalY, 220, 45)
     .fillColor("#f0fdf4")
     .strokeColor(successColor)
     .lineWidth(1.5)
     .fillAndStroke();

  doc.fillColor(successColor)
     .fontSize(11)
     .text("STATUT : PAYÉ", 335, totalY + 10, { bold: true });
  doc.fillColor("#065f46")
     .fontSize(10)
     .text(`Total réglé : ${facture.montant} USD`, 335, totalY + 26, { bold: true });

  doc.moveDown(4);

  // Date and signature stamp
  const dateStr = facture.dateEmission ? new Date(facture.dateEmission).toLocaleDateString("fr-FR") : new Date().toLocaleDateString("fr-FR");
  doc.fillColor(secondaryColor)
     .fontSize(9)
     .text(`Reçu édité automatiquement le ${dateStr}`, 70, doc.y, { align: "center", italic: true });

  doc.end();
  return cheminRelatif;
};

module.exports = genererFacturePDF;