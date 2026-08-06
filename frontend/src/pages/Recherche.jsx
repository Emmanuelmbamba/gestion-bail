import { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import Filter from "../components/immobilier/Filter";
import BienCard from "../components/home/BienCard";
import { searchBien } from "../api/bienApi";

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
      console.error("Erreur lors de la recherche de biens:", error);
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
      console.error("Erreur lors du chargement des biens:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (location.state) {
      handleSearch(location.state);
    } else {
      loadAll();
    }
  }, [location.state, handleSearch, loadAll]);

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <span className="text-xs font-extrabold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100/60">
          🔍 Exploration
        </span>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
          Recherche immobilière
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Trouvez et filtrez les logements correspondant précisément à vos exigences.
        </p>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm mb-10">
        <Filter onSearch={handleSearch} initialValues={location.state || {}} />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
        </div>
      ) : biens.length === 0 ? (
        <div className="text-center py-16 text-slate-400 bg-white border border-slate-100 rounded-3xl p-8 shadow-xs">
          <p className="text-lg font-semibold text-slate-600">Aucun bien immobilier ne correspond à vos critères.</p>
          <p className="text-xs text-slate-400 mt-1">Essayez d'élargir votre recherche ou d'effacer certains filtres.</p>
        </div>
      ) : (
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
            {biens.length} {biens.length > 1 ? "résultats trouvés" : "résultat trouvé"}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {biens.map((bien) => (
              <BienCard key={bien._id} bien={bien} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}