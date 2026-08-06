const Paiement = require("../models/Paiement");
const Locataire = require("../models/Locataire");
const Contrat = require("../models/Contrat");


// =============================
// CREER UN PAIEMENT (LOCATAIRE)
// =============================
exports.creerPaiement = async (req,res)=>{

try {

    console.log("USER CONNECTE :", req.user);


    if(req.user.role !== "locataire"){
        return res.status(403).json({
            message:"Seul un locataire peut effectuer un paiement"
        });
    }


    const locataire = await Locataire.findOne({
        user:req.user.id
    });


    if(!locataire){
        return res.status(404).json({
            message:"Profil locataire introuvable"
        });
    }


    const {
        contrat,
        montant,
        mois,
        modePaiement,
        typePaiement,
        statut
    } = req.body;



    const contratExiste = await Contrat.findOne({
        _id: contrat,
        locataire: locataire._id
    });



    if(!contratExiste){
        return res.status(403).json({
            message:"Ce contrat ne vous appartient pas"
        });
    }



    const paiement = await Paiement.create({

        contrat: contrat,

        locataire: locataire._id,

        montant,

        mois,

        modePaiement,

        typePaiement,

        statut

    });



    res.status(201).json({

        message:"Paiement enregistré avec succès",

        paiement

    });


}
catch(error){

    console.log(error);

    res.status(500).json({

        message:"Erreur serveur"

    });

}

};





// =============================
// LISTE DES PAIEMENTS
// =============================
exports.listePaiements = async(req,res)=>{

try{


const paiements = await Paiement.find()

.populate({
    path:"contrat",
    populate:[
        {
            path:"bien"
        },
        {
            path:"locataire"
        }
    ]
})

.populate("locataire")

.sort({
    createdAt:-1
});



res.json(paiements);


}
catch(error){

console.log(error);


res.status(500).json({

message:"Erreur récupération paiements"

});


}


};