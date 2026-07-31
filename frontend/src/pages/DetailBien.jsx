import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Gallery from "../components/immobilier/Gallery";
import Map from "../components/immobilier/Map";
import ReservationForm from "../components/immobilier/ReservationForm";
import Navbar from "../components/layout/Navbar";
import { getBienById } from "../api/bienApi";
import { FaMapMarkerAlt, FaBed, FaHome, FaAngleLeft, FaChevronRight } from "react-icons/fa";

export default function DetailBien() {
  const { id } = useParams();
  const [bien, setBien] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        <div className="flex-1 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error || !bien) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex-1 container mx-auto p-6 flex flex-col items-center justify-center text-center">
          <div className="bg-red-50 text-red-700 p-6 rounded-2xl border border-red-100 max-w-md">
            <h2 className="text-xl font-bold mb-2">Erreur de chargement</h2>
            <p className="text-sm mb-4">{error || "Bien introuvable."}</p>
            <Link to="/recherche" className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:underline">
              <FaAngleLeft /> Retour à la recherche
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-6 py-8 max-w-6xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-6">
          <Link to="/" className="hover:text-blue-600">Accueil</Link>
          <FaChevronRight className="text-[10px]" />
          <Link to="/recherche" className="hover:text-blue-600">Biens</Link>
          <FaChevronRight className="text-[10px]" />
          <span className="text-slate-600 font-bold truncate max-w-[200px]">{bien.titre}</span>
        </div>

        {/* Back Link */}
        <Link to="/recherche" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-blue-600 mb-6 transition-colors duration-150">
          <FaAngleLeft className="text-base" /> Retour aux résultats
        </Link>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Details & Images */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Gallery */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
              <Gallery images={bien.images || []} />
            </div>

            {/* Info and Description */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 border-b border-slate-100 pb-5">
                <div>
                  <span className="bg-blue-100 text-blue-800 text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-1 rounded-md mb-2 inline-block">
                    {bien.type}
                  </span>
                  <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">
                    {bien.titre}
                  </h1>
                  <p className="flex items-center gap-1.5 text-slate-500 text-sm mt-2">
                    <FaMapMarkerAlt className="text-blue-600" />
                    {bien.adresse}, {bien.quartier ? `${bien.quartier}, ` : ""}{bien.ville}
                  </p>
                </div>
                <div className="text-left sm:text-right bg-slate-50 px-4 py-3 rounded-2xl">
                  <span className="text-xs text-slate-400 font-semibold block">Loyer mensuel</span>
                  <span className="text-2xl font-black text-slate-800 flex items-center gap-1">
                    {Number(bien.prix || 0).toLocaleString("fr-FR")} $
                  </span>
                </div>
              </div>

              {/* Badges / Specs */}
              <div className="flex flex-wrap gap-4 text-slate-600 text-sm font-semibold bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                <span className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl shadow-xs border border-slate-100">
                  <FaHome className="text-blue-600" /> {bien.type}
                </span>
                {bien.chambres > 0 && (
                  <span className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl shadow-xs border border-slate-100">
                    <FaBed className="text-blue-600" /> {bien.chambres} Chambres
                  </span>
                )}
                <span className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl shadow-xs border border-slate-100">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block animate-pulse"></span>
                  Statut : {bien.statut || "Disponible"}
                </span>
              </div>

              {/* Description */}
              <div className="space-y-3">
                <h2 className="text-lg font-bold text-slate-800">Description du bien</h2>
                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                  {bien.description || "Aucune description fournie pour ce bien immobilier."}
                </p>
              </div>
            </div>

            {/* Map Localization */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
              <h2 className="text-lg font-bold text-slate-800">Localisation géographique</h2>
              <Map
                latitude={bien.latitude || -4.325}
                longitude={bien.longitude || 15.322}
                adresse={bien.adresse || "Adresse du bien"}
              />
            </div>

          </div>

          {/* Right Column: Reservation / Visit Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <ReservationForm bienId={bien._id} />
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 mt-16">
        <div className="container mx-auto px-6 max-w-6xl flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-lg font-black text-white bg-gradient-to-r from-blue-400 to-indigo-400 text-transparent bg-clip-text">
              🏢 Gestion-Bail
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