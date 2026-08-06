const mongoose = require("mongoose");


const ContactSchema = new mongoose.Schema(
{
    nom:{
        type:String,
        required:true,
        trim:true
    },

    email:{
        type:String,
        required:true,
        trim:true
    },

    message:{
        type:String,
        required:true,
        trim:true
    },

    date:{
        type:Date,
        default:Date.now
    }

},
{
    timestamps:true
}
);


module.exports = mongoose.model("Contact", ContactSchema);