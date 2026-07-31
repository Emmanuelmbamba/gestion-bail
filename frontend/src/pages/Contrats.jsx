import { useEffect, useState, useContext } from "react";
import Layout from "../components/layout/Layout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { getContrats, createContrat, downloadContrat, signerContrat } from "../services/contratService";
import { getBiens } from "../services/bienService";
import { getLocataireUsers } from "../services/locataireService";
import { FaPlus, FaDownload, FaCalendarAlt, FaDollarSign, FaUser, FaHome } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";

function Contrats() {
  const { user } = useContext(AuthContext);
  const [contrats, setContrats] = useState([]);
  const [biens, setBiens] = useState([]);
  const [locataires, setLocataires] = useState([]);
  const [loading, setLoading] = useState(true);

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
      const bList = await getBiens(true);
      setBiens(bList || []);
      const lList = await getLocataireUsers();
      setLocataires(lList || []);
    } catch (error) {
      console.error("Erreur lors du chargement des contrats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    Promise.resolve().then(() => {
      loadAllData();
    });
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
    } catch (error) {
      console.error("Erreur de création de contrat:", error);
      alert(error.response?.data?.message || "Erreur lors de la création");
    }
  };

  const handleSigner = async (id) => {
    try {
      await signerContrat(id);
      alert("Contrat signé avec succès !");
      loadAllData();
    } catch (error) {
      console.error("Erreur de signature:", error);
      alert(error.response?.data?.message || "Erreur lors de la signature");
    }
  };

  const handleDownload = (id, nomLocataire) => {
    downloadContrat(id, `Contrat_${nomLocataire.replace(/\s+/g, "_")}.pdf`);
  };

  const handleResilier = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir résilier ce contrat de bail ?")) {
      try {
        await api.put(`/contrats/resilier/${id}`);
        alert("Contrat résilié avec succès !");
        loadAllData();
      } catch (error) {
        console.error("Erreur de résiliation:", error);
        alert(error.response?.data?.message || "Erreur lors de la résiliation");
      }
    }
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Contrats de bail 📄</h1>
        <p className="text-slate-500 text-sm mt-1">Générez et stockez les contrats de bail officiels au format PDF</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-1">
          <Card title="Rédiger un contrat de bail" className="shadow-sm border border-slate-100">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="mb-4">
                <label className="block mb-2 text-sm font-semibold text-slate-700">Bien immobilier</label>
                <select
                  name="bien"
                  value={form.bien}
                  onChange={handleBienSelect}
                  required
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                >
                  <option value="">-- Choisir un bien --</option>
                  {biens.map((b) => (
                    <option key={b._id} value={b._id}>
                      {b.titre} - {b.prix} $ ({b.ville})
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block mb-2 text-sm font-semibold text-slate-700">Locataire</label>
                <select
                  name="locataire"
                  value={form.locataire}
                  onChange={handleChange}
                  required
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                >
                  <option value="">-- Choisir un locataire --</option>
                  {locataires.map((l) => (
                    <option key={l._id} value={l._id}>
                      {l.nom} ({l.email})
                    </option>
                  ))}
                </select>
              </div>

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

              <Input
                label="Loyer mensuel ($)"
                name="montantLoyer"
                type="number"
                value={form.montantLoyer}
                onChange={handleChange}
                required
                placeholder="Montant du loyer"
              />

              <Input
                label="Caution (€)"
                name="caution"
                type="number"
                value={form.caution}
                onChange={handleChange}
                placeholder="Montant de la caution"
              />

              <div className="mb-4">
                <label className="block mb-2 text-sm font-semibold text-slate-700">Conditions particulières</label>
                <textarea
                  name="conditions"
                  value={form.conditions}
                  onChange={handleChange}
                  rows="3"
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                  placeholder="Préciser les conditions du bail"
                />
              </div>

              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <input
                  type="checkbox"
                  name="signatureElectronique"
                  checked={form.signatureElectronique}
                  onChange={(e) => setForm({ ...form, signatureElectronique: e.target.checked })}
                />
                Signature électronique
              </label>

              <Button type="submit" variant="primary" className="w-full py-3 rounded-xl flex items-center justify-center gap-2">
                <FaPlus /> Générer le contrat
              </Button>
            </form>
          </Card>
        </div>

        {/* List */}
        <div className="lg:col-span-2">
          <Card title="Liste des contrats" className="shadow-sm border border-slate-100">
            {loading ? (
              <div className="flex justify-center items-center h-48">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
              </div>
            ) : contrats.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <p className="text-lg">Aucun contrat rédigé</p>
                <p className="text-sm mt-1">Utilisez le formulaire à gauche pour générer un nouveau contrat de bail.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {contrats.map((c) => (
                  <div
                    key={c._id}
                    className="border border-slate-100 rounded-2xl p-5 bg-slate-50/20 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:shadow-sm transition-all duration-150"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${
                          c.statut === "actif" 
                            ? "bg-green-50 text-green-700" 
                            : c.statut === "en_attente"
                            ? "bg-yellow-50 text-yellow-700 border border-yellow-200"
                            : "bg-red-50 text-red-700"
                        }`}>
                          {c.statut}
                        </span>
                        <p className="text-sm text-slate-400 font-medium">Créé le {new Date(c.createdAt).toLocaleDateString()}</p>
                      </div>
                      <p className="font-bold text-slate-800 text-lg flex items-center gap-2">
                        <FaHome className="text-blue-600 text-base" /> {c.bien?.titre || "Bien inconnu"}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-sm text-slate-500">
                        <p className="flex items-center gap-2">
                          <FaUser className="text-slate-400 text-xs" /> Locataire: <span className="font-semibold text-slate-700">{c.locataire?.nom || "Locataire inconnu"}</span>
                        </p>
                        <p className="flex items-center gap-2">
                          <FaDollarSign className="text-slate-400 text-xs" /> Loyer: <span className="font-semibold text-slate-700">{c.montantLoyer} $</span>
                        </p>
                        {c.caution ? <p className="text-sm text-slate-500">Caution : {c.caution} $</p> : null}
                        {c.conditions ? <p className="text-sm text-slate-500">Conditions : {c.conditions}</p> : null}
                        <p className="flex items-center gap-2 col-span-2">
                          <FaCalendarAlt className="text-slate-400 text-xs" /> Du {new Date(c.dateDebut).toLocaleDateString()} au {new Date(c.dateFin).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-100/50 space-y-1 text-xs">
                        <p className="font-semibold text-slate-700">Acceptations / Signatures :</p>
                        <div className="flex flex-wrap gap-4 text-slate-600 mt-1">
                          <p className="flex items-center gap-1.5">
                            <span>Propriétaire :</span>
                            <span className={c.signeBailleur ? "text-green-600 font-semibold" : "text-amber-600 font-semibold"}>
                              {c.signeBailleur ? "Signé ✅" : "En attente ⏳"}
                            </span>
                          </p>
                          <p className="flex items-center gap-1.5">
                            <span>Locataire :</span>
                            <span className={c.signeLocataire ? "text-green-600 font-semibold" : "text-amber-600 font-semibold"}>
                              {c.signeLocataire ? "Signé ✅" : "En attente ⏳"}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-2">
                      <button
                        onClick={() => handleDownload(c._id, c.locataire?.nom || "Bail")}
                        className="w-full sm:w-auto px-4 py-2.5 text-blue-600 hover:text-white rounded-xl bg-blue-50 hover:bg-blue-600 border border-blue-100 hover:border-blue-600 font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <FaDownload /> PDF contrat
                      </button>

                      {c.statut === "en_attente" && (
                        ((user?.role === "bailleur" && (c.bailleur?._id === user?.id || c.bailleur === user?.id) && !c.signeBailleur) ||
                         (user?.role === "locataire" && (c.locataire?._id === user?.id || c.locataire === user?.id) && !c.signeLocataire))
                      ) && (
                        <button
                          onClick={() => handleSigner(c._id)}
                          className="w-full sm:w-auto px-4 py-2.5 text-green-600 hover:text-white rounded-xl bg-green-50 hover:bg-green-600 border border-green-100 hover:border-green-600 font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-1 cursor-pointer font-bold animate-pulse"
                        >
                          Signer
                        </button>
                      )}

                      {c.statut === "actif" && (user?.role === "bailleur" || user?.role === "admin" || user?.role === "agent") && (
                        <button
                          onClick={() => handleResilier(c._id)}
                          className="w-full sm:w-auto px-4 py-2.5 text-red-600 hover:text-white rounded-xl bg-red-50 hover:bg-red-600 border border-red-100 hover:border-red-600 font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-1 cursor-pointer"
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