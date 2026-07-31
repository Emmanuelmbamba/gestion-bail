import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaMapMarkerAlt, FaHome, FaDollarSign } from "react-icons/fa";

export default function SearchBox() {
  const navigate = useNavigate();

  const [search, setSearch] = useState({
    ville: "",
    type: "",
    min: "",
    max: ""
  });

  const handleChange = (e) => {
    setSearch({
      ...search,
      [e.target.name]: e.target.value
    });
  };

  const rechercher = () => {
    navigate("/recherche", {
      state: search
    });
  };

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-100 p-5 md:p-6 text-slate-800">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-center">
        {/* Ville Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <FaMapMarkerAlt />
          </div>
          <input
            name="ville"
            type="text"
            placeholder="Où cherchez-vous ?"
            className="w-full pl-9 pr-3 py-3 border border-slate-200 rounded-xl text-slate-800 text-sm bg-slate-50/50 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 font-semibold"
            onChange={handleChange}
          />
        </div>

        {/* Type de bien Select */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <FaHome />
          </div>
          <select
            name="type"
            className="w-full pl-9 pr-3 py-3 border border-slate-200 rounded-xl text-slate-700 text-sm bg-slate-50/50 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 font-semibold cursor-pointer appearance-none"
            onChange={handleChange}
          >
            <option value="">Type de bien (Tous)</option>
            <option value="Appartement">Appartement</option>
            <option value="Maison">Maison</option>
            <option value="Studio">Studio</option>
            <option value="Villa">Villa</option>
            <option value="Bureau">Bureau</option>
            <option value="Boutique">Boutique</option>
            <option value="Terrain">Terrain</option>
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
          </div>
        </div>

        {/* Prix Min Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <FaDollarSign />
          </div>
          <input
            name="min"
            placeholder="Loyer min ($)"
            type="number"
            className="w-full pl-9 pr-3 py-3 border border-slate-200 rounded-xl text-slate-800 text-sm bg-slate-50/50 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 font-semibold"
            onChange={handleChange}
          />
        </div>

        {/* Search Button */}
        <button
          onClick={rechercher}
          className="w-full py-3 px-6 text-white font-bold text-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer"
        >
          <FaSearch /> Rechercher
        </button>
      </div>
    </div>
  );
}