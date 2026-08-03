import { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Filter from "../components/immobilier/Filter";
import BienCard from "../components/home/BienCard";
import { searchBien } from "../api/bienApi";
import Logo from "../components/common/Logo";

export default function Recherche() {
  const location = useLocation();
  const [biens, setBiens] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleSearch = useCallback(async (filters) => {
    setLoading(true);
    try {
      const res = await searchBien(filters);
      setBiens(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const res = await searchBien({});
      setBiens(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    Promise.resolve().then(() => {
      if (location.state) {
        handleSearch(location.state);
      } else {
        loadAll();
      }
    });
  }, [location.state, handleSearch, loadAll]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <div>
        <Navbar />

        <main className="container mx-auto px-6 py-10 max-w-6xl">
          <div className="mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              🔍 Exploration
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight mt-1">
              Recherche immobilière
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Trouvez et filtrez les offres de logements correspondants à vos besoins.
            </p>
          </div>

          <Filter onSearch={handleSearch} />

          {loading ? (
            <div className="flex justify-center items-center h-64 mt-12">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : biens.length === 0 ? (
            <div className="text-center py-16 text-slate-400 bg-white border border-slate-100 rounded-2xl p-8 mt-10">
              Aucun bien immobilier ne correspond à vos critères de recherche.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
              {biens.map((bien) => (
                <BienCard key={bien._id} bien={bien} />
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