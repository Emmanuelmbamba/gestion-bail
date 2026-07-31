import { useState } from "react";
import { FaFilter, FaSearch, FaMapMarkerAlt, FaHome, FaDollarSign } from "react-icons/fa";

export default function Filter({ onSearch }) {
  const [filters, setFilters] = useState({
    ville: "",
    type: "",
    statut: "",
    min: "",
    max: ""
  });

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const submit = (e) => {
    e.preventDefault();
    onSearch(filters);
  };

  return (
    <form
      onSubmit={submit}
      className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 md:p-6"
    >
      <div className="flex items-center gap-2 mb-4 text-slate-800">
        <FaFilter className="text-blue-600 text-sm" />
        <h2 className="text-lg font-bold">Filtrer les biens</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
        {/* Ville */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <FaMapMarkerAlt className="text-xs" />
          </div>
          <input
            name="ville"
            placeholder="Ville"
            className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-slate-800 text-xs bg-slate-50/50 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 font-semibold"
            onChange={handleChange}
          />
        </div>

        {/* Type */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <FaHome className="text-xs" />
          </div>
          <select
            name="type"
            className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-slate-700 text-xs bg-slate-50/50 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 font-semibold cursor-pointer appearance-none"
            onChange={handleChange}
          >
            <option value="">Type (Tous)</option>
            <option value="Appartement">Appartement</option>
            <option value="Maison">Maison</option>
            <option value="Studio">Studio</option>
            <option value="Villa">Villa</option>
            <option value="Bureau">Bureau</option>
            <option value="Boutique">Boutique</option>
            <option value="Terrain">Terrain</option>
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
          </div>
        </div>

        {/* Statut / Disponibilité */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
          </div>
          <select
            name="statut"
            className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-slate-700 text-xs bg-slate-50/50 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 font-semibold cursor-pointer appearance-none"
            onChange={handleChange}
          >
            <option value="">Disponibilité (Tous)</option>
            <option value="Disponible">Disponible</option>
            <option value="Occupé">Occupé</option>
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
          </div>
        </div>

        {/* Prix Min */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <FaDollarSign className="text-xs" />
          </div>
          <input
            name="min"
            type="number"
            placeholder="Prix min ($)"
            className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-slate-800 text-xs bg-slate-50/50 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 font-semibold"
            onChange={handleChange}
          />
        </div>

        {/* Search Button */}
        <button
          type="submit"
          className="w-full py-2.5 px-4 text-white font-bold text-xs bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <FaSearch /> Filtrer
        </button>
      </div>
    </form>
  );
}