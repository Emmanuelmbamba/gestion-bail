const Bailleur = require("../models/Bailleur");


// CREATE BAILLEUR
exports.createBailleur = async (req, res) => {

    try {

        const bailleur = await Bailleur.create(req.body);

        res.status(201).json({
            message: "Bailleur créé avec succès",
            data: bailleur
        });


    } catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};



// GET ALL BAILLEURS
exports.getBailleurs = async (req,res)=>{
    try{
        let query = {};
        if (req.query.search) {
            const regex = new RegExp(req.query.search, "i");
            query = {
                $or: [
                    { nom: regex },
                    { email: regex },
                    { telephone: regex }
                ]
            };
        }

        const bailleurs = await Bailleur.find(query)
        .populate("user");

        res.json({
            data:bailleurs
        });
    }catch(error){
        res.status(500).json({
            message:error.message
        });
    }
};



// GET ONE BAILLEUR
exports.getBailleurById = async(req,res)=>{

    try{

        const bailleur = await Bailleur.findById(req.params.id)
        .populate("user");


        if(!bailleur){

            return res.status(404).json({
                message:"Bailleur introuvable"
            });

        }


        res.json(bailleur);


    }catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};



// UPDATE BAILLEUR
exports.updateBailleur = async(req,res)=>{

    try{

        const bailleur =
        await Bailleur.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new:true
            }
        );


        res.json({
            message:"Bailleur modifié",
            data:bailleur
        });


    }catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};



// DELETE BAILLEUR
exports.deleteBailleur = async(req,res)=>{

    try{

        await Bailleur.findByIdAndDelete(
            req.params.id
        );


        res.json({
            message:"Bailleur supprimé"
        });


    }catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};