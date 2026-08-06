import { useEffect, useState, useCallback, useContext } from "react";
import Layout from "../components/layout/Layout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { getPaiements, createPaiement, confirmerPaiement } from "../services/paiementService";
import { getContrats } from "../services/contratService";
import { AuthContext } from "../context/AuthContext";
import {
  FaPlus,
  FaUser,
  FaHome,
  FaCalendarAlt,
  FaCreditCard,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
  FaMoneyBillWave,
  FaHourglassHalf
} from "react-icons/fa";

function Paiements() {
  const { user } = useContext(AuthContext);
  const [paiements, setPaiements] = useState([]);
  const [contrats, setContrats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "" });

  const isLocataire = user?.role === "locataire";
  const isManagerRole = user?.role === "bailleur" || user?.role === "admin" || user?.role === "agent";

  const [form, setForm] = useState({
    contrat: "",
    montant: "",
    mois: "",
    modePaiement: "mobile_money",
    typePaiement: "loyer"
  });

  const loadData = useCallback(async () => {
    try {
      const paiementsData = await getPaiements();
      setPaiements(Array.isArray(paiementsData) ? paiementsData : []);

      if (isLocataire) {
        const contratsData = await getContrats();
        setContrats(Array.isArray(contratsData) ? contratsData : []);
      }
    } catch (error) {
      console.error("Erreur chargement données:", error);
    } finally {
      setLoading(false);
    }
  }, [isLocataire]);

  useEffect(() => {
    loadData();
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

    setForm((prev) => ({
      ...prev,
      contrat: contratId,
      montant: contrat ? contrat.montantLoyer || contrat.loyer || "" : ""
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    try {
      await createPaiement({
        contrat: form.contrat,
        montant: form.montant,
        mois: form.mois,
        modePaiement: form.modePaiement,
        typePaiement: form.typePaiement
      });

      setMessage({
        text: "Paiement transmis au propriétaire ! En attente de confirmation.",
        type: "success"
      });

      setForm({
        contrat: "",
        montant: "",
        mois: "",
        modePaiement: "mobile_money",
        typePaiement: "loyer"
      });

      await loadData();
    } catch (error) {
      console.error(error);
      setMessage({
        text: error.response?.data?.message || "Erreur lors de la déclaration du paiement",
        type: "error"
      });
    }
  };

  const handleConfirmer = async (id, locNom, montant) => {
    if (window.confirm(`Confirmer la réception du paiement de ${montant} $ de ${locNom || "ce locataire"} ?`)) {
      try {
        await confirmerPaiement(id);
        setMessage({
          text: `Paiement de ${montant} $ confirmé avec succès ! La quittance à été générée.`,
          type: "success"
        });
        await loadData();
      } catch (error) {
        console.error("Erreur confirmation:", error);
        setMessage({
          text: error.response?.data?.message || "Erreur lors de la confirmation du paiement",
          type: "error"
        });
      }
    }
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
          <FaMoneyBillWave className="text-emerald-600" /> Suivi des Réglements & Paiements
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-1">
          {isLocataire
            ? "Déclarez vos règlements de loyer et suivez leur statut de validation."
            : "Consultez, vérifiez et confirmez les règlements de loyer perçus."}
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulaire de paiement (Uniquement visible pour le LOCATAIRE) */}
        {isLocataire && (
          <div className="lg:col-span-1">
            <Card title="Déclarer un versement" className="shadow-sm border border-slate-100 rounded-3xl">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Contrat de bail
                  </label>
                  <select
                    name="contrat"
                    value={form.contrat}
                    onChange={handleContratSelect}
                    required
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-xs font-semibold"
                  >
                    <option value="">-- Sélectionner votre contrat --</option>
                    {contrats.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.bien?.titre || "Bien"} ({c.montantLoyer || 0} $)
                      </option>
                    ))}
                  </select>
                </div>

                <Input
                  label="Montant Versé ($)"
                  name="montant"
                  type="number"
                  value={form.montant}
                  onChange={handleChange}
                  required
                  placeholder="Ex: 500"
                />

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Mois / Période
                  </label>
                  <select
                    name="mois"
                    value={form.mois}
                    onChange={handleChange}
                    required
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-xs font-semibold"
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
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Type
                    </label>
                    <select
                      name="typePaiement"
                      value={form.typePaiement}
                      onChange={handleChange}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-xs font-semibold"
                    >
                      <option value="loyer">Loyer</option>
                      <option value="avance">Avance</option>
                      <option value="caution">Caution</option>
                      <option value="penalite">Pénalité</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Mode
                    </label>
                    <select
                      name="modePaiement"
                      value={form.modePaiement}
                      onChange={handleChange}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-xs font-semibold"
                    >
                      <option value="mobile_money">Mobile Money</option>
                      <option value="virement">Virement bancaire</option>
                      <option value="cash">Espèces (Cash)</option>
                    </select>
                  </div>
                </div>

                <Button type="submit" className="w-full py-3 rounded-2xl flex justify-center gap-2 mt-4 font-bold">
                  <FaPlus /> Soumettre le versement
                </Button>
              </form>
            </Card>
          </div>
        )}

        {/* Historique des paiements (Pleine largeur pour le Bailleur / Admin) */}
        <div className={isLocataire ? "lg:col-span-2" : "lg:col-span-3"}>
          <Card title="Répertoire des versements" className="shadow-sm border border-slate-100 rounded-3xl">
            {loading ? (
              <div className="flex justify-center items-center h-48">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
              </div>
            ) : paiements.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <FaMoneyBillWave className="text-4xl text-slate-300 mx-auto mb-2" />
                <p className="font-semibold text-slate-600">Aucun versement trouvé</p>
              </div>
            ) : (
              <>
                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 text-xs font-bold uppercase tracking-wider">
                        <th className="py-3 px-4">Bien</th>
                        <th className="py-3 px-4">Locataire</th>
                        <th className="py-3 px-4">Type / Mois</th>
                        <th className="py-3 px-4">Montant / Mode</th>
                        <th className="py-3 px-4 text-center">Statut</th>
                        {isManagerRole && <th className="py-3 px-4 text-center">Action</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {paiements.map((p) => {
                        const isPaye = p.statut === "payé" || p.statut === "paye";
                        const isEnAttente = p.statut === "en_attente" || p.statut === "en attente";

                        const statusBadge = isPaye
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : isEnAttente
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-red-50 text-red-700 border-red-200";

                        const statusIcon = isPaye ? (
                          <FaCheckCircle className="text-xs" />
                        ) : isEnAttente ? (
                          <FaHourglassHalf className="text-xs animate-pulse" />
                        ) : (
                          <FaTimesCircle className="text-xs" />
                        );

                        const statusText = isPaye
                          ? "Payé & Confirmé"
                          : isEnAttente
                          ? "En attente"
                          : p.statut;

                        const locNom = p.locataire?.nom || p.contrat?.locataire?.nom || "Locataire";

                        return (
                          <tr key={p._id} className="border-b border-slate-50 hover:bg-slate-50/60 transition text-slate-700">
                            <td className="py-4 px-4 font-bold text-slate-900">
                              <span className="flex items-center gap-2">
                                <FaHome className="text-blue-600 text-sm shrink-0" />
                                {p.contrat?.bien?.titre || "Bien immobilier"}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <span className="flex items-center gap-1.5 text-xs font-semibold">
                                <FaUser className="text-slate-400 shrink-0" />
                                {locNom}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <p className="text-xs font-bold text-slate-900 capitalize">{p.typePaiement || "loyer"}</p>
                              <p className="text-[10px] text-slate-400 flex items-center gap-1"><FaCalendarAlt /> {p.mois}</p>
                            </td>
                            <td className="py-4 px-4">
                              <p className="text-sm font-extrabold text-blue-600">{Number(p.montant || 0).toLocaleString("fr-FR")} $</p>
                              <p className="text-[10px] text-slate-400 flex items-center gap-1 capitalize"><FaCreditCard /> {p.modePaiement?.replace("_", " ")}</p>
                            </td>
                            <td className="py-4 px-4 text-center">
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider rounded-full border ${statusBadge}`}>
                                {statusIcon}
                                <span>{statusText}</span>
                              </span>
                            </td>
                            {isManagerRole && (
                              <td className="py-4 px-4 text-center">
                                {isEnAttente ? (
                                  <button
                                    onClick={() => handleConfirmer(p._id, locNom, p.montant)}
                                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-sm transition flex items-center gap-1.5 mx-auto cursor-pointer animate-pulse"
                                  >
                                    <FaCheckCircle /> Confirmer
                                  </button>
                                ) : (
                                  <span className="text-[11px] font-semibold text-slate-400">Validé</span>
                                )}
                              </td>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-4">
                  {paiements.map((p) => {
                    const isPaye = p.statut === "payé" || p.statut === "paye";
                    const isEnAttente = p.statut === "en_attente" || p.statut === "en attente";

                    const statusBadge = isPaye
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : isEnAttente
                      ? "bg-amber-50 text-amber-700 border-amber-200"
                      : "bg-red-50 text-red-700 border-red-200";

                    const statusIcon = isPaye ? (
                      <FaCheckCircle className="text-xs" />
                    ) : isEnAttente ? (
                      <FaHourglassHalf className="text-xs animate-pulse" />
                    ) : (
                      <FaTimesCircle className="text-xs" />
                    );

                    const statusText = isPaye ? "Payé & Confirmé" : isEnAttente ? "En attente" : p.statut;
                    const locNom = p.locataire?.nom || p.contrat?.locataire?.nom || "Locataire";

                    return (
                      <div
                        key={p._id}
                        className="p-4 rounded-3xl border border-slate-100 bg-white shadow-xs space-y-3 text-slate-700"
                      >
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <p className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                              <FaHome className="text-blue-600 text-xs" />
                              {p.contrat?.bien?.titre || "Bien immobilier"}
                            </p>
                            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5"><FaUser className="text-[10px]" /> {locNom}</p>
                          </div>

                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-full border ${statusBadge}`}>
                            {statusIcon}
                            <span>{statusText}</span>
                          </span>
                        </div>

                        <hr className="border-slate-100" />

                        <div className="flex justify-between items-center text-xs">
                          <div>
                            <p className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Période</p>
                            <p className="font-semibold text-slate-800 capitalize mt-0.5">{p.typePaiement || "loyer"} ({p.mois})</p>
                          </div>

                          <div className="text-right">
                            <p className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Montant / Mode</p>
                            <p className="font-extrabold text-blue-600 mt-0.5">
                              {Number(p.montant || 0).toLocaleString("fr-FR")} $ ({p.modePaiement?.replace("_", " ")})
                            </p>
                          </div>
                        </div>

                        {isManagerRole && isEnAttente && (
                          <button
                            onClick={() => handleConfirmer(p._id, locNom, p.montant)}
                            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-extrabold text-xs shadow-sm transition flex items-center justify-center gap-2 mt-2 cursor-pointer"
                          >
                            <FaCheckCircle /> Confirmer le paiement
                          </button>
                        )}
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