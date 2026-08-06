const Categorie = require("../models/Categorie");

const defaultCategories = [
  { nom: "Maison", icon: "FaHome", description: "Maisons individuelles et villas de standing." },
  { nom: "Appartement", icon: "FaBuilding", description: "Appartements modernes et studios équippés." },
  { nom: "Bureau", icon: "FaBriefcase", description: "Espaces professionnels et bureaux modulables." },
  { nom: "Boutique", icon: "FaStore", description: "Locaux commerciaux et emplacements marchands." },
  { nom: "Terrain", icon: "FaMapMarkedAlt", description: "Parcelles de terre et terrains constructibles." },
];

exports.getCategories = async (req, res) => {
  try {
    let categories = await Categorie.find().sort({ nom: 1 });
    if (categories.length === 0) {
      categories = await Categorie.insertMany(defaultCategories);
    }
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur lors de la récupération des catégories" });
  }
};

exports.createCategorie = async (req, res) => {
  try {
    const { nom, icon, description } = req.body;
    const existing = await Categorie.findOne({ nom });
    if (existing) {
      return res.status(400).json({ message: "Cette catégorie existe déjà" });
    }
    const category = new Categorie({ nom, icon, description });
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur lors de la création" });
  }
};

exports.updateCategorie = async (req, res) => {
  try {
    const { nom, icon, description } = req.body;
    const category = await Categorie.findByIdAndUpdate(
      req.params.id,
      { nom, icon, description },
      { new: true }
    );
    if (!category) {
      return res.status(404).json({ message: "Catégorie non trouvée" });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur lors de la modification" });
  }
};

exports.deleteCategorie = async (req, res) => {
  try {
    const category = await Categorie.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Catégorie non trouvée" });
    }
    res.json({ message: "Catégorie supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur lors de la suppression" });
  }
};
