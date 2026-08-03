import { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

import {
  FaHeart,
  FaSearch,
  FaHome,
  FaSignOutAlt,
  FaSignInAlt,
  FaUserPlus,
  FaLaptop,
  FaBars,
  FaTimes,
  FaUserShield
} from "react-icons/fa";

import logo from "../../assets/logo-mktechbail.png";


function Navbar() {

  const { user, logout } = useContext(AuthContext);

  const navigate = useNavigate();

  const [mobileMenuOpen,setMobileMenuOpen] = useState(false);



  const handleLogout = () => {

    logout();

    setMobileMenuOpen(false);

    navigate("/login");

  };



  const closeMenu = () => {
    setMobileMenuOpen(false);
  };



return (

<nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b shadow-sm">


<div className="container mx-auto px-6 h-16 flex items-center justify-between">


{/* LOGO */}

<Link to="/" className="flex items-center gap-3">

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
Gestion Immobilière Intelligente
</p>


</div>


</Link>




{/* MENU DESKTOP */}


<div className="hidden md:flex items-center gap-5">


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



{
user && user.role !== "admin" && (

<NavLink
to="/favoris"
className="text-sm font-semibold text-slate-600 hover:text-blue-600"
>

<FaHeart className="inline mr-1 text-red-500"/>

Favoris

</NavLink>

)

}


</div>





{/* ACTION DESKTOP */}


<div className="hidden md:flex items-center gap-3">


{

user?.role === "admin" ? (


<div className="flex items-center gap-3">


<span className="text-red-600 font-bold text-sm flex items-center gap-1">

<FaUserShield/>

Administrateur

</span>



<button
onClick={handleLogout}
className="text-red-600 hover:bg-red-50 p-2 rounded-lg"
>

<FaSignOutAlt/>

</button>



</div>


)


:


user ? (


<div className="flex items-center gap-3">


<Link
to="/dashboard"
className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold"
>

<FaLaptop className="inline mr-1"/>

Espace Pro

</Link>



<span className="text-sm font-semibold">

Bonjour {user.nom}

</span>



<button
onClick={handleLogout}
className="text-red-600 p-2"
>

<FaSignOutAlt/>

</button>



</div>


)


:


(


<div className="flex gap-2">


<Link
to="/login"
className="px-4 py-2 bg-slate-100 rounded-xl text-sm"
>

<FaSignInAlt className="inline mr-1"/>

Connexion

</Link>



<Link
to="/register"
className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm"
>

<FaUserPlus className="inline mr-1"/>

Inscription

</Link>


</div>


)

}



</div>





{/* MOBILE BUTTON */}


<div className="md:hidden">


<button

onClick={()=>setMobileMenuOpen(!mobileMenuOpen)}

className="p-2 text-xl"

>


{
mobileMenuOpen
?
<FaTimes/>
:
<FaBars/>
}


</button>


</div>



</div>







{/* MOBILE MENU */}



{

mobileMenuOpen && (

<div className="md:hidden bg-white border-t px-6 py-5 space-y-4">



<NavLink
to="/"
onClick={closeMenu}
className="block font-semibold"
>

<FaHome className="inline mr-2"/>

Accueil

</NavLink>



<NavLink
to="/recherche"
onClick={closeMenu}
className="block font-semibold"
>

<FaSearch className="inline mr-2"/>

Recherche

</NavLink>



{

user && user.role !== "admin" && (

<NavLink
to="/favoris"
onClick={closeMenu}
className="block font-semibold"
>

<FaHeart className="inline mr-2 text-red-500"/>

Favoris

</NavLink>

)

}




<hr/>




{

user?.role === "admin" ? (


<div className="text-center space-y-3">


<p className="text-red-600 font-bold">

🔐 Administrateur

</p>



<button

onClick={handleLogout}

className="w-full bg-red-50 text-red-600 py-2 rounded-xl font-bold"

>

<FaSignOutAlt className="inline mr-2"/>

Déconnexion

</button>



</div>


)


:


user ? (


<div className="space-y-3">


<Link
to="/dashboard"
onClick={closeMenu}
className="block bg-blue-600 text-white text-center py-2 rounded-xl"
>

<FaLaptop className="inline mr-2"/>

Espace Pro

</Link>



<button

onClick={handleLogout}

className="w-full bg-red-50 text-red-600 py-2 rounded-xl"

>

Déconnexion

</button>


</div>


)


:


<div className="flex gap-2">


<Link
to="/login"
className="flex-1 bg-slate-100 text-center py-2 rounded-xl"
>

Connexion

</Link>



<Link
to="/register"
className="flex-1 bg-blue-600 text-white text-center py-2 rounded-xl"
>

Inscription

</Link>


</div>


}



</div>

)

}



</nav>


);


}


export default Navbar;