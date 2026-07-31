import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Factures from "./pages/Factures";
import Paiements from "./pages/Paiements";
import Notifications from "./pages/Notifications";
import Biens from "./pages/Biens";
import Contrats from "./pages/Contrats";
import Locataires from "./pages/Locataires";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Bailleurs from "./pages/Bailleurs";
import Home from "./pages/Home";
import Recherche from "./pages/Recherche";
import DetailBien from "./pages/DetailBien";
import Favoris from "./pages/Favoris";  
import Visites from "./pages/Visites";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/visites" element={<Visites />} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/biens" element={<Biens />} />
        <Route path="/contrats" element={<Contrats />} />
        <Route path="/locataires" element={<Locataires />} />
        <Route path="/bailleurs" element={<Bailleurs />} />
        <Route path="/factures" element={<Factures />} />
        <Route path="/paiements" element={<Paiements />} />
        <Route path="/notifications" element={<Notifications />} />

        <Route path="/recherche" element={<Recherche />} />
        <Route path="/biens/:id" element={<DetailBien />} />
        <Route path="/favoris" element={<Favoris />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;