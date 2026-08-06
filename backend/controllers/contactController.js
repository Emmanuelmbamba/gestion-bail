const Contact = require("../models/Contact");



// Envoyer un message contact

exports.sendContact = async (req,res)=>{

    try{


        const {
            nom,
            email,
            message
        } = req.body;



        if(!nom || !email || !message){

            return res.status(400).json({

                message:"Tous les champs sont obligatoires"

            });

        }



        const contact = await Contact.create({

            nom,
            email,
            message

        });



        res.status(201).json({

            success:true,
            message:"Message envoyé avec succès",
            contact

        });



    }catch(error){


        console.error(error);


        res.status(500).json({

            message:"Erreur serveur"

        });


    }


};
