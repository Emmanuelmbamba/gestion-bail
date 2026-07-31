const express = require("express");

const router = express.Router();


const {
creerContrat,
listeContrats,
resilierContrat,
signerContrat
} = require("../controllers/contratController");


const proteger =
require("../middleware/authMiddleware");


const role =
require("../middleware/roleMiddleware");



const Contrat = require("../models/Contrat");

const path =
require("path");



// Création contrat

router.post(

"/",

proteger,

role(
"admin",
"bailleur"
),

creerContrat

);



// Liste contrats

router.get(

"/",

proteger,

listeContrats

);



// Télécharger contrat PDF

router.get(

"/download/:id",

proteger,

async(req,res)=>{


try{


const contrat =
await Contrat.findById(
req.params.id
);



if(!contrat){

return res.status(404)
.json({

message:"Contrat introuvable"

});

}



res.download(
path.resolve(
contrat.contratPDF
)

);


}
catch(error){

res.status(500)
.json({

message:error.message

});

}


}

);



// Résilier contrat
router.put(
  "/resilier/:id",
  proteger,
  role("admin", "agent", "bailleur"),
  resilierContrat
);

// Signer contrat
router.put(
  "/signer/:id",
  proteger,
  signerContrat
);


module.exports = router;