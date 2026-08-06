import { useEffect, useState, useContext, useCallback } from "react";
import api from "../api/axios";
import Layout from "../components/layout/Layout";
import { AuthContext } from "../context/AuthContext";
import {
  FaCalendarAlt,
  FaCheck,
  FaTimes,
  FaEnvelope,
  FaHome,
  FaUser,
  FaBan,
  FaCheckCircle,
  FaExclamationTriangle
} from "react-icons/fa";

function Visites() {
  const { user } = useContext(AuthContext);
  const [visites, setVisites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "" });

  const chargerVisites = useCallback(async () => {
    try {
      const res = await api.get("/visites");
      setVisites(res.data || []);
    } catch (error) {
      console.error("Erreur chargement visites:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    chargerVisites();
  }, [chargerVisites]);

  const changerStatut = async (id, statut) => {
    setMessage({ text: "", type: "" });
    try {
      await api.put(`/visites/${id}`, { statut });
      setMessage({ text: `Statut de la visite mis à jour : ${statut}`, type: "success" });
      chargerVisites();
    } catch (error) {
      console.error("Erreur modification statut visite:", error);
      setMessage({
        text: error.response?.data?.message || "Erreur lors du changement de statut.",
        type: "error"
      });
    }
  };

  const getStatusBadgeClass = (statut) => {
    switch (statut) {
      case "Acceptée":
        return "bg-emerald-50 text-emerald-700 border border-emerald-200";
      case "Refusée":
        return "bg-red-50 text-red-700 border border-red-200";
      case "Annulée":
        return "bg-slate-100 text-slate-600 border border-slate-200";
      case "En attente":
      default:
        return "bg-amber-50 text-amber-700 border border-amber-200";
    }
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
          <FaCalendarAlt className="text-blue-600" /> Demandes & Plannings de Visites
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-1">
          {user?.role === "locataire"
            ? "Suivez le statut de vos demandes de visite de logements"
            : "Gérez les plannings et réponses aux demandes de visite"}
        </p>
      </div>

      {message.text && (
        <div
          className={`mb-6 p-4 rounded-2xl border flex items-center justify-between text-sm font-semibold transition ${
            message.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          <div className="flex items-center gap-3">
            {message.type === "success" ? (
              <FaCheckCircle className="text-emerald-600 text-lg" />
            ) : (
              <FaExclamationTriangle className="text-red-600 text-lg" />
            )}
            <span>{message.text}</span>
          </div>
          <button
            onClick={() => setMessage({ text: "", type: "" })}
            className="text-slate-400 hover:text-slate-600 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : visites.length === 0 ? (
        <div className="bg-white border border-slate-100 p-12 rounded-3xl text-center text-slate-500 shadow-xs">
          <FaCalendarAlt className="text-4xl text-slate-300 mx-auto mb-2" />
          <p className="font-semibold text-slate-700">Aucune demande de visite enregistrée</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {visites.map((visite) => {
            const isPending = visite.statut === "En attente";
            const canManage = user?.role === "bailleur" || user?.role === "admin" || user?.role === "agent";
            const visitClientId = visite.client?._id || visite.client;
            const isClient = user?.id === visitClientId;

            return (
              <div
                key={visite._id}
                className="bg-white rounded-3xl shadow-xs border border-slate-100 p-6 hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-4 gap-2">
                    <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
                      <FaHome className="text-blue-600 shrink-0" />
                      {visite.bien?.titre || "Bien immobilier"}
                    </h2>
                    <span className={`px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider rounded-full shrink-0 ${getStatusBadgeClass(visite.statut)}`}>
                      {visite.statut}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs text-slate-600 font-medium">
                    <p className="flex items-center gap-2">
                      <FaUser className="text-slate-400 w-4 shrink-0" />
                      <span><strong>Client :</strong> {visite.client?.nom || "Inconnu"}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <FaEnvelope className="text-slate-400 w-4 shrink-0" />
                      <span><strong>Email :</strong> {visite.client?.email || "N/A"}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <FaCalendarAlt className="text-slate-400 w-4 shrink-0" />
                      <span><strong>Date souhaitée :</strong> {new Date(visite.dateVisite).toLocaleDateString("fr-FR")}</span>
                    </p>
                    {visite.message && (
                      <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 mt-3">
                        <strong className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Message du demandeur</strong>
                        <p className="text-slate-700 text-xs whitespace-pre-line leading-relaxed">{visite.message}</p>
                      </div>
                    )}
                  </div>
                </div>

                {isPending && (
                  <div className="flex gap-3 mt-6 pt-4 border-t border-slate-100">
                    {canManage && (
                      <>
                        <button
                          onClick={() => changerStatut(visite._id, "Acceptée")}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-2xl flex items-center justify-center gap-1.5 transition text-xs cursor-pointer shadow-xs"
                        >
                          <FaCheck size={12} /> Accepter
                        </button>
                        <button
                          onClick={() => changerStatut(visite._id, "Refusée")}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2.5 rounded-2xl flex items-center justify-center gap-1.5 transition text-xs cursor-pointer shadow-xs"
                        >
                          <FaTimes size={12} /> Refuser
                        </button>
                      </>
                    )}
                    {!canManage && isClient && (
                      <button
                        onClick={() => changerStatut(visite._id, "Annulée")}
                        className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2.5 rounded-2xl flex items-center justify-center gap-1.5 transition text-xs cursor-pointer"
                      >
                        <FaBan size={12} /> Annuler la demande
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Layout>
  );
}

export default Visites;