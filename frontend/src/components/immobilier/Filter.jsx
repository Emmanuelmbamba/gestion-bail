import { useState, useEffect } from "react";
import { FaFilter, FaSearch, FaMapMarkerAlt, FaHome, FaDollarSign, FaRedo } from "react-icons/fa";

export default function Filter({ onSearch, initialValues = {} }) {
  const [filters, setFilters] = useState({
    ville: "",
    type: "",
    statut: "",
    min: "",
    max: "",
    ...initialValues,
  });

  useEffect(() => {
    if (initialValues && Object.keys(initialValues).length > 0) {
      setFilters((prev) => ({ ...prev, ...initialValues }));
    }
  }, [initialValues]);

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const submit = (e) => {
    e.preventDefault();
    onSearch(filters);
  };

  const handleReset = () => {
    const resetState = { ville: "", type: "", statut: "", min: "", max: "" };
    setFilters(resetState);
    onSearch(resetState);
  };

  const hasActiveFilters = Boolean(filters.ville || filters.type || filters.statut || filters.min || filters.max);

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2 text-slate-800">
          <FaFilter className="text-blue-600 text-sm" />
          <h2 className="text-base font-bold">Filtrer par budget & critères</h2>
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleReset}
            className="text-xs font-semibold text-slate-400 hover:text-red-600 flex items-center gap-1 transition cursor-pointer"
          >
            <FaRedo className="text-[10px]" /> Réinitialiser
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Ville */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <FaMapMarkerAlt className="text-xs" />
          </div>
          <input
            name="ville"
            value={filters.ville || ""}
            placeholder="Ville ou adresse"
            className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-slate-800 text-xs bg-slate-50/50 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-semibold"
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
            value={filters.type || ""}
            className="w-full pl-9 pr-8 py-2.5 border border-slate-200 rounded-xl text-slate-700 text-xs bg-slate-50/50 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-semibold cursor-pointer appearance-none"
            onChange={handleChange}
          >
            <option value="">Tous les types</option>
            <option value="Appartement">Appartement</option>
            <option value="Maison">Maison</option>
            <option value="Studio">Studio</option>
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
            value={filters.statut || ""}
            className="w-full pl-9 pr-8 py-2.5 border border-slate-200 rounded-xl text-slate-700 text-xs bg-slate-50/50 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-semibold cursor-pointer appearance-none"
            onChange={handleChange}
          >
            <option value="">Toutes disponibilités</option>
            <option value="disponible">Disponible</option>
            <option value="occupé">Occupé</option>
            <option value="réservé">Réservé</option>
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
            value={filters.min || ""}
            placeholder="Prix min ($)"
            className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-slate-800 text-xs bg-slate-50/50 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-semibold"
            onChange={handleChange}
          />
        </div>

        {/* Prix Max */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <FaDollarSign className="text-xs" />
          </div>
          <input
            name="max"
            type="number"
            value={filters.max || ""}
            placeholder="Prix max ($)"
            className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-slate-800 text-xs bg-slate-50/50 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-semibold"
            onChange={handleChange}
          />
        </div>

        {/* Search Button */}
        <button
          type="submit"
          className="w-full py-2.5 px-3 text-white font-bold text-xs bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
        >
          <FaSearch /> Filtrer
        </button>
      </div>
    </form>
  );
}