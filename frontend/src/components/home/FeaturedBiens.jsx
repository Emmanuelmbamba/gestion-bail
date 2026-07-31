import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BienCard from "./BienCard";
import { getBiens } from "../../api/bienApi";
import { FaArrowRight } from "react-icons/fa";

export default function FeaturedBiens() {
  const [biens, setBiens] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadBiens = async () => {
    try {
      const response = await getBiens();
      setBiens(response.data.slice(0, 6));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    Promise.resolve().then(() => {
      loadBiens();
    });
  }, []);

  return (
    <section className="container mx-auto px-6 py-16 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
            ✨ Exclusivités
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight mt-1">
            Nos biens disponibles à la location
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Découvrez nos appartements, studios et villas récemment ajoutés.
          </p>
        </div>
        <Link 
          to="/recherche" 
          className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-indigo-600 transition-colors group"
        >
          Voir toutes les annonces 
          <FaArrowRight className="text-xs transform group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : biens.length === 0 ? (
        <div className="text-center py-16 text-slate-400 bg-white border border-slate-100 rounded-2xl p-8">
          Aucun bien disponible actuellement.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {biens.map((bien) => (
            <BienCard key={bien._id} bien={bien} />
          ))}
        </div>
      )}
    </section>
  );
}