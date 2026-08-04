import { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

import {
  FaHome,
  FaSearch,
  FaHeart,
  FaLaptop,
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaSignInAlt,
  FaUserPlus,
  FaUserShield,
  FaBuilding,
  FaUsers,
  FaFileContract,
  FaMoneyBillWave,
  FaFileInvoice,
  FaCalendarCheck,
  FaBell,
  FaTrash,
  FaGlobe
} from "react-icons/fa";

import logo from "../../assets/logo-mktechbail.png";


export default function Navbar() {

  const { user, logout } = useContext(AuthContext);

  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);


  const handleLogout = () => {

    logout();

    setMobileMenuOpen(false);

    navigate("/login");

  };


  const closeMenu = () => {

    setMobileMenuOpen(false);

  };


  return (

    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">


      <div className="container mx-auto px-6 h-16 flex items-center justify-between">


        {/* LOGO */}

        <Link 
          to="/"
          className="flex items-center gap-3"
        >

          <img
            src={logo}
            alt="MKTech Bail"
            className="h-12 w-12 object-contain"
          />


          <div>

            <h1 className="text-xl font-extrabold text-blue-700">
              MKTech Bail
            </h1>

            <p className="text-xs text-slate-500">
              Gestion de bail
            </p>

          </div>


        </Link>



        {/* MENU DESKTOP */}


        <div className="hidden md:flex items-center gap-6">


          <NavLink
            to="/"
            className="text-sm font-semibold text-slate-600 hover:text-blue-600"
          >

            <FaHome className="inline mr-1"/>

            Accueil

          </NavLink>



          <NavLink
            to="/recherche"
            className="text-sm font-semibold text-slate-600 hover:text-blue-600"
          >

            <FaSearch className="inline mr-1"/>

            Recherche

          </NavLink>



          {user && user.role !== "admin" && (

            <NavLink
              to="/favoris"
              className="text-sm font-semibold text-slate-600 hover:text-blue-600"
            >

              <FaHeart className="inline mr-1 text-red-500"/>

              Favoris

            </NavLink>

          )}


        </div>
                  {/* ACTIONS DESKTOP */}

        <div className="hidden md:flex items-center gap-3">


          {user?.role === "admin" ? (

            <div className="flex items-center gap-3">


              <span className="flex items-center gap-2 text-red-600 font-bold text-sm">

                <FaUserShield />

                Administrateur

              </span>


              <Link
                to="/dashboard"
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-sm font-bold"
              >

                Dashboard

              </Link>


              <button
                onClick={handleLogout}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
              >

                <FaSignOutAlt />

              </button>


            </div>



          ) : user ? (


            <div className="flex items-center gap-3">


              <Link
                to="/dashboard"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold"
              >

                <FaLaptop />

                Espace Pro

              </Link>



              <span className="text-sm font-semibold text-slate-700">

                Bonjour {user.nom}

              </span>



              <button
                onClick={handleLogout}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
              >

                <FaSignOutAlt />

              </button>


            </div>



          ) : (


            <div className="flex items-center gap-2">


              <Link
                to="/login"
                className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-xl text-sm font-semibold"
              >

                <FaSignInAlt />

                Connexion

              </Link>



              <Link
                to="/register"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold"
              >

                <FaUserPlus />

                Inscription

              </Link>


            </div>


          )}


        </div>



        {/* BOUTON MOBILE */}


        <div className="md:hidden">


          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-xl text-slate-700"
          >

            {mobileMenuOpen ? <FaTimes /> : <FaBars />}

          </button>


        </div>


      </div>
            {/* MENU MOBILE */}

      {mobileMenuOpen && (

        <div className="md:hidden bg-white border-t border-slate-200 px-6 py-5 space-y-3 max-h-[calc(100vh-64px)] overflow-y-auto relative">


          <h2 className="text-center text-lg font-extrabold text-blue-700">
            MKTech Gestion-Bail
          </h2>


          <p className="text-center text-xs text-slate-500">
            Gestion de bail
          </p>


          <hr />


          {user ? (

            <>


              {/* DASHBOARD */}

              <Link
                to="/dashboard"
                onClick={closeMenu}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 font-semibold text-slate-700"
              >

                📊 Dashboard

              </Link>



              {/* VISITES */}

              <Link
                to="/visites"
                onClick={closeMenu}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 font-semibold text-slate-700"
              >

                <FaCalendarCheck />

                Visites

              </Link>



              {/* CONTRATS */}

              {(user.role === "admin" ||
                user.role === "bailleur" ||
                user.role === "locataire") && (

                <Link
                  to="/contrats"
                  onClick={closeMenu}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 font-semibold text-slate-700"
                >

                  <FaFileContract />

                  Contrats

                </Link>

              )}




              {/* PAIEMENTS */}

              {(user.role === "admin" ||
                user.role === "bailleur" ||
                user.role === "locataire") && (

                <Link
                  to="/paiements"
                  onClick={closeMenu}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 font-semibold text-slate-700"
                >

                  <FaMoneyBillWave />

                  Paiements

                </Link>

              )}




              {/* FACTURES */}

              {(user.role === "admin" ||
                user.role === "bailleur" ||
                user.role === "locataire") && (

                <Link
                  to="/factures"
                  onClick={closeMenu}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 font-semibold text-slate-700"
                >

                  <FaFileInvoice />

                  Factures

                </Link>

              )}





              {/* MENU ADMIN */}

              {user.role === "admin" && (

                <>


                  <hr />


                  <Link
                    to="/biens"
                    onClick={closeMenu}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 font-semibold"
                  >

                    <FaBuilding />

                    Biens

                  </Link>



                  <Link
                    to="/locataires"
                    onClick={closeMenu}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 font-semibold"
                  >

                    <FaUsers />

                    Locataires

                  </Link>




                  <Link
                    to="/bailleurs"
                    onClick={closeMenu}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 font-semibold"
                  >

                    🏢 Bailleurs

                  </Link>




                  <Link
                    to="/notifications"
                    onClick={closeMenu}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 font-semibold"
                  >

                    <FaBell />

                    Notifications

                  </Link>


                </>

              )}



              <hr />



            <hr />

{/* ZONE FIXE BAS DU MENU */}

<div className="sticky bottom-0 bg-white pt-3 space-y-3">


<button
  className="w-full flex items-center gap-3 p-3 rounded-xl text-red-600 hover:bg-red-50 font-semibold border"
>
  <FaTrash />
  Supprimer mon compte
</button>


<Link
  to="/"
  onClick={closeMenu}
  className="flex items-center gap-3 p-3 rounded-xl text-green-600 hover:bg-green-50 font-semibold border"
>
  <FaGlobe />
  Site Public
</Link>



<button
  onClick={handleLogout}
  className="w-full flex items-center gap-3 p-3 rounded-xl bg-red-50 text-red-600 font-bold"
>
  <FaSignOutAlt />
  Déconnexion
</button>


</div>


            </>



          ) : (


            <>


              <Link
                to="/"
                onClick={closeMenu}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-green-50 font-semibold"
              >

                🌐 Site Public

              </Link>



              <Link
                to="/login"
                onClick={closeMenu}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 font-semibold"
              >

                <FaSignInAlt />

                Connexion

              </Link>



              <Link
                to="/register"
                onClick={closeMenu}
                className="flex items-center gap-3 p-3 rounded-xl bg-blue-600 text-white font-semibold"
              >

                <FaUserPlus />

                Inscription

              </Link>


            </>

          )}


        </div>

      )}
          </nav>

  );

}	