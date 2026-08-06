import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getBiens } from "../../api/bienApi";
import { FaHome, FaMapMarkerAlt, FaDollarSign } from "react-icons/fa";

export default function PromoTicker() {
  const [maisons, setMaisons] = useState([]);
  const [loading, setLoading] = useState(true);
  const fallbackImage = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1000&q=80";

  useEffect(() => {
    const fetchMaisons = async () => {
      try {
        const response = await getBiens();
        const filtered = (response.data || []).filter(
          (b) => b.type === "Maison" || b.type === "Villa"
        );
        const list = filtered.length > 0 ? filtered : response.data || [];
        setMaisons(list);
      } catch (error) {
        console.error("Erreur de chargement de la pub:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMaisons();
  }, []);

  if (loading || maisons.length === 0) return null;

  const marqueeList = [...maisons, ...maisons, ...maisons];

  const getImageUrl = (path) => {
    if (!path) return fallbackImage;
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    const apiBase = import.meta.env.VITE_API_URL || "https://gestion-bail-backend.onrender.com/api";
    const serverUrl = apiBase.replace(/\/api\/?$/, "").replace(/\/$/, "");
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${serverUrl}${cleanPath}`;
  };

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = fallbackImage;
  };

  return (
    <section className="bg-gradient-to-r from-blue-900 to-indigo-900 py-6 overflow-hidden relative border-y border-blue-950 shadow-inner">
      <div className="absolute top-0 left-0 bg-red-600 text-white text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-br-lg z-10 shadow-sm animate-pulse">
        🔥 À la une
      </div>

      <div className="relative w-full overflow-hidden flex">
        <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-blue-900 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-indigo-900 to-transparent z-10 pointer-events-none"></div>

        <div className="animate-marquee flex gap-6 items-center py-2">
          {marqueeList.map((item, index) => {
            const hasPhoto = item.images && item.images.length > 0;
            const photoUrl = hasPhoto ? item.images[0] : null;

            return (
              <Link
                key={`${item._id}-${index}`}
                to={`/biens/${item._id}`}
                className="flex items-center gap-4 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-2.5 w-72 md:w-80 shrink-0 hover:bg-white/15 hover:border-white/20 transition-all duration-300 cursor-pointer shadow-md group"
              >
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-lg overflow-hidden bg-slate-800 shrink-0 relative">
                  {photoUrl ? (
                    <img
                      src={getImageUrl(photoUrl)}
                      alt={item.titre}
                      onError={handleImageError}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/50">
                      <FaHome className="text-xl" />
                    </div>
                  )}
                </div>

                <div className="min-w-0 text-white flex-1 space-y-1">
                  <span className="bg-emerald-500 text-white text-[8px] font-black tracking-wider uppercase px-1.5 py-0.5 rounded">
                    Disponible
                  </span>
                  <h4 className="font-extrabold text-sm md:text-base tracking-tight truncate group-hover:text-blue-300 transition-colors">
                    {item.titre}
                  </h4>
                  <p className="text-[10px] text-slate-300 flex items-center gap-1">
                    <FaMapMarkerAlt /> <span className="truncate">{item.ville}</span>
                  </p>
                  <p className="text-xs font-black text-emerald-400 flex items-center gap-0.5 mt-1">
                    <FaDollarSign className="text-[10px]" />
                    {Number(item.prix || 0).toLocaleString("fr-FR")} / mois
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
