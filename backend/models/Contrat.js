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


    dureeMois:{
        type:Number
    },


    caution:{
        type:Number
    },


    conditions:{
        type:String
    },


    signatureElectronique:{
        type:Boolean,
        default:false
    },


    signeBailleur:{
        type:Boolean,
        default:false
    },


    signeLocataire:{
        type:Boolean,
        default:false
    },


    contratPDF:{
        type:String
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