import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import logo from "../../assets/logo-mktechbail.png";

import {
  FaHome,
  FaUsers,
  FaUserTie,
  FaFileContract,
  FaMoneyBillWave,
  FaFileInvoice,
  FaCalendarAlt,
  FaBuilding,
  FaUserShield
} from "react-icons/fa";

function Sidebar({ isOpen, onClose }) {
  const { user } = useContext(AuthContext);

  const menu = [
    {
      name: "Dashboard",
      icon: <FaHome />,
      path: "/dashboard",
      roles: ["admin", "agent", "bailleur", "locataire"]
    },
    {
      name: "Utilisateurs",
      icon: <FaUserShield />,
      path: "/utilisateurs",
      roles: ["admin"]
    },
    {
      name: "Biens",
      icon: <FaBuilding />,
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

  const filteredMenu = menu.filter(item =>
    item.roles.includes(user?.role)
  );

  return (
    <aside
      className={`
      fixed top-0 left-0
      h-screen w-64
      z-50
      bg-gradient-to-b from-slate-900 via-indigo-950 to-blue-950
      text-white
      p-5
      shadow-xl
      transition-transform
      duration-300

      ${
        isOpen
        ? "translate-x-0"
        : "-translate-x-full md:translate-x-0"
      }
      `}
    >
      {/* LOGO */}
      <div className="flex flex-col items-center mb-8">
        <img
          src={logo}
          alt="MKTech Bail"
          className="h-20 object-contain"
        />
        <h1 className="font-bold text-lg mt-3">
          Gestion-Bail
        </h1>
        <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold mt-0.5">
          {user?.role}
        </span>
      </div>

      {/* MENU */}
      <nav className="space-y-1.5 overflow-y-auto max-h-[calc(100vh-180px)] pr-1">
        {filteredMenu.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            onClick={onClose}
            className={({ isActive }) =>
              `
              flex items-center gap-3
              p-3 rounded-xl
              font-semibold text-sm
              transition

              ${
                isActive
                ? "bg-white text-blue-900 shadow"
                : "text-slate-300 hover:bg-white/10 hover:text-white"
              }
              `
            }
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;