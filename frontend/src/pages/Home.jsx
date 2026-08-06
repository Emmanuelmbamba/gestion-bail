import Hero from "../components/home/Hero";
import PromoTicker from "../components/home/PromoTicker";
import FeaturedBiens from "../components/home/FeaturedBiens";
import { Link } from "react-router-dom";
import { 
  FaFileContract, 
  FaRegBell, 
  FaShieldAlt,
  FaQuestionCircle,
  FaPhoneAlt,
  FaArrowRight
} from "react-icons/fa";

export default function Home() {
  return (
    <div className="space-y-12 pb-12">
      <Hero />
      <PromoTicker />

      {/* FEATURES SECTION */}
      <section className="bg-white border-y border-slate-100 py-16">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600 bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-100/60">
              🚀 Notre Mission
            </span>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-4">
              Une gestion locative moderne et transparente
            </h2>

            <p className="text-sm sm:text-base text-slate-500 mt-2">
              Simplifiez vos démarches administratives et sécurisez vos relations bailleur-locataire.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* CONTRATS */}
            <div className="p-8 rounded-3xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-xl transition-all duration-300 text-center space-y-4 group">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto text-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 shadow-xs">
                <FaFileContract />
              </div>
              <h3 className="font-extrabold text-slate-800 text-lg">
                Contrats PDF officiels
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Générez, consultez et téléchargez vos contrats de bail en toute sécurité au format PDF.
              </p>
            </div>

            {/* PAIEMENTS */}
            <div className="p-8 rounded-3xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-xl transition-all duration-300 text-center space-y-4 group">
              <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto text-2xl group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300 shadow-xs">
                <FaShieldAlt />
              </div>
              <h3 className="font-extrabold text-slate-800 text-lg">
                Paiements & Quittances
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Suivez l'historique des loyers réglés et éditez les factures et reçus en un clic.
              </p>
            </div>

            {/* NOTIFICATIONS */}
            <div className="p-8 rounded-3xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-xl transition-all duration-300 text-center space-y-4 group">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto text-2xl group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300 shadow-xs">
                <FaRegBell />
              </div>
              <h3 className="font-extrabold text-slate-800 text-lg">
                Alertes & Notifications
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Recevez les rappels d'échéances de baux, renouvellements et rendez-vous de visite.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* BIENS EN VEDETTE */}
      <FeaturedBiens />

      {/* SUPPORT & CONTACT CTA */}
      <section className="py-12">
        <div className="container mx-auto px-6 max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50/60 border border-blue-100 rounded-3xl p-8 text-center sm:text-left flex flex-col justify-between items-center sm:items-start gap-6">
            <div>
              <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-xl mb-4 shadow-sm">
                <FaQuestionCircle />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900">Besoin d'assistance ?</h3>
              <p className="text-slate-600 text-sm mt-2">Consultez nos guides pratiques et questions fréquentes.</p>
            </div>
            <Link
              to="/help"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-sm transition"
            >
              Centre d'aide <FaArrowRight className="text-xs" />
            </Link>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-teal-50/60 border border-emerald-100 rounded-3xl p-8 text-center sm:text-left flex flex-col justify-between items-center sm:items-start gap-6">
            <div>
              <div className="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center text-xl mb-4 shadow-sm">
                <FaPhoneAlt />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900">Une question spécifique ?</h3>
              <p className="text-slate-600 text-sm mt-2">Notre équipe reste joignable pour vous répondre.</p>
            </div>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 shadow-sm transition"
            >
              Nous contacter <FaArrowRight className="text-xs" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}