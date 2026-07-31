const mongoose = require("mongoose");


const locataireSchema = new mongoose.Schema({

    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },


    nom:{
        type:String,
        required:true
    },


    telephone:{
        type:String,
        required:true
    },


    email:{
        type:String,
        required:true
    },


    adresse:{
        type:String
    },


    profession:{
        type:String
    },


    pieceIdentite:{
        type:String
    },


    photo:{
        type:String
    }


},
{
    timestamps:true
});


module.exports = mongoose.model(
    "Locataire",
    locataireSchema
);