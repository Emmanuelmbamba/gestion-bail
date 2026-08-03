import { useEffect, useState } from "react";
import Navbar from "../components/layout/Navbar";
import BienCard from "../components/home/BienCard";
import api from "../api/axios";
import Logo from "../components/common/Logo";

export default function Favoris() {
  const [favoris, setFavoris] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadFavoris = async () => {
    try {
      const res = await api.get("/favoris");
      setFavoris(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    Promise.resolve().then(() => {
      loadFavoris();
    });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <div>
        <Navbar />
        
        <main className="container mx-auto px-6 py-10 max-w-6xl">
          <div className="mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              ❤️ Collection
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight mt-1">
              Mes favoris
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Retrouvez l'ensemble des biens immobiliers que vous avez sauvegardés.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : favoris.length === 0 ? (
            <div className="text-center py-16 text-slate-400 bg-white border border-slate-100 rounded-2xl p-8">
              Aucun bien immobilier ajouté aux favoris pour le moment.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {favoris.map((item) => (
                <BienCard key={item._id} bien={item.bien} />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 mt-16">
        <div className="container mx-auto px-6 max-w-6xl flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-lg font-black text-white bg-gradient-to-r from-blue-400 to-indigo-400 text-transparent bg-clip-text">
               <Logo size={50} />
            </span>
            <p className="text-xs text-slate-500">
              La solution intelligente pour les locataires et les bailleurs.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 text-xs font-semibold text-slate-400">
            <a href="/" className="hover:text-white transition-colors">Accueil</a>
            <a href="/recherche" className="hover:text-white transition-colors">Rechercher</a>
            <a href="/login" className="hover:text-white transition-colors">Connexion</a>
            <a href="/register" className="hover:text-white transition-colors">Inscription</a>
          </div>

          <div className="text-center md:text-right text-[10px] text-slate-600">
            &copy; {new Date().getFullYear()} Gestion-Bail. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
}