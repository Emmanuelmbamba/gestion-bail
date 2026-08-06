import { useEffect, useState, useContext } from "react";
import Layout from "../components/layout/Layout";
import StatCard from "../components/dashboard/StatCard";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import {
  FaHome,
  FaUsers,
  FaFileContract,
  FaMoneyBillWave,
  FaHistory,
  FaCalendarTimes,
  FaExclamationTriangle,
  FaPlus,
  FaArrowRight,
  FaFolderOpen
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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100/60">
            Tableau de Bord Général
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
            Bonjour, {user?.nom || "Utilisateur"} 👋
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            {isLocataire 
              ? "Aperçu de vos baux locatifs, échéances et reçus de paiement." 
              : isBailleur 
              ? "Aperçu en temps réel de votre patrimoine immobilier et de vos revenus." 
              : "Consolidation complète du parc immobilier et des opérations."}
          </p>
        </div>

        {!isLocataire && (
          <div className="flex flex-wrap gap-3">
            <Link
              to="/biens"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl text-xs font-bold shadow-sm hover:shadow-md transition"
            >
              <FaPlus /> Nouveau bien
            </Link>
            <Link
              to="/contrats"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-2xl text-xs font-bold shadow-xs hover:bg-slate-50 transition"
            >
              <FaFileContract className="text-blue-600" /> Rédiger un bail
            </Link>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
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
                  title="Paiements en Retard"
                  value={stats.paiementsEnRetard}
                  icon={<FaHistory className="text-red-500" />}
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
                  title="Locataires Inscrits"
                  value={stats.locataires}
                  icon={<FaUsers className="text-indigo-600" />}
                />
                <StatCard
                  title="Baux Actifs"
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

          {/* Alerts & Monitoring Section */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8">
            <h2 className="text-lg font-extrabold text-slate-900 mb-6 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <FaHistory className="text-blue-600" /> Suivi des Échéances et Alertes
              </span>
              <span className="text-xs text-slate-400 font-semibold">Temps réel</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Alert Contrats */}
              <div className={`p-6 rounded-3xl border flex items-center justify-between gap-4 transition ${
                stats.contratsExpires > 0 
                  ? "bg-amber-50/60 border-amber-200/80 text-amber-900" 
                  : "bg-slate-50/60 border-slate-100 text-slate-700"
              }`}>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0 ${
                    stats.contratsExpires > 0 ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-400"
                  }`}>
                    <FaCalendarTimes />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Contrats de bail expirés</p>
                    <p className="text-xl font-extrabold mt-0.5">
                      {stats.contratsExpires} {stats.contratsExpires > 1 ? "contrats à renouveler" : "contrat à renouveler"}
                    </p>
                  </div>
                </div>
                <Link to="/contrats" className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                  Voir <FaArrowRight className="text-[10px]" />
                </Link>
              </div>

              {/* Alert Paiements */}
              <div className={`p-6 rounded-3xl border flex items-center justify-between gap-4 transition ${
                stats.paiementsEnRetard > 0 
                  ? "bg-red-50/60 border-red-200/80 text-red-900" 
                  : "bg-slate-50/60 border-slate-100 text-slate-700"
              }`}>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0 ${
                    stats.paiementsEnRetard > 0 ? "bg-red-100 text-red-600 animate-pulse" : "bg-slate-100 text-slate-400"
                  }`}>
                    <FaExclamationTriangle />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Loyers en retard</p>
                    <p className="text-xl font-extrabold mt-0.5">
                      {stats.paiementsEnRetard} {stats.paiementsEnRetard > 1 ? "factures en souffrance" : "facture en souffrance"}
                    </p>
                  </div>
                </div>
                <Link to="/paiements" className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                  Gérer <FaArrowRight className="text-[10px]" />
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Access Modules */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Link
              to="/categories"
              className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs hover:shadow-md transition flex items-center gap-4 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl group-hover:bg-blue-600 group-hover:text-white transition">
                <FaFolderOpen />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">Catégories de Biens</h3>
                <p className="text-xs text-slate-500 mt-0.5">Explorer les types de biens</p>
              </div>
            </Link>

            <Link
              to="/visites"
              className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs hover:shadow-md transition flex items-center gap-4 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl group-hover:bg-indigo-600 group-hover:text-white transition">
                <FaHistory />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">Demandes de Visite</h3>
                <p className="text-xs text-slate-500 mt-0.5">Planifier & confirmer</p>
              </div>
            </Link>

            <Link
              to="/factures"
              className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs hover:shadow-md transition flex items-center gap-4 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl group-hover:bg-emerald-600 group-hover:text-white transition">
                <FaMoneyBillWave />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">Factures & Quittances</h3>
                <p className="text-xs text-slate-500 mt-0.5">Télécharger les reçus PDF</p>
              </div>
            </Link>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default Dashboard;