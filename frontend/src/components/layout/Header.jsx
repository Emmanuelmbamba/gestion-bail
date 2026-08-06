import {
  FaBell,
  FaUserCircle,
  FaBars,
  FaChevronDown,
  FaGlobe,
  FaSignOutAlt,
  FaUserSlash,
} from "react-icons/fa";

import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import api from "../../api/axios";


function Header({ onToggleSidebar }) {

  const { user, logout } = useContext(AuthContext);

  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] = useState(false);



  const handleLogout = () => {

    logout();

    navigate("/login");

  };



  const handleDeleteAccount = async () => {

    const confirmDelete = window.confirm(
      "Voulez-vous supprimer définitivement votre compte ?"
    );


    if (!confirmDelete) return;


    try {

      await api.delete("/auth/delete-account");

      logout();

      navigate("/login");


    } catch (error) {

      console.error(error);

      alert(
        error.response?.data?.message ||
        "Erreur lors de la suppression du compte"
      );

    }

  };



  return (

<header
className="
sticky top-0 z-50
h-16
flex items-center justify-between
bg-white
border-b border-slate-200
shadow-sm
px-4 sm:px-6
"
>


{/* GAUCHE */}

<div className="flex items-center gap-3">


<button
onClick={onToggleSidebar}
className="
md:hidden
p-2
rounded-lg
hover:bg-slate-100
text-slate-600
"
>

<FaBars />

</button>



<h2
className="
hidden sm:block
text-lg
font-bold
text-slate-800
"
>

Espace Gestion Locative

</h2>


</div>





{/* DROITE */}

<div className="flex items-center gap-3">



{/* SITE PUBLIC */}

<Link

to="/"

className="
p-2
rounded-lg
text-slate-600
hover:bg-blue-50
hover:text-blue-600
transition
"

title="Site Public"

>

<FaGlobe />

</Link>





{/* NOTIFICATIONS */}

<Link

to="/notifications"

className="
relative
p-2
rounded-lg
text-slate-600
hover:bg-blue-50
hover:text-blue-600
transition
"

title="Notifications"

>

<FaBell />


<span
className="
absolute
top-1
right-1
w-2
h-2
bg-red-500
rounded-full
"
/>


</Link>







{/* PROFIL */}

<div className="relative">


<button

onClick={() => setProfileOpen(!profileOpen)}

className="
flex
items-center
gap-2
p-2
rounded-lg
hover:bg-slate-100
"

>


<FaUserCircle

className="
text-3xl
text-slate-400
"

/>



<div className="hidden sm:block text-left">


<p
className="
text-sm
font-bold
text-slate-800
"
>

{user?.nom || "Utilisateur"}

</p>



<span
className="
text-xs
uppercase
font-bold
text-blue-600
"
>

{user?.role || "Visiteur"}

</span>


</div>




<FaChevronDown

className={`
text-xs
transition-transform
${profileOpen ? "rotate-180" : ""}
`}

/>


</button>







{/* MENU PROFIL */}

{

profileOpen && (

<div

className="
absolute
right-0
top-14
w-56
bg-white
border
border-slate-200
rounded-xl
shadow-xl
p-2
"

>


{/* SUPPRESSION COMPTE */}

{

user?.role === "locataire" && (

<button

onClick={handleDeleteAccount}

className="
w-full
flex
items-center
gap-3
p-3
rounded-lg
hover:bg-red-50
text-red-600
text-sm
"

>

<FaUserSlash />

Supprimer compte

</button>

)

}







{/* DECONNEXION */}

<button

onClick={handleLogout}

className="
w-full
flex
items-center
gap-3
p-3
rounded-lg
hover:bg-red-50
text-red-600
text-sm
"

>

<FaSignOutAlt />

Déconnexion


</button>




</div>

)

}


</div>



</div>



</header>

  );

}


export default Header;