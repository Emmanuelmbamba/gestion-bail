import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import BienCard from "../components/home/BienCard";
import api from "../api/axios";
import { FaHeart } from "react-icons/fa";

export default function Favoris() {
  const [favoris, setFavoris] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadFavoris = async () => {
    try {
      const res = await api.get("/favoris");
      setFavoris(res.data || []);
    } catch (error) {
      console.error("Erreur chargement favoris:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavoris();
  }, []);

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
          <FaHeart className="text-red-500" /> Mes Biens Favoris
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-1">
          Retrouvez l'ensemble des annonces immobilières que vous avez enregistrées.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : favoris.length === 0 ? (
        <div className="text-center py-16 text-slate-400 bg-white border border-slate-100 rounded-3xl p-8 shadow-xs">
          <FaHeart className="text-4xl text-slate-300 mx-auto mb-2" />
          <p className="font-semibold text-slate-700">Aucun bien en favori</p>
          <p className="text-xs text-slate-400 mt-1">Explorez les annonces et cliquez sur le cœur pour les conserver ici.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {favoris.map((item) => (
            <BienCard key={item._id} bien={item.bien} />
          ))}
        </div>
      )}
    </Layout>
  );
}