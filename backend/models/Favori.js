const mongoose=require("mongoose");


const FavoriSchema=new mongoose.Schema({

user:{
type:mongoose.Schema.Types.ObjectId,
ref:"User"
},


bien:{
type:mongoose.Schema.Types.ObjectId,
ref:"Bien"
}


});


module.exports=
mongoose.model(
"Favori",
FavoriSchema
);