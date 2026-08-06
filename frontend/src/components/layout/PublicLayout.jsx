import { Outlet, Link } from "react-router-dom";
import Navbar from "./Navbar";
import { FaHeart, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

export default function PublicLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans">
      <Navbar />

      <main className="flex-1">
        {children || <Outlet />}
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white tracking-tight">
              Gestion<span className="text-blue-500">-Bail</span>
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              La solution digitale complète et intuitive pour la gestion immobilière et locative.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase text-white tracking-wider mb-4">Navigation</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/" className="hover:text-white transition">Accueil</Link></li>
              <li><Link to="/recherche" className="hover:text-white transition">Biens disponibles</Link></li>
              <li><Link to="/categories" className="hover:text-white transition">Catégories</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase text-white tracking-wider mb-4">Aide & Support</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/help" className="hover:text-white transition">Centre d'aide</Link></li>
              <li><Link to="/contact" className="hover:text-white transition">Contactez-nous</Link></li>
              <li><Link to="/login" className="hover:text-white transition">Se connecter</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase text-white tracking-wider mb-4">Contact</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <FaEnvelope className="text-blue-400" />
                <span>support@gestionbail.com</span>
                <span>emmanuel.mbamba87@gail.com</span>
              </li>
              <li className="flex items-center gap-2">
                <FaPhoneAlt className="text-blue-400" />
                <span>+243 818 451 340</span>
                <span>+243 997 300 932</span>
              </li>
              <li className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-blue-400" />
                <span>Kinshasa, RDC</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto px-6">
          <p>© {new Date().getFullYear()} Gestion-Bail. Tous droits réservés.</p>
          <p className="flex items-center gap-1 mt-2 sm:mt-0">
            Conçu avec <FaHeart className="text-red-500" /> par MKTech
          </p>
        </div>
      </footer>
    </div>
  );
}