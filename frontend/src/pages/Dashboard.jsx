import { useEffect, useState, useContext } from "react";
import Layout from "../components/layout/Layout";
import StatCard from "../components/dashboard/StatCard";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

import {
  FaHome,
  FaUsers,
  FaFileContract,
  FaMoneyBillWave,
  FaHistory,
  FaCalendarTimes,
  FaExclamationTriangle
} from "react-icons/fa";

function Dashboard() {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    biens: 0,
    locataires: 0,
    contrats: 0,
    contratsActifs: 0,
    contratsExpires: 0,
    paiementsEnRetard: 0,
    revenusMensuels: 0,
    revenusAnnuels: 0,
    revenus: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/dashboard");
        console.log("Dashboard API :", response.data);

        setStats({
          biens: response.data.biens || 0,
          locataires: response.data.locataires || 0,
          contrats: response.data.contrats || 0,
          contratsActifs: response.data.contratsActifs || 0,
          contratsExpires: response.data.contratsExpires || 0,
          paiementsEnRetard: response.data.paiementsEnRetard || 0,
          revenusMensuels: response.data.revenusMensuels || 0,
          revenusAnnuels: response.data.revenusAnnuels || 0,
          revenus: response.data.revenus || 0
        });
      } catch (error) {
        console.error("Erreur lors de la récupération des stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const isLocataire = user?.role === "locataire";
  const isBailleur = user?.role === "bailleur";

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
          Tableau de bord
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-1">
          {isLocataire 
            ? "Aperçu en temps réel de vos locations, factures et paiements" 
            : isBailleur 
            ? "Aperçu en temps réel de vos investissements immobiliers et locataires" 
            : "Aperçu en temps réel de votre parc immobilier"}
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLocataire ? (
              <>
                <StatCard
                  title="Mes Contrats"
                  value={stats.contrats}
                  icon={<FaFileContract className="text-blue-600" />}
                />
                <StatCard
                  title="Contrats Actifs"
                  value={stats.contratsActifs}
                  icon={<FaFileContract className="text-emerald-500" />}
                />
                <StatCard
                  title="Contrats Expirés"
                  value={stats.contratsExpires}
                  icon={<FaCalendarTimes className="text-amber-500" />}
                />
                <StatCard
                  title="Loyers en Retard"
                  value={stats.paiementsEnRetard}
                  icon={<FaHistory className="text-red-500 animate-pulse" />}
                />
              </>
            ) : (
              <>
                <StatCard
                  title="Biens Publiés"
                  value={stats.biens}
                  icon={<FaHome className="text-blue-600" />}
                />
                <StatCard
                  title="Locataires"
                  value={stats.locataires}
                  icon={<FaUsers className="text-indigo-600" />}
                />
                <StatCard
                  title="Contrats Actifs"
                  value={stats.contratsActifs}
                  icon={<FaFileContract className="text-emerald-500" />}
                />
                <StatCard
                  title="Revenus Mensuels"
                  value={`${Number(stats.revenusMensuels || 0).toLocaleString("fr-FR")} $`}
                  icon={<FaMoneyBillWave className="text-emerald-600" />}
                />
              </>
            )}
          </div>

          {/* Alerts Panel */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
              <FaHistory className="text-blue-600 text-base" />
              Alertes & Suivi d'activité
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Alert Contrats */}
              <div className={`p-4 rounded-xl border flex items-center gap-3.5 ${
                stats.contratsExpires > 0 
                  ? "bg-amber-50 border-amber-200/60 text-amber-800" 
                  : "bg-slate-50 border-slate-100 text-slate-600"
              }`}>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${
                  stats.contratsExpires > 0 ? "bg-amber-100" : "bg-slate-100"
                }`}>
                  <FaCalendarTimes />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Contrats expirés</p>
                  <p className="text-base font-extrabold mt-0.5">
                    {stats.contratsExpires} {stats.contratsExpires > 1 ? "contrats" : "contrat"}
                  </p>
                </div>
              </div>

              {/* Alert Paiements */}
              <div className={`p-4 rounded-xl border flex items-center gap-3.5 ${
                stats.paiementsEnRetard > 0 
                  ? "bg-red-50 border-red-200/60 text-red-800" 
                  : "bg-slate-50 border-slate-100 text-slate-600"
              }`}>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${
                  stats.paiementsEnRetard > 0 ? "bg-red-100 animate-pulse" : "bg-slate-100"
                }`}>
                  <FaExclamationTriangle />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Loyers en retard</p>
                  <p className="text-base font-extrabold mt-0.5">
                    {stats.paiementsEnRetard} {stats.paiementsEnRetard > 1 ? "factures impayées" : "facture impayée"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default Dashboard;