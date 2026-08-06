const express = require("express");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");
const dns = require("dns");

require("dotenv").config();

dns.setDefaultResultOrder("ipv4first");

const connectDB = require("./config/database");


// ===============================
// IMPORT ROUTES
// ===============================

const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const bienRoutes = require("./routes/bienRoutes");
const contratRoutes = require("./routes/contratRoutes");
const locataireRoutes = require("./routes/locataireRoutes");
const bailleurRoutes = require("./routes/bailleurRoutes");
const factureRoutes = require("./routes/factureRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const paiementRoutes = require("./routes/paiementRoutes");
const favorieRoutes = require("./routes/favorieRoutes");
const visiteRoutes = require("./routes/visiteRoutes");
const contactRoutes = require("./routes/contactRoutes");



// ===============================
// ENV CHECK
// ===============================

console.log(
    "BREVO_API_KEY :",
    process.env.BREVO_API_KEY ? "CONFIGUREE" : "MANQUANTE"
);


console.log(
    "EMAIL_FROM :",
    process.env.EMAIL_FROM || "MANQUANT"
);



// ===============================
// APP
// ===============================

const app = express();



// ===============================
// DATABASE
// ===============================

connectDB();



// ===============================
// SECURITY HELMET
// ===============================

app.use(

helmet({

    crossOriginResourcePolicy:{
        policy:"cross-origin"
    },

    frameguard:{
        action:"sameorigin"
    }

})

);



// ===============================
// CORS
// ===============================

const allowedOrigins = [

    "http://localhost:5173",

    "https://gestion-bail-frontend.onrender.com"

];



app.use(

cors({

    origin:function(origin,callback){


        if(!origin){

            return callback(null,true);

        }


        if(allowedOrigins.includes(origin)){

            return callback(null,true);

        }


        return callback(
            new Error("Origine non autorisée")
        );


    },


    credentials:true


})

);




// ===============================
// BODY PARSER
// IMPORTANT AVANT LES ROUTES
// ===============================


app.use(express.json());


app.use(
    express.urlencoded({
        extended:true
    })
);




// ===============================
// CSP
// ===============================

app.use(

helmet.contentSecurityPolicy({

directives:{


defaultSrc:[
    "'self'"
],


scriptSrc:[
    "'self'"
],


styleSrc:[
    "'self'",
    "'unsafe-inline'"
],


imgSrc:[
    "'self'",
    "data:",
    "https:"
],


fontSrc:[
    "'self'",
    "https:"
],


connectSrc:[

    "'self'",

    "http://localhost:5000",

    "http://localhost:5173",

    "https://*.onrender.com"

],


objectSrc:[
    "'none'"
],


frameAncestors:[
    "'self'"
]


}


})

);






// ===============================
// STATIC FILES
// ===============================


app.use(

"/uploads",

express.static(

path.join(__dirname,"uploads")

)

);






// ===============================
// API ROUTES
// ===============================


console.log("Chargement des routes API...");



app.use(
"/api/auth",
authRoutes
);



app.use(
"/api/dashboard",
dashboardRoutes
);



app.use(
"/api/contact",
contactRoutes
);



app.use(
"/api/biens",
bienRoutes
);



app.use(
"/api/contrats",
contratRoutes
);



app.use(
"/api/locataires",
locataireRoutes
);



app.use(
"/api/bailleurs",
bailleurRoutes
);



app.use(
"/api/factures",
factureRoutes
);



app.use(
"/api/notifications",
notificationRoutes
);



app.use(
"/api/paiements",
paiementRoutes
);



app.use(
"/api/favoris",
favorieRoutes
);



app.use(
"/api/visites",
visiteRoutes
);





// ===============================
// TEST API
// ===============================


app.get("/",(req,res)=>{


res.json({

    status:"OK",

    message:"API Gestion-Bail opérationnelle"

});


});





// ===============================
// HEALTH CHECK RENDER
// ===============================


app.get("/healthz",(req,res)=>{


res.status(200).json({

    status:"OK",

    service:"Gestion-Bail API",

    date:new Date()

});


});






// ===============================
// 404
// ===============================


app.use((req,res)=>{


res.status(404).json({

    success:false,

    message:"Route introuvable"

});


});






// ===============================
// GLOBAL ERROR
// ===============================


app.use((err,req,res,next)=>{


console.error(err);


res.status(err.status || 500)

.json({

    success:false,

    message:
    err.message ||
    "Erreur interne serveur"

});


});






// ===============================
// START SERVER
// ===============================


const PORT =
process.env.PORT || 5000;



app.listen(PORT,()=>{


console.log(

`✅ Serveur lancé sur le port ${PORT}`

);


});