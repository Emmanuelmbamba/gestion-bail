const Bien = require("../models/Bien");
const Contrat = require("../models/Contrat");
const jwt = require("jsonwebtoken");
const jwtConfig = require("../config/jwt");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");


// =======================
// Ajouter un bien
// =======================
exports.createBien = async (req, res) => {

    try {

        let photos = [];
 console.log("========== NOUVEAU CREATE BIEN ==========");
    console.log("FILES :", req.files);
    console.log("USER :", req.user);
        // Upload multiple vers Cloudinary
        if (req.files && req.files.length > 0) {

            for (const file of req.files) {

                const result = await cloudinary.uploader.upload(
                    file.path,
                    {
                        folder:"gestion-bail"
                    }
                );


                photos.push(result.secure_url);


                // supprimer fichier temporaire
                fs.unlinkSync(file.path);

            }

        }


        const bien = new Bien({

            ...req.body,

            images: photos,

            bailleur:req.user.id

        });



        await bien.save();



        res.status(201).json({

            message:"Bien publié avec succès",

            bien

        });



    } catch(error){


        console.error(
            "Erreur createBien :",
            error
        );


        res.status(500).json({

            message:error.message

        });

    }

};




// =======================
// Liste des biens
// =======================
exports.getBiens = async (req,res)=>{


    try{


        let query={};


        const {dashboard}=req.query;



        if(dashboard==="true"){


            const token =
            req.headers.authorization?.split(" ")[1];



            if(token){


                try{


                    const decoded =
                    jwt.verify(
                        token,
                        jwtConfig.secret
                    );



                    // Biens du bailleur connecté
                    if(decoded.role==="bailleur"){


                        query={
                            bailleur:decoded.id
                        };


                    }



                    // Biens loués par un locataire
                    else if(decoded.role==="locataire"){


                        const contrats =
                        await Contrat.find({

                            locataire:decoded.id

                        }).select("bien");



                        const ids =
                        contrats.map(
                            c=>c.bien
                        );



                        query={

                            _id:{
                                $in:ids
                            }

                        };


                    }



                }catch(err){

                    console.log(
                        "Token ignoré :",
                        err.message
                    );

                }

            }

        }



        const biens =
        await Bien.find(query)

        .populate(
            "bailleur",
            "nom email"
        )

        .sort({

            createdAt:-1

        });



        res.json(biens);



    }catch(error){


        console.error(
            "Erreur getBiens :",
            error
        );


        res.status(500).json({

            message:error.message

        });

    }


};




// =======================
// Détail d'un bien
// =======================
exports.getBienById = async(req,res)=>{


    try{


        const bien =
        await Bien.findById(req.params.id)

        .populate(
            "bailleur",
            "nom email"
        );



        if(!bien){


            return res.status(404).json({

                message:"Bien introuvable"

            });

        }



        res.json(bien);



    }catch(error){


        console.error(
            "Erreur getBienById :",
            error
        );


        res.status(500).json({

            message:error.message

        });

    }


};




// =======================
// Recherche des biens
// =======================
exports.searchBien = async(req,res)=>{


    try{


        const {
            ville,
            type,
            min,
            max
        } = req.query;



        let filtre={};



        if(ville){

            filtre.adresse={
                $regex:ville,
                $options:"i"
            };

        }



        if(type){

            filtre.type=type;

        }



        if(min){

            filtre.prix={

                $gte:Number(min)

            };

        }



        if(max){

            filtre.prix={

                ...filtre.prix,

                $lte:Number(max)

            };

        }



        const biens =
        await Bien.find(filtre);



        res.json(biens);



    }catch(error){


        console.error(
            "Erreur searchBien :",
            error
        );


        res.status(500).json({

            message:error.message

        });

    }


};




// =======================
// Supprimer un bien
// =======================
exports.deleteBien = async(req,res)=>{


    try{


        const bien =
        await Bien.findById(req.params.id);



        if(!bien){


            return res.status(404).json({

                message:"Bien introuvable"

            });

        }




        if(

            bien.bailleur &&

            bien.bailleur.toString()
            !== req.user.id &&

            req.user.role!=="admin"

        ){


            return res.status(403).json({

                message:"Action non autorisée"

            });


        }




        await Bien.findByIdAndDelete(
            req.params.id
        );



        res.json({

            message:"Bien supprimé avec succès"

        });



    }catch(error){


        console.error(
            "Erreur deleteBien :",
            error
        );


        res.status(500).json({

            message:error.message

        });


    }


};