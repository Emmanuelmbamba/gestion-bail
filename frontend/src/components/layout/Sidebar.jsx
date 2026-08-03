import { useContext } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import {
  FaHome,
  FaUsers,
  FaUserTie,
  FaFileContract,
  FaMoneyBillWave,
  FaFileInvoice,
  FaSignOutAlt,
  FaGlobe,
  FaUserSlash,
  FaCalendarAlt,
  FaTimes
} from "react-icons/fa";
import api from "../../api/axios";

function Sidebar({ isOpen, onClose }) {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    onClose?.();
    navigate("/login");
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("ATTENTION ! Êtes-vous sûr de vouloir supprimer définitivement votre compte utilisateur ? Cette action est irréversible et supprimera également vos données associées.")) {
      try {
        const response = await api.delete("/auth/delete-account");
        alert(response.data.message || "Votre compte a été supprimé.");
        logout();
        onClose?.();
        navigate("/login");
      } catch (error) {
        console.error("Erreur de suppression du compte:", error);
        alert(error.response?.data?.message || "Erreur lors de la suppression de votre compte.");
      }
    }
  };

  const menu = [
    {
      name: "Dashboard",
      icon: <FaHome />,
      path: "/dashboard",
      roles: ["admin", "agent", "bailleur", "locataire"]
    },
    {
      name: "Biens",
      icon: <FaHome />,
      path: "/biens",
      roles: ["admin", "agent", "bailleur"]
    },
    {
      name: "Visites",
      icon: <FaCalendarAlt />,
      path: "/visites",
      roles: ["admin", "agent", "bailleur", "locataire"]
    },
    {
      name: "Bailleurs",
      icon: <FaUserTie />,
      path: "/bailleurs",
      roles: ["admin", "agent"]
    },
    {
      name: "Locataires",
      icon: <FaUsers />,
      path: "/locataires",
      roles: ["admin", "agent", "bailleur"]
    },
    {
      name: "Contrats",
      icon: <FaFileContract />,
      path: "/contrats",
      roles: ["admin", "agent", "bailleur", "locataire"]
    },
    {
      name: "Paiements",
      icon: <FaMoneyBillWave />,
      path: "/paiements",
      roles: ["admin", "agent", "bailleur", "locataire"]
    },
    {
      name: "Factures",
      icon: <FaFileInvoice />,
      path: "/factures",
      roles: ["admin", "agent", "bailleur", "locataire"]
    }
  ];

  const filteredMenu = menu.filter(item => item.roles.includes(user?.role || "locataire"));

  return (
    <aside 
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-slate-900 via-indigo-950 to-blue-950 text-white p-5 flex flex-col justify-between shadow-2xl md:shadow-xl transform md:relative md:translate-x-0 transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div>
        {/* Header containing Brand Logo and Mobile Close Button */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-xl font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200 flex items-center gap-2">
             Gestion-Bail
          </h1>
          <button 
            onClick={onClose}
            className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            title="Fermer le menu"
          >
            <FaTimes className="text-lg" />
          </button>
        </div>

        {/* Sidebar NavLinks */}
        <nav>
          {filteredMenu.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              onClick={() => onClose?.()}
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 rounded-xl mb-2 transition-all duration-150 font-semibold text-sm ${
                  isActive
                    ? "bg-white text-blue-900 shadow-md transform translate-x-1"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              {item.icon}
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Footer NavLinks and Actions */}
      <div className="space-y-2 mt-8">
        {user?.role === "locataire" && (
          <button
            onClick={handleDeleteAccount}
            className="flex items-center justify-center gap-3 w-full p-3 rounded-xl bg-red-500/10 hover:bg-red-500/30 text-red-200 hover:text-red-100 transition-all duration-150 font-semibold cursor-pointer border border-red-500/20 hover:border-red-500/40 shadow-sm text-xs"
          >
            <FaUserSlash />
            Supprimer mon compte
          </button>
        )}

        <NavLink
          to="/"
          onClick={() => onClose?.()}
          className="flex items-center gap-3 p-3 rounded-xl bg-blue-500/10 hover:bg-blue-500/35 text-blue-200 hover:text-white transition-all duration-150 font-semibold text-xs border border-blue-500/20"
        >
          <FaGlobe />
          Site Public
        </NavLink>

        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-3 w-full p-3 rounded-xl bg-red-500/20 hover:bg-red-600 text-red-100 hover:text-white transition-all duration-150 font-semibold cursor-pointer border border-red-500/30 hover:border-red-600 shadow-sm text-xs"
        >
          <FaSignOutAlt />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;