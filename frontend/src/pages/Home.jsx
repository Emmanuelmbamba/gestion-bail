import Navbar from "../components/layout/Navbar";
import Hero from "../components/home/Hero";
import PromoTicker from "../components/home/PromoTicker";
import FeaturedBiens from "../components/home/FeaturedBiens";
import { FaFileContract, FaRegBell, FaShieldAlt } from "react-icons/fa";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <div>
        <Navbar />
        <Hero />
        <PromoTicker />
        
        {/* Features / Why Us Section */}
        <section className="bg-white border-y border-slate-100 py-16">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                🚀 Notre Mission
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight mt-3">
                Une gestion locative moderne et transparente
              </h2>
              <p className="text-sm text-slate-500 mt-2">
                Simplifiez vos démarches administratives et sécurisez vos relations bailleur-locataire.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="p-6 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:shadow-md transition-all duration-200 text-center space-y-4">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mx-auto text-xl shadow-xs">
                  <FaFileContract />
                </div>
                <h3 className="font-bold text-slate-800 text-lg">Contrats PDF officiels</h3>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                  Générez et signez vos contrats de bail officiels en ligne. Téléchargez-les à tout moment au format PDF.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-6 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:shadow-md transition-all duration-200 text-center space-y-4">
                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mx-auto text-xl shadow-xs">
                  <FaShieldAlt />
                </div>
                <h3 className="font-bold text-slate-800 text-lg">Paiements sécurisés</h3>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                  Générez des factures de loyer claires, suivez les historiques de paiement et évitez les retards.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-6 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:shadow-md transition-all duration-200 text-center space-y-4">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mx-auto text-xl shadow-xs">
                  <FaRegBell />
                </div>
                <h3 className="font-bold text-slate-800 text-lg">Suivi & Notifications</h3>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                  Soyez averti instantanément des signatures de contrats, des nouvelles factures ou des demandes de visites.
                </p>
              </div>
            </div>
          </div>
        </section>

        <FeaturedBiens />
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
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