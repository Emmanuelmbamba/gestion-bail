import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Home from "./pages/Home";

import PrivateRoute from "./routes/PrivateRoute";
import AdminRoute from "./components/auth/AdminRoute";


// Lazy loading
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Factures = lazy(() => import("./pages/Factures"));
const Paiements = lazy(() => import("./pages/Paiements"));
const Notifications = lazy(() => import("./pages/Notifications"));
const Biens = lazy(() => import("./pages/Biens"));
const Contrats = lazy(() => import("./pages/Contrats"));
const Locataires = lazy(() => import("./pages/Locataires"));
const Bailleurs = lazy(() => import("./pages/Bailleurs"));
const Recherche = lazy(() => import("./pages/Recherche"));
const DetailBien = lazy(() => import("./pages/DetailBien"));
const Favoris = lazy(() => import("./pages/Favoris"));
const Visites = lazy(() => import("./pages/Visites"));


function App() {

return (

<BrowserRouter>

<Suspense
fallback={
<div className="flex justify-center items-center h-screen">
Chargement...
</div>
}
>

<Routes>


{/* =====================
      ROUTES PUBLIQUES
===================== */}

<Route path="/" element={<Home />} />

<Route path="/login" element={<Login />} />

<Route path="/register" element={<Register />} />

<Route 
path="/forgot-password" 
element={<ForgotPassword />} 
/>

<Route 
path="/reset-password/:token" 
element={<ResetPassword />} 
/>

<Route 
path="/recherche" 
element={<Recherche />} 
/>

<Route 
path="/biens/:id" 
element={<DetailBien />} 
/>



{/* =====================
 ADMIN + BAILLEUR + LOCATAIRE
===================== */}

<Route
element={
<PrivateRoute
roles={[
"admin",
"bailleur",
"locataire"
]}
/>
}
>

<Route 
path="/dashboard" 
element={<Dashboard />} 
/>


<Route 
path="/contrats" 
element={<Contrats />} 
/>


<Route 
path="/paiements" 
element={<Paiements />} 
/>


<Route 
path="/factures" 
element={<Factures />} 
/>


<Route 
path="/favoris" 
element={<Favoris />} 
/>


<Route 
path="/visites" 
element={<Visites />} 
/>

</Route>



{/* =====================
 ADMIN + BAILLEUR
===================== */}

<Route
element={
<PrivateRoute
roles={[
"admin",
"bailleur"
]}
/>
}
>

<Route
path="/biens"
element={<Biens />}
/>

</Route>



{/* =====================
 ADMIN SEULEMENT
===================== */}

<Route
element={<AdminRoute />}
>

<Route
path="/locataires"
element={<Locataires />}
/>


<Route
path="/bailleurs"
element={<Bailleurs />}
/>


<Route
path="/notifications"
element={<Notifications />}
/>

</Route>



</Routes>

</Suspense>

</BrowserRouter>

);

}


export default App;