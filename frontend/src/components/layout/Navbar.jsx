import { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { FaHeart, FaSearch, FaHome, FaSignOutAlt, FaSignInAlt, FaUserPlus, FaLaptop, FaBars, FaTimes } from "react-icons/fa";
import logo from "../../assets/logo-mktechbail.png";

<img src={logo} alt="MKTech Bail" />
function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate("/login");
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all duration-200">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <span className="text-xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text flex items-center gap-1.5">
            🏢 Gestion-Bail
          </span>
        </Link>

        {/* Navigation Links (Desktop) */}
        <div className="hidden md:flex items-center gap-6">
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              `flex items-center gap-1.5 text-sm font-semibold transition-colors duration-150 py-1.5 px-3 rounded-lg ${
                isActive 
                  ? "text-blue-600 bg-blue-50" 
                  : "text-slate-600 hover:text-blue-600 hover:bg-slate-50"
              }`
            }
          >
            <FaHome className="text-xs" /> Accueil
          </NavLink>
          <NavLink 
            to="/recherche" 
            className={({ isActive }) => 
              `flex items-center gap-1.5 text-sm font-semibold transition-colors duration-150 py-1.5 px-3 rounded-lg ${
                isActive 
                  ? "text-blue-600 bg-blue-50" 
                  : "text-slate-600 hover:text-blue-600 hover:bg-slate-50"
              }`
            }
          >
            <FaSearch className="text-xs" /> Rechercher
          </NavLink>
          {user && (
            <NavLink 
              to="/favoris" 
              className={({ isActive }) => 
                `flex items-center gap-1.5 text-sm font-semibold transition-colors duration-150 py-1.5 px-3 rounded-lg ${
                  isActive 
                    ? "text-blue-600 bg-blue-50" 
                    : "text-slate-600 hover:text-blue-600 hover:bg-slate-50"
                }`
              }
            >
              <FaHeart className="text-xs text-red-500" /> Favoris
            </NavLink>
          )}
        </div>

        {/* Right Action Side (Desktop) */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              {/* Dashboard Shortcut */}
              <Link 
                to="/dashboard" 
                className="flex items-center gap-1.5 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-4 py-2 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
              >
                <FaLaptop /> Espace Pro
              </Link>
              
              {/* Welcome Nom */}
              <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg">
                Hello, {user.nom}
              </span>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center justify-center p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200 cursor-pointer"
                title="Déconnexion"
              >
                <FaSignOutAlt className="text-sm" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link 
                to="/login" 
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 bg-slate-50 hover:bg-slate-100 px-4 py-2 rounded-xl transition-all duration-150"
              >
                <FaSignInAlt /> Connexion
              </Link>
              <Link 
                to="/register" 
                className="flex items-center gap-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl shadow-sm hover:shadow transition-all duration-150"
              >
                <FaUserPlus /> S'enregistrer
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-3">
          {user && (
            <Link 
              to="/dashboard" 
              className="flex items-center gap-1 text-[10px] font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 px-2.5 py-1.5 rounded-lg shadow-sm"
            >
              <FaLaptop /> Pro
            </Link>
          )}
          <button 
            onClick={toggleMobileMenu}
            className="p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-lg transition-colors focus:outline-none"
          >
            {mobileMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-100 px-6 py-4 space-y-3 animate-fadeIn">
          <NavLink 
            to="/" 
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) => 
              `flex items-center gap-2.5 text-sm font-bold p-2.5 rounded-lg transition-colors duration-150 ${
                isActive 
                  ? "text-blue-600 bg-blue-50" 
                  : "text-slate-600 hover:text-blue-600 hover:bg-slate-50"
              }`
            }
          >
            <FaHome /> Accueil
          </NavLink>
          <NavLink 
            to="/recherche" 
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) => 
              `flex items-center gap-2.5 text-sm font-bold p-2.5 rounded-lg transition-colors duration-150 ${
                isActive 
                  ? "text-blue-600 bg-blue-50" 
                  : "text-slate-600 hover:text-blue-600 hover:bg-slate-50"
              }`
            }
          >
            <FaSearch /> Rechercher
          </NavLink>
          {user && (
            <NavLink 
              to="/favoris" 
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) => 
                `flex items-center gap-2.5 text-sm font-bold p-2.5 rounded-lg transition-colors duration-150 ${
                  isActive 
                    ? "text-blue-600 bg-blue-50" 
                    : "text-slate-600 hover:text-blue-600 hover:bg-slate-50"
                }`
              }
            >
              <FaHeart className="text-red-500" /> Favoris
            </NavLink>
          )}

          <hr className="border-slate-100 my-2" />

          {user ? (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg w-full text-center">
                  Connecté : {user.nom}
                </span>
              </div>
              <div className="flex gap-2">
                <Link 
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 py-2.5 rounded-xl text-center shadow-sm"
                >
                  <FaLaptop /> Espace Pro
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 px-4 py-2.5 rounded-xl border border-red-100"
                >
                  <FaSignOutAlt /> Quitter
                </button>
              </div>
            </div>
          ) : (
            <div className="flex gap-2 pt-2">
              <Link 
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-600 bg-slate-100 py-2.5 rounded-xl text-center"
              >
                <FaSignInAlt /> Connexion
              </Link>
              <Link 
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold text-white bg-blue-600 py-2.5 rounded-xl text-center shadow-sm"
              >
                <FaUserPlus /> S'enregistrer
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;