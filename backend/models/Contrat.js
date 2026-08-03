const mongoose = require("mongoose");


const contratSchema = new mongoose.Schema({

    numeroContrat:{
        type:String,
        unique:true
    },


    bien:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Bien",
        required:true
    },


    bailleur:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },


    locataire:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },


    dateDebut:{
        type:Date
    },


    dateFin:{
        type:Date
    },


    montantLoyer:{
        type:Number
    },


    statut:{
        type:String,
        enum:[
            "en_attente",
            "actif",
            "expire",
            "resilie"
        ],
        default:"en_attente"
    }

},{
    timestamps:true
});


module.exports = mongoose.model(
    "Contrat",
    contratSchema
);