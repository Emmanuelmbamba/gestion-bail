import { useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import Logo from "../common/Logo";
import { AuthContext } from "../../context/AuthContext";
import { FaBars, FaTimes, FaUser } from "react-icons/fa";

export default function Navbar() {
  const { user } = useContext(AuthContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Accueil", path: "/" },
    { name: "Recherche", path: "/recherche" },
    { name: "Catégories", path: "/categories" },
    { name: "Aide", path: "/help" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100 sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl h-16 flex items-center justify-between">
       {/* LOGO */}
        <NavLink to="/" className="flex items-center gap-3 group">
          <Logo size={40} />
          <span className="font-extrabold text-slate-800 text-lg tracking-tight group-hover:text-blue-600 transition">
      
          </span>
        </NavLink>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `transition duration-150 ${
                  isActive
                    ? "text-blue-600 font-bold border-b-2 border-blue-600 pb-1"
                    : "hover:text-blue-600"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}

          {user ? (
            <NavLink
              to="/dashboard"
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold shadow-sm hover:shadow-md transition hover:-translate-y-0.5"
            >
              <FaUser />
              Espace Client
            </NavLink>
          ) : (
            <NavLink
              to="/login"
              className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-sm hover:shadow transition"
            >
              Connexion
            </NavLink>
          )}
        </div>

        {/* MOBILE TOGGLE */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none"
        >
          {mobileMenuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
        </button>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3 shadow-lg">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `block py-2 text-base font-semibold ${
                  isActive ? "text-blue-600 font-bold" : "text-slate-700"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
          <div className="pt-2 border-t border-slate-100">
            {user ? (
              <NavLink
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center py-2.5 bg-blue-600 text-white font-bold rounded-xl shadow"
              >
                Mon Espace (Dashboard)
              </NavLink>
            ) : (
              <NavLink
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center py-2.5 bg-blue-600 text-white font-bold rounded-xl shadow"
              >
                Connexion
              </NavLink>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}