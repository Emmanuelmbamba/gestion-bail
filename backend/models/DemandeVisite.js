const mongoose=require("mongoose");


const schema=new mongoose.Schema({

client:{
type:mongoose.Schema.Types.ObjectId,
ref:"User"
},


bien:{
type:mongoose.Schema.Types.ObjectId,
ref:"Bien"
},


dateVisite:Date,


message:String,


statut:{
type:String,
default:"En attente"
}



});


module.exports=
mongoose.model(
"DemandeVisite",
schema
);