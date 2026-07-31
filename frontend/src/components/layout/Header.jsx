import { FaBell, FaUserCircle, FaBars } from "react-icons/fa";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

function Header({ onToggleSidebar }) {
  const { user } = useContext(AuthContext);

  return (
    <header className="h-16 bg-white border-b border-slate-100 flex justify-between items-center px-4 sm:px-6 z-30">
      <div className="flex items-center gap-3">
        {/* Mobile Toggle Button */}
        <button 
          onClick={onToggleSidebar}
          className="md:hidden p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
          title="Ouvrir le menu"
        >
          <FaBars className="text-lg" />
        </button>

        <h2 className="hidden sm:block text-lg sm:text-xl font-bold text-slate-800 tracking-tight">
          Espace Gestion Locative
        </h2>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications Shortcut */}
        <Link 
          to="/notifications" 
          className="p-2 text-slate-500 hover:text-blue-600 hover:bg-slate-50 rounded-xl transition-all duration-150 cursor-pointer"
          title="Notifications"
        >
          <FaBell className="text-lg" />
        </Link>

        {/* User Info Profile */}
        <div className="flex items-center gap-2 border-l border-slate-100 pl-4">
          <FaUserCircle className="text-2xl sm:text-3xl text-slate-300" />
          <div className="text-left hidden xs:block">
            <p className="text-xs sm:text-sm font-bold text-slate-800 leading-none">
              {user?.nom || "Utilisateur"}
            </p>
            <span className="text-[9px] font-extrabold uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md mt-1 inline-block">
              {user?.role === "admin" ? "Administrateur" : 
               user?.role === "bailleur" ? "Bailleur" : 
               user?.role === "agent" ? "Agent" : 
               user?.role === "locataire" ? "Locataire" : 
               user?.role || "Visiteur"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;