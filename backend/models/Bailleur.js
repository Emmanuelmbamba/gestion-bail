const mongoose = require("mongoose");


const bailleurSchema = new mongoose.Schema({

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
        type:String,
        default:""
    },


    numeroPiece:{
        type:String,
        default:""
    },


    photo:{
        type:String,
        default:""
    }


},
{
    timestamps:true
});


module.exports = mongoose.model(
    "Bailleur",
    bailleurSchema
);