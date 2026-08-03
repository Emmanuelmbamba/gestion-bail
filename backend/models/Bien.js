const mongoose = require("mongoose");

const bienSchema = new mongoose.Schema({

    titre:{
        type:String,
        required:true
    },

    type:{
    type:String,
    enum:[
        "Maison",
        "Appartement",
        "Studio",
        "Bureau",   
        "Boutique",
        "Terrain"
    ],
    required:true
},

    adresse:{
        type:String,
        required:true
    },

    description:{
        type:String,
        required:true
    },

    prix:{
        type:Number,
        required:true
    },

    chambres:{
        type:Number,
        default:0
    },

    sallesBain:{
        type:Number,
        default:0
    },

    images:[
        {
            type:String
        }
    ],

    status:{
        type:String,
        enum:[
            "disponible",
            "occupé",
            "réservé",
            "en_visite"
        ],
        default:"disponible"
    },


    bailleur:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }

},{
    timestamps:true
});


module.exports = mongoose.model("Bien",bienSchema);