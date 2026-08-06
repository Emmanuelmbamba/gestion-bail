import { NavLink } from "react-router-dom";
import Logo from "../common/Logo";

export default function Navbar() {

  return (

    <nav className="bg-white shadow-sm sticky top-0 z-40">

      <div className="container mx-auto px-6 max-w-6xl h-16 flex items-center justify-between">


        {/* LOGO */}

        <NavLink to="/" className="flex items-center gap-2">

          <Logo size={45}/>

          <span className="font-bold text-slate-800">
            Gestion-Bail
          </span>

        </NavLink>





        {/* MENU */}

        <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">


          <NavLink
            to="/"
            className={({isActive}) =>
              isActive
              ? "text-blue-600"
              : "hover:text-blue-600"
            }
          >
            Accueil
          </NavLink>



          <NavLink
            to="/recherche"
            className={({isActive}) =>
              isActive
              ? "text-blue-600"
              : "hover:text-blue-600"
            }
          >
            Recherche
          </NavLink>




          <NavLink
            to="/help"
            className={({isActive}) =>
              isActive
              ? "text-blue-600"
              : "hover:text-blue-600"
            }
          >
            Aide
          </NavLink>





          <NavLink
            to="/contact"
            className={({isActive}) =>
              isActive
              ? "text-blue-600"
              : "hover:text-blue-600"
            }
          >
            Contact
          </NavLink>




          <NavLink
            to="/login"
            className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
          >
            Connexion
          </NavLink>

<NavLink 
to="/categories"
className="hover:text-blue-600"
>
Catégories
</NavLink>

        </div>


      </div>

    </nav>

  );

}