import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Gallery from "../components/immobilier/Gallery";
import Map from "../components/immobilier/Map";
import ReservationForm from "../components/immobilier/ReservationForm";
import Navbar from "../components/layout/Navbar";
import { getBienById } from "../api/bienApi";
import {
  FaMapMarkerAlt,
  FaBed,
  FaBath,
  FaHome,
  FaAngleLeft,
  FaChevronRight,
  FaCheckCircle,
  FaShieldAlt,
  FaBolt,
  FaTint,
  FaCar,
  FaUserTie,
  FaEnvelope,
  FaPhoneAlt,
  FaShareAlt,
  FaHeart
} from "react-icons/fa";

export default function DetailBien() {
  const { id } = useParams();
  const [bien, setBien] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favori, setFavori] = useState(false);

  useEffect(() => {
    const fetchBien = async () => {
      try {
        const response = await getBienById(id);
        setBien(response.data);
      } catch (err) {
        console.error("Erreur de chargement du bien:", err);
        setError("Impossible de charger les détails de ce bien immobilier.");
      } finally {
        setLoading(false);
      }
    };
    fetchBien();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600 mb-4"></div>
          <p className="text-slate-600 text-xs font-bold uppercase tracking-wider">
            Chargement des détails du bien...
          </p>
        </div>
      </div>
    );
  }

  if (error || !bien) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex-1 container mx-auto p-6 flex flex-col items-center justify-center text-center">
          <div className="bg-white p-8 rounded-3xl border border-red-100 shadow-xl max-w-md">
            <h2 className="text-xl font-extrabold text-slate-800 mb-2">Bien introuvable</h2>
            <p className="text-slate-500 text-xs mb-6">{error || "Ce bien immobilier n'est plus disponible."}</p>
            <Link
              to="/recherche"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs uppercase tracking-wider shadow-md transition"
            >
              <FaAngleLeft /> Retour à la recherche
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isDisponible = (bien.status || "disponible").toLowerCase() === "disponible";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 sm:px-6 py-8 max-w-7xl">
        {/* Navigation & Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 overflow-x-auto py-1">
            <Link to="/" className="hover:text-blue-600 transition">Accueil</Link>
            <FaChevronRight className="text-[9px] shrink-0" />
            <Link to="/recherche" className="hover:text-blue-600 transition">Catalogue</Link>
            <FaChevronRight className="text-[9px] shrink-0" />
            <span className="text-slate-700 font-bold truncate max-w-[180px]">{bien.titre}</span>
          </div>

          <Link
            to="/recherche"
            className="inline-flex items-center gap-2 text-xs font-extrabold text-slate-600 hover:text-blue-600 transition"
          >
            <FaAngleLeft className="text-sm" /> Retour aux annonces
          </Link>
        </div>

        {/* Header Title & Quick Actions */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="bg-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border border-blue-200">
                  {bien.type || "Immobilier"}
                </span>

                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                    isDisponible
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-red-50 text-red-700 border-red-200"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isDisponible ? "bg-emerald-500 animate-pulse" : "bg-red-500"
                    }`}
                  />
                  {bien.status || "disponible"}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                {bien.titre}
              </h1>

              <p className="flex items-center gap-2 text-slate-500 text-xs sm:text-sm font-semibold">
                <FaMapMarkerAlt className="text-blue-600 shrink-0" />
                {bien.adresse}
              </p>
            </div>

            {/* Price Tag & Like */}
            <div className="flex items-center gap-4 border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-100">
              <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white px-6 py-4 rounded-3xl shadow-lg shadow-indigo-950/20 text-right">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                  Loyer mensuel
                </span>
                <span className="text-2xl sm:text-3xl font-black tracking-tight text-emerald-400">
                  {Number(bien.prix || 0).toLocaleString("fr-FR")}{" "}
                  <span className="text-xs font-bold text-white">$ / mois</span>
                </span>
              </div>

              <button
                onClick={() => setFavori(!favori)}
                className={`p-4 rounded-2xl border transition text-lg cursor-pointer ${
                  favori
                    ? "bg-red-50 border-red-200 text-red-600 shadow-sm"
                    : "bg-slate-50 border-slate-200 text-slate-400 hover:text-red-500 hover:bg-red-50"
                }`}
                title="Ajouter aux favoris"
              >
                <FaHeart />
              </button>
            </div>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100">
              <Gallery images={bien.images || []} />
            </div>

            {/* Main Features Grid */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-6">
              <h2 className="text-lg font-extrabold text-slate-800 tracking-tight">
                Caractéristiques principales
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100 flex items-center gap-3">
                  <div className="p-3 bg-blue-100 text-blue-600 rounded-xl text-lg shrink-0">
                    <FaHome />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Type</span>
                    <span className="text-xs font-extrabold text-slate-800">{bien.type || "Maison"}</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100 flex items-center gap-3">
                  <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl text-lg shrink-0">
                    <FaBed />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Chambres</span>
                    <span className="text-xs font-extrabold text-slate-800">{bien.chambres || 1} pièces</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100 flex items-center gap-3">
                  <div className="p-3 bg-purple-100 text-purple-600 rounded-xl text-lg shrink-0">
                    <FaBath />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Salles de bain</span>
                    <span className="text-xs font-extrabold text-slate-800">{bien.sallesBain || 1} SDB</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100 flex items-center gap-3">
                  <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl text-lg shrink-0">
                    <FaShieldAlt />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Disponibilité</span>
                    <span className="text-xs font-extrabold text-slate-800 capitalize">{bien.status || "Disponible"}</span>
                  </div>
                </div>
              </div>

              <hr className="border-slate-100" />

              {/* Description */}
              <div className="space-y-3">
                <h3 className="text-base font-extrabold text-slate-800">Description détaillée</h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed whitespace-pre-line bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
                  {bien.description || "Aucune description complémentaire fournie pour cette annonce immobilière."}
                </p>
              </div>

              <hr className="border-slate-100" />

              {/* Amenities Grid */}
              <div className="space-y-4">
                <h3 className="text-base font-extrabold text-slate-800">Équipements & Prestations</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 text-slate-700 text-xs font-bold border border-slate-100">
                    <FaTint className="text-blue-500 text-sm" /> Eau potable 24h/24
                  </div>
                  <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 text-slate-700 text-xs font-bold border border-slate-100">
                    <FaBolt className="text-amber-500 text-sm" /> Électricité stable
                  </div>
                  <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 text-slate-700 text-xs font-bold border border-slate-100">
                    <FaShieldAlt className="text-indigo-500 text-sm" /> Sécurité / Clôture
                  </div>
                  <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 text-slate-700 text-xs font-bold border border-slate-100">
                    <FaCar className="text-emerald-500 text-sm" /> Emplacement Parking
                  </div>
                  <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 text-slate-700 text-xs font-bold border border-slate-100">
                    <FaCheckCircle className="text-purple-500 text-sm" /> Accès goudronné
                  </div>
                </div>
              </div>
            </div>

            {/* Landlord Contact Card */}
            {bien.bailleur && (
              <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 rounded-3xl shadow-lg space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-xl text-blue-300 font-bold border border-white/10">
                      <FaUserTie />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-blue-300 tracking-wider">
                        Gestionnaire du bien
                      </p>
                      <h4 className="text-base font-extrabold text-white flex items-center gap-1.5">
                        {bien.bailleur.nom || "Propriétaire vérifié"}
                        <FaCheckCircle className="text-blue-400 text-xs" />
                      </h4>
                    </div>
                  </div>

                  <span className="text-xs bg-emerald-500/20 text-emerald-300 font-bold px-3 py-1 rounded-full border border-emerald-500/30">
                    Bailleur vérifié
                  </span>
                </div>

                <div className="flex flex-wrap gap-4 pt-2 text-xs text-slate-300">
                  {bien.bailleur.email && (
                    <span className="flex items-center gap-2 bg-white/5 px-3.5 py-2 rounded-xl border border-white/10">
                      <FaEnvelope className="text-blue-400" /> {bien.bailleur.email}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Location Map */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-4">
              <h2 className="text-lg font-extrabold text-slate-800">Localisation géographique</h2>
              <Map
                latitude={bien.latitude || -4.325}
                longitude={bien.longitude || 15.322}
                adresse={bien.adresse || "Localisation du bien"}
              />
            </div>
          </div>

          {/* Right Sticky Column: Visit Reservation */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <ReservationForm bienId={bien._id} />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-10 border-t border-slate-800 mt-16">
        <div className="container mx-auto px-6 max-w-7xl flex flex-col md:flex-row justify-between items-center gap-6 text-xs">
          <div className="space-y-1 text-center md:text-left">
            <span className="text-lg font-black text-white bg-gradient-to-r from-blue-400 to-indigo-400 text-transparent bg-clip-text">
              🏢 Gestion-Bail
            </span>
            <p className="text-slate-500">Plateforme immobilière de gestion locative sécurisée.</p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 font-semibold text-slate-400">
            <Link to="/" className="hover:text-white transition">Accueil</Link>
            <Link to="/recherche" className="hover:text-white transition">Recherche</Link>
            <Link to="/help" className="hover:text-white transition">Aide</Link>
            <Link to="/contact" className="hover:text-white transition">Contact</Link>
          </div>

          <div className="text-center md:text-right text-[10px] text-slate-600">
            &copy; {new Date().getFullYear()} Gestion-Bail. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
}