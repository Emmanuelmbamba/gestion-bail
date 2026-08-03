import { useEffect, useState, useContext } from "react";
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
  FaBan
} from "react-icons/fa";

function Visites() {
  const { user } = useContext(AuthContext);
  const [visites, setVisites] = useState([]);
  const [loading, setLoading] = useState(true);

  const chargerVisites = async () => {
    try {
      const res = await api.get("/visites");
      setVisites(res.data || []);
    } catch (error) {
      console.error("Erreur chargement visites:", error);
    } finally {
      setLoading(false);
    }
  };

 useEffect(() => {
  let ignore = false;

  async function loadVisites() {
    try {
      const res = await api.get("/visites");

      if (!ignore) {
        const data = res.data.visites || res.data;
        setVisites(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      if (!ignore) {
        setLoading(false);
      }
    }
  }

  loadVisites();

  return () => {
    ignore = true;
  };
}, []);
  const changerStatut = async (id, statut) => {
    try {
      await api.put(`/visites/${id}`, { statut });
      chargerVisites();
    } catch (error) {
      console.error("Erreur modification statut visite:", error);
      alert(error.response?.data?.message || "Une erreur est survenue.");
    }
  };

  const getStatusBadgeClass = (statut) => {
    switch (statut) {
      case "Acceptée":
        return "bg-green-50 text-green-700 border border-green-200";
      case "Refusée":
        return "bg-red-50 text-red-700 border border-red-200";
      case "Annulée":
        return "bg-slate-100 text-slate-600 border border-slate-200";
      case "En attente":
      default:
        return "bg-yellow-50 text-yellow-700 border border-yellow-200";
    }
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Demandes de visite 📅</h1>
        <p className="text-slate-500 text-sm mt-1">
          {user?.role === "locataire" 
            ? "Suivez le statut de vos demandes de visite immobilière" 
            : "Gérez les demandes de visite reçues pour vos biens immobiliers"}
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : visites.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-6 rounded-2xl">
          Aucune demande de visite enregistrée.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {visites.map((visite) => {
            const isPending = visite.statut === "En attente";
            const canManage = user?.role === "bailleur" || user?.role === "admin" || user?.role === "agent";
            
            // Check client ownership correctly depending on populated or non-populated client
            const visitClientId = visite.client?._id || visite.client;
            const isClient = user?.id === visitClientId;

            return (
              <div
                key={visite._id}
                className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-4 gap-2">
                    <h2 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                      <FaHome className="text-blue-600 shrink-0" />
                      {visite.bien?.titre || "Bien immobilier"}
                    </h2>
                    <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full shrink-0 ${getStatusBadgeClass(visite.statut)}`}>
                      {visite.statut}
                    </span>
                  </div>

                  <div className="space-y-2.5 text-sm text-slate-600">
                    <p className="flex items-center gap-2.5">
                      <FaUser className="text-slate-400 w-4 shrink-0" />
                      <span>
                        <strong>Client :</strong> {visite.client?.nom || "Inconnu"}
                      </span>
                    </p>
                    <p className="flex items-center gap-2.5">
                      <FaEnvelope className="text-slate-400 w-4 shrink-0" />
                      <span>
                        <strong>Email :</strong> {visite.client?.email || "N/A"}
                      </span>
                    </p>
                    <p className="flex items-center gap-2.5">
                      <FaCalendarAlt className="text-slate-400 w-4 shrink-0" />
                      <span>
                        <strong>Date :</strong> {new Date(visite.dateVisite).toLocaleDateString()}
                      </span>
                    </p>
                    {visite.message && (
                      <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 mt-2">
                        <strong className="text-xs text-slate-400 uppercase tracking-wider block mb-1">Message</strong>
                        <p className="text-slate-700 text-sm whitespace-pre-line leading-relaxed">{visite.message}</p>
                      </div>
                    )}
                  </div>
                </div>

                {isPending && (
                  <div className="flex gap-3 mt-6 pt-4 border-t border-slate-50">
                    {canManage && (
                      <>
                        <button
                          onClick={() => changerStatut(visite._id, "Acceptée")}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 transition duration-150 text-sm cursor-pointer shadow-sm shadow-green-500/10"
                        >
                          <FaCheck size={12} />
                          Accepter
                        </button>
                        <button
                          onClick={() => changerStatut(visite._id, "Refusée")}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 transition duration-150 text-sm cursor-pointer shadow-sm shadow-red-500/10"
                        >
                          <FaTimes size={12} />
                          Refuser
                        </button>
                      </>
                    )}
                    {!canManage && isClient && (
                      <button
                        onClick={() => changerStatut(visite._id, "Annulée")}
                        className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 transition duration-150 text-sm cursor-pointer"
                      >
                        <FaBan size={12} />
                        Annuler la demande
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