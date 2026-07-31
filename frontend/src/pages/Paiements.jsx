import { useEffect, useState, useCallback } from "react";
import Layout from "../components/layout/Layout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { getPaiements, createPaiement } from "../services/paiementService";
import { getContrats } from "../services/contratService";
import { FaPlus, FaUser, FaHome, FaCalendarAlt, FaCreditCard, FaCheckCircle, FaExclamationTriangle, FaTimesCircle } from "react-icons/fa";

function Paiements() {
  const [paiements, setPaiements] = useState([]);
  const [contrats, setContrats] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    contrat: "",
    montant: "",
    mois: "",
    modePaiement: "cash",
    typePaiement: "loyer",
    statut: "payé"
  });

  const loadData = useCallback(async () => {
    try {
      const paiementsData = await getPaiements();
      setPaiements(Array.isArray(paiementsData) ? paiementsData : []);

      const contratsData = await getContrats();
      setContrats(Array.isArray(contratsData) ? contratsData : []);
    } catch (error) {
      console.error("Erreur chargement données:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    Promise.resolve().then(() => {
      loadData();
    });
  }, [loadData]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleContratSelect = (e) => {
    const contratId = e.target.value;
    const contrat = contrats.find((c) => c._id === contratId);
    setForm({
      ...form,
      contrat: contratId,
      montant: contrat ? (contrat.montantLoyer || contrat.loyer || 0) : ""
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createPaiement(form);
      setForm({
        contrat: "",
        montant: "",
        mois: "",
        modePaiement: "cash",
        typePaiement: "loyer",
        statut: "payé"
      });
      await loadData();
      alert("Paiement enregistré avec succès !");
    } catch (error) {
      console.error("Erreur création paiement:", error);
      alert(error.response?.data?.message || "Erreur lors de l'enregistrement");
    }
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
          Suivi des Paiements 💰
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-1">
          Enregistrez les loyers perçus, gérez les pénalités ou cautions, et suivez l'historique
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulaire d'enregistrement */}
        <div className="lg:col-span-1">
          <Card title="Enregistrer un paiement" className="shadow-sm border border-slate-100">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Contrat de bail
                </label>
                <select
                  name="contrat"
                  value={form.contrat}
                  onChange={handleContratSelect}
                  required
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-sm font-medium"
                >
                  <option value="">-- Choisir un contrat --</option>
                  {contrats.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.bien?.titre || "Bien"} - {c.locataire?.nom || "Locataire"} ({c.montantLoyer || 0} $)
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label="Montant réglé ($)"
                name="montant"
                type="number"
                value={form.montant}
                onChange={handleChange}
                required
                placeholder="Montant du paiement"
              />

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Mois / Période
                </label>
                <select
                  name="mois"
                  value={form.mois}
                  onChange={handleChange}
                  required
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-sm font-medium"
                >
                  <option value="">-- Choisir le mois --</option>
                  <option value="Janvier 2026">Janvier 2026</option>
                  <option value="Février 2026">Février 2026</option>
                  <option value="Mars 2026">Mars 2026</option>
                  <option value="Avril 2026">Avril 2026</option>
                  <option value="Mai 2026">Mai 2026</option>
                  <option value="Juin 2026">Juin 2026</option>
                  <option value="Juillet 2026">Juillet 2026</option>
                  <option value="Août 2026">Août 2026</option>
                  <option value="Septembre 2026">Septembre 2026</option>
                  <option value="Octobre 2026">Octobre 2026</option>
                  <option value="Novembre 2026">Novembre 2026</option>
                  <option value="Décembre 2026">Décembre 2026</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Type
                  </label>
                  <select
                    name="typePaiement"
                    value={form.typePaiement}
                    onChange={handleChange}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-sm font-medium"
                  >
                    <option value="loyer">Loyer</option>
                    <option value="avance">Avance</option>
                    <option value="caution">Caution</option>
                    <option value="penalite">Pénalité</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Mode
                  </label>
                  <select
                    name="modePaiement"
                    value={form.modePaiement}
                    onChange={handleChange}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-sm font-medium"
                  >
                    <option value="cash">Cash</option>
                    <option value="mobile_money">Mobile Money</option>
                    <option value="virement">Virement</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Statut du paiement
                </label>
                <select
                  name="statut"
                  value={form.statut}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-sm font-medium"
                >
                  <option value="payé">Payé</option>
                  <option value="en_retard">En retard</option>
                  <option value="impayé">Impayé</option>
                </select>
              </div>

              <Button type="submit" className="w-full py-3 rounded-xl flex justify-center gap-2 mt-6">
                <FaPlus /> Confirmer paiement
              </Button>
            </form>
          </Card>
        </div>

        {/* Historique des paiements */}
        <div className="lg:col-span-2">
          <Card title="Historique des paiements" className="shadow-sm border border-slate-100">
            {loading ? (
              <div className="flex justify-center items-center h-48">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
              </div>
            ) : paiements.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                Aucun paiement enregistré pour le moment.
              </div>
            ) : (
              <>
                {/* Desktop View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 text-sm font-semibold">
                        <th className="py-3 px-4">Bien loué</th>
                        <th className="py-3 px-4">Locataire</th>
                        <th className="py-3 px-4">Type / Mois</th>
                        <th className="py-3 px-4">Montant / Mode</th>
                        <th className="py-3 px-4 text-center">Statut</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paiements.map((p) => {
                        const statusBadge = p.statut === "payé"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : p.statut === "en_retard"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-red-50 text-red-700 border-red-200";

                        const statusIcon = p.statut === "payé"
                          ? <FaCheckCircle className="text-xs" />
                          : p.statut === "en_retard"
                            ? <FaExclamationTriangle className="text-xs" />
                            : <FaTimesCircle className="text-xs" />;

                        return (
                          <tr key={p._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors duration-150 text-slate-700">
                            <td className="py-4 px-4 font-bold text-slate-800">
                              <span className="flex items-center gap-2">
                                <FaHome className="text-blue-500 text-base" />
                                {p.contrat?.bien?.titre || "Bien inconnu"}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <span className="flex items-center gap-1.5 text-sm font-semibold">
                                <FaUser className="text-slate-400 text-xs" />
                                {p.locataire?.nom || "Locataire inconnu"}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <p className="text-sm font-semibold text-slate-800 capitalize">{p.typePaiement || "loyer"}</p>
                              <p className="text-xs text-slate-400 flex items-center gap-1"><FaCalendarAlt className="text-[10px]" /> {p.mois}</p>
                            </td>
                            <td className="py-4 px-4">
                              <p className="text-base font-extrabold text-slate-800">{Number(p.montant || 0).toLocaleString("fr-FR")} $</p>
                              <p className="text-xs text-slate-400 flex items-center gap-1 capitalize"><FaCreditCard className="text-[10px]" /> {p.modePaiement?.replace("_", " ")}</p>
                            </td>
                            <td className="py-4 px-4 text-center">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border ${statusBadge}`}>
                                {statusIcon}
                                <span className="capitalize">{p.statut || "payé"}</span>
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile View */}
                <div className="md:hidden space-y-4">
                  {paiements.map((p) => {
                    const statusBadge = p.statut === "payé"
                      ? "bg-green-50 text-green-700 border-green-200"
                      : p.statut === "en_retard"
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : "bg-red-50 text-red-700 border-red-200";

                    const statusIcon = p.statut === "payé"
                      ? <FaCheckCircle className="text-xs" />
                      : p.statut === "en_retard"
                        ? <FaExclamationTriangle className="text-xs" />
                        : <FaTimesCircle className="text-xs" />;

                    return (
                      <div 
                        key={p._id}
                        className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-3 text-slate-700"
                      >
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <p className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
                              <FaHome className="text-blue-500" />
                              {p.contrat?.bien?.titre || "Bien inconnu"}
                            </p>
                            <p className="text-xs text-slate-400 flex items-center gap-1 mt-1 capitalize"><FaUser className="text-[10px]" /> {p.locataire?.nom || "Locataire inconnu"}</p>
                          </div>

                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full border ${statusBadge}`}>
                            {statusIcon}
                            <span className="capitalize">{p.statut || "payé"}</span>
                          </span>
                        </div>

                        <hr className="border-slate-100" />

                        <div className="flex justify-between items-center text-xs">
                          <div>
                            <p className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Période / Type</p>
                            <p className="font-semibold text-slate-700 capitalize mt-0.5">{p.typePaiement || "loyer"} ({p.mois})</p>
                          </div>

                          <div className="text-right">
                            <p className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Montant / Mode</p>
                            <p className="font-extrabold text-slate-800 mt-0.5">
                              {Number(p.montant || 0).toLocaleString("fr-FR")} $ ({p.modePaiement?.replace("_", " ")})
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </Card>
        </div>
      </div>
    </Layout>
  );
}

export default Paiements;