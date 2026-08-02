import { Link } from "react-router-dom";
import FavoriButton from "../immobilier/FavoriButton";
import { FaMapMarkerAlt, FaBed, FaBuilding } from "react-icons/fa";

export default function BienCard({ bien }) {
  const hasPhoto = bien.images && bien.images.length > 0;
  const firstPhoto = hasPhoto ? bien.images[0] : null;

  return (
    <div className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between h-full">
      {/* Photo Section with Zoom Effect */}
      <div className="h-44 sm:h-48 bg-slate-100 relative overflow-hidden">
        {firstPhoto ? (
         <img
  src={
    firstPhoto.startsWith("http")
      ? firstPhoto
      : `${import.meta.env.VITE_API_URL.replace("/api", "")}${firstPhoto}`
  }
  alt={bien.titre}
  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
/>  
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-2 bg-slate-50">
            <FaBuilding className="text-5xl text-slate-300" />
            <span className="text-xs font-semibold text-slate-400">Aucune photo</span>
          </div>
        )}

        {/* Floating Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-1.5 pointer-events-none">
          <span className="bg-blue-600 text-white text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-1 rounded-lg shadow-sm">
            {bien.type}
          </span>
          <span className={`text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-1 rounded-lg shadow-sm ${
            bien.statut === "Disponible" || !bien.statut
              ? "bg-emerald-500 text-white"
              : "bg-red-500 text-white"
          }`}>
            {bien.statut || "Disponible"}
          </span>
        </div>

        {/* Floating Heart Button */}
        <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md w-10 h-10 rounded-xl flex items-center justify-center shadow-md hover:bg-white hover:scale-105 active:scale-95 transition-all duration-150 cursor-pointer [&_button]:text-lg [&_button]:p-0 [&_button]:flex [&_button]:items-center [&_button]:justify-center">
          <FavoriButton bienId={bien._id} />
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-extrabold text-slate-800 tracking-tight line-clamp-1 group-hover:text-blue-600 transition-colors duration-150">
            {bien.titre}
          </h3>

          <p className="flex items-center gap-1.5 text-slate-400 text-xs mt-1.5">
            <FaMapMarkerAlt className="text-slate-400" />
            <span className="truncate">{bien.quartier ? `${bien.quartier}, ` : ""}{bien.ville}</span>
          </p>

          <div className="grid grid-cols-2 gap-4 my-4 py-3 border-y border-slate-50 text-slate-600 text-xs font-semibold">
            <span className="flex items-center gap-1.5">
              <FaBuilding className="text-slate-400 text-sm" /> {bien.type}
            </span>
            {bien.chambres > 0 && (
              <span className="flex items-center gap-1.5">
                <FaBed className="text-slate-400 text-sm" /> {bien.chambres} Ch.
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mt-2 pt-2 gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Loyer mensuel</span>
            <span className="text-xl font-black text-slate-800">
              {Number(bien.prix || 0).toLocaleString("fr-FR")} $
            </span>
          </div>

          <Link
            to={`/biens/${bien._id}`}
            className="px-4 py-2.5 bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white rounded-xl text-xs font-bold transition-all duration-200 shadow-xs flex items-center justify-center cursor-pointer border border-blue-100/50 hover:border-blue-600"
          >
            Voir détail
          </Link>
        </div>
      </div>
    </div>
  );
}