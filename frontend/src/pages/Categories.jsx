import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import {
  FaHome,
  FaBuilding,
  FaStore,
  FaBriefcase,
  FaMapMarkedAlt,
  FaArrowRight,
  FaFolderOpen
} from "react-icons/fa";

const iconMap = {
  FaHome: <FaHome />,
  FaBuilding: <FaBuilding />,
  FaBriefcase: <FaBriefcase />,
  FaStore: <FaStore />,
  FaMapMarkedAlt: <FaMapMarkedAlt />,
};

export default function Categories() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fallbackCategories = [
    { nom: "Maison", iconName: "FaHome", description: "Maisons individuelles et villas de standing." },
    { nom: "Appartement", iconName: "FaBuilding", description: "Appartements modernes, duplex et studios." },
    { nom: "Bureau", iconName: "FaBriefcase", description: "Espaces professionnels et bureaux privatifs." },
    { nom: "Boutique", iconName: "FaStore", description: "Locaux commerciaux et emplacements commerciaux." },
    { nom: "Terrain", iconName: "FaMapMarkedAlt", description: "Parcelles de terre et terrains à bâtir." },
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories");
        setCategories(res.data && res.data.length > 0 ? res.data : fallbackCategories);
      } catch (err) {
        console.error("Erreur chargement catégories:", err);
        setCategories(fallbackCategories);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleSelectCategory = (nom) => {
    navigate("/recherche", { state: { type: nom } });
  };

  return (
    <div className="py-12 sm:py-16 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-100/60 inline-flex items-center gap-1.5">
          <FaFolderOpen className="text-blue-500" /> Catégories de Biens
        </span>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mt-4">
          Explorez notre parc par type de bien
        </h1>

        <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
          Sélectionnez la catégorie de votre choix pour découvrir instantanément l'ensemble des annonces disponibles.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {categories.map((cat, index) => {
            const iconComponent = iconMap[cat.iconName || cat.icon] || <FaBuilding />;
            return (
              <div
                key={cat._id || index}
                onClick={() => handleSelectCategory(cat.nom)}
                className="group relative bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-8 cursor-pointer flex flex-col justify-between overflow-hidden"
              >
                {/* Decorative background gradient glow */}
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-500/5 rounded-full group-hover:scale-150 transition-transform duration-500 pointer-events-none" />

                <div>
                  <div className="w-16 h-16 rounded-2xl bg-blue-50 group-hover:bg-blue-600 text-blue-600 group-hover:text-white flex items-center justify-center text-3xl mb-6 shadow-xs transition-colors duration-300">
                    {iconComponent}
                  </div>

                  <h2 className="text-xl font-extrabold text-slate-800 group-hover:text-blue-600 transition-colors">
                    {cat.nom}
                  </h2>

                  <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600 group-hover:text-blue-700">
                  <span>Voir les offres</span>
                  <FaArrowRight className="transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}