import { useEffect, useState, useContext } from "react";
import Layout from "../components/layout/Layout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { getContrats, createContrat, downloadContrat, signerContrat } from "../services/contratService";
import { getBiens } from "../services/bienService";
import { getLocataireUsers } from "../services/locataireService";
import { FaPlus, FaDownload, FaCalendarAlt, FaDollarSign, FaUser, FaHome, FaFileContract, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";

function Contrats() {
  const { user } = useContext(AuthContext);
  const [contrats, setContrats] = useState([]);
  const [biens, setBiens] = useState([]);
  const [locataires, setLocataires] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "" });

  const isManagerRole = user?.role === "admin" || user?.role === "bailleur" || user?.role === "agent";

  const [form, setForm] = useState({
    bien: "",
    locataire: "",
    dateDebut: "",
    dateFin: "",
    montantLoyer: "",
    caution: "",
    conditions: "",
    signatureElectronique: false
  });

  const loadAllData = async () => {
    try {
      const contrs = await getContrats();
      setContrats(contrs || []);
      if (isManagerRole) {
        const bList = await getBiens(true);
        setBiens(bList || []);
        const lList = await getLocataireUsers();
        setLocataires(lList || []);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des contrats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleBienSelect = (e) => {
    const selectedBienId = e.target.value;
    const selectedBien = biens.find((b) => b._id === selectedBienId);
    setForm({
      ...form,
      bien: selectedBienId,
      montantLoyer: selectedBien ? selectedBien.prix : ""
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });
    try {
      await createContrat(form);
      setForm({
        bien: "",
        locataire: "",
        dateDebut: "",
        dateFin: "",
        montantLoyer: "",
        caution: "",
        conditions: "",
        signatureElectronique: false
      });
      loadAllData();
      setMessage({ text: "Contrat généré avec succès !", type: "success" });
    } catch (error) {
      console.error("Erreur de création de contrat:", error);
      setMessage({
        text: error.response?.data?.message || "Erreur lors de la création du contrat",
        type: "error"
      });
    }
  };

  const handleSigner = async (id) => {
    try {
      await signerContrat(id);
      setMessage({ text: "Contrat signé avec succès !", type: "success" });
      loadAllData();
    } catch (error) {
      console.error("Erreur de signature:", error);
      setMessage({
        text: error.response?.data?.message || "Erreur lors de la signature",
        type: "error"
      });
    }
  };

  const handleDownload = (id, nomLocataire) => {
    downloadContrat(id, `Contrat_${(nomLocataire || "Locataire").replace(/\s+/g, "_")}.pdf`);
  };

  const handleResilier = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir résilier ce contrat de bail ?")) {
      try {
        await api.put(`/contrats/resilier/${id}`);
        setMessage({ text: "Contrat résilié avec succès !", type: "success" });
        loadAllData();
      } catch (error) {
        console.error("Erreur de résiliation:", error);
        setMessage({
          text: error.response?.data?.message || "Erreur lors de la résiliation",
          type: "error"
        });
      }
    }
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
          <FaFileContract className="text-blue-600" /> Contrats de Bail Officiels
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-1">
          {isManagerRole
            ? "Générez, signez et téléchargez vos baux locatifs au format PDF."
            : "Consultez, signez et téléchargez vos contrats de bail officiels."}
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
        {/* Formulaire de création (Réservé aux Bailleurs / Admins / Agents) */}
        {isManagerRole && (
          <div className="lg:col-span-1">
            <Card title="Générer un contrat" className="shadow-sm border border-slate-100 rounded-3xl">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">Bien immobilier</label>
                  <select
                    name="bien"
                    value={form.bien}
                    onChange={handleBienSelect}
                    required
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50/50 text-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                  >
                    <option value="">-- Sélectionner un bien --</option>
                    {biens.map((b) => (
                      <option key={b._id} value={b._id}>
                        {b.titre} ({b.prix} $)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">Locataire</label>
                  <select
                    name="locataire"
                    value={form.locataire}
                    onChange={handleChange}
                    required
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50/50 text-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                  >
                    <option value="">-- Sélectionner un locataire --</option>
                    {locataires.map((l) => (
                      <option key={l._id} value={l._id}>
                        {l.nom} ({l.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Date de début"
                    name="dateDebut"
                    type="date"
                    value={form.dateDebut}
                    onChange={handleChange}
                    required
                  />

                  <Input
                    label="Date de fin"
                    name="dateFin"
                    type="date"
                    value={form.dateFin}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Loyer ($)"
                    name="montantLoyer"
                    type="number"
                    value={form.montantLoyer}
                    onChange={handleChange}
                    required
                    placeholder="Loyer"
                  />

                  <Input
                    label="Caution ($)"
                    name="caution"
                    type="number"
                    value={form.caution}
                    onChange={handleChange}
                    placeholder="Caution"
                  />
                </div>

                <div>
                  <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">Conditions particulières</label>
                  <textarea
                    name="conditions"
                    value={form.conditions}
                    onChange={handleChange}
                    rows="3"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 bg-slate-50/50 text-slate-800 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                    placeholder="Précisez les clauses et charges incluses..."
                  />
                </div>

                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    name="signatureElectronique"
                    checked={form.signatureElectronique}
                    onChange={(e) => setForm({ ...form, signatureElectronique: e.target.checked })}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  Activer la signature électronique
                </label>

                <Button type="submit" variant="primary" className="w-full py-3 rounded-2xl flex items-center justify-center gap-2 font-bold mt-2">
                  <FaPlus /> Générer le contrat
                </Button>
              </form>
            </Card>
          </div>
        )}

        {/* Liste des contrats */}
        <div className={isManagerRole ? "lg:col-span-2" : "lg:col-span-3"}>
          <Card title="Répertoire de vos contrats" className="shadow-sm border border-slate-100 rounded-3xl">
            {loading ? (
              <div className="flex justify-center items-center h-48">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
              </div>
            ) : contrats.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <FaFileContract className="text-4xl text-slate-300 mx-auto mb-2" />
                <p className="font-semibold text-slate-600">Aucun contrat disponible</p>
                <p className="text-xs text-slate-400 mt-1">
                  {isManagerRole
                    ? "Utilisez le formulaire pour générer votre premier bail."
                    : "Votre propriétaire établira votre contrat de bail ici."}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {contrats.map((c) => (
                  <div
                    key={c._id}
                    className="border border-slate-100 rounded-3xl p-5 bg-white shadow-xs hover:shadow-md transition duration-200 flex flex-col sm:flex-row justify-between sm:items-center gap-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider rounded-full ${
                          c.statut === "actif"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                            : c.statut === "en_attente"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-red-50 text-red-700 border border-red-100"
                        }`}>
                          {c.statut}
                        </span>
                        <span className="text-xs text-slate-400">Créé le {new Date(c.createdAt).toLocaleDateString("fr-FR")}</span>
                      </div>

                      <p className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                        <FaHome className="text-blue-600 text-sm" /> {c.bien?.titre || "Bien immobilier"}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-xs text-slate-500 font-medium">
                        <p className="flex items-center gap-1.5">
                          <FaUser className="text-slate-400" /> Locataire: <span className="font-bold text-slate-800">{c.locataire?.nom || "Locataire non assigné"}</span>
                        </p>
                        <p className="flex items-center gap-1.5">
                          <FaDollarSign className="text-slate-400" /> Loyer: <span className="font-bold text-blue-600">{c.montantLoyer} $/mois</span>
                        </p>
                        {c.caution ? <p className="text-slate-500">Caution : {c.caution} $</p> : null}
                        <p className="flex items-center gap-1.5 col-span-2 mt-1">
                          <FaCalendarAlt className="text-slate-400" /> Du {new Date(c.dateDebut).toLocaleDateString("fr-FR")} au {new Date(c.dateFin).toLocaleDateString("fr-FR")}
                        </p>
                      </div>

                      <div className="mt-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1 text-xs">
                        <p className="font-bold text-slate-700">Signatures :</p>
                        <div className="flex flex-wrap gap-4 text-slate-600">
                          <p className="flex items-center gap-1">
                            <span>Propriétaire :</span>
                            <span className={c.signeBailleur ? "text-emerald-600 font-bold" : "text-amber-600 font-bold"}>
                              {c.signeBailleur ? "Signé ✅" : "En attente ⏳"}
                            </span>
                          </p>
                          <p className="flex items-center gap-1">
                            <span>Locataire :</span>
                            <span className={c.signeLocataire ? "text-emerald-600 font-bold" : "text-amber-600 font-bold"}>
                              {c.signeLocataire ? "Signé ✅" : "En attente ⏳"}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-2">
                      <button
                        onClick={() => handleDownload(c._id, c.locataire?.nom)}
                        className="w-full sm:w-auto px-4 py-2.5 text-blue-600 hover:text-white rounded-xl bg-blue-50 hover:bg-blue-600 border border-blue-100 hover:border-blue-600 font-bold text-xs transition duration-150 flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <FaDownload /> Télécharger PDF
                      </button>

                      {c.statut === "en_attente" && (
                        ((user?.role === "bailleur" && (c.bailleur?._id === user?.id || c.bailleur === user?.id) && !c.signeBailleur) ||
                         (user?.role === "locataire" && (c.locataire?._id === user?.id || c.locataire === user?.id) && !c.signeLocataire))
                      ) && (
                        <button
                          onClick={() => handleSigner(c._id)}
                          className="w-full sm:w-auto px-4 py-2.5 text-emerald-600 hover:text-white rounded-xl bg-emerald-50 hover:bg-emerald-600 border border-emerald-100 hover:border-emerald-600 font-bold text-xs transition duration-150 flex items-center justify-center gap-1 cursor-pointer animate-pulse shadow-xs"
                        >
                          Signer maintenant
                        </button>
                      )}

                      {c.statut === "actif" && isManagerRole && (
                        <button
                          onClick={() => handleResilier(c._id)}
                          className="w-full sm:w-auto px-4 py-2.5 text-red-600 hover:text-white rounded-xl bg-red-50 hover:bg-red-600 border border-red-100 hover:border-red-600 font-bold text-xs transition duration-150 flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                        >
                          Résilier
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </Layout>
  );
}

export default Contrats;