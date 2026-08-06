import { useEffect, useState, useCallback } from "react";
import Layout from "../components/layout/Layout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { getLocataires, createLocataire, deleteLocataire, getLocataireUsers, updateLocataire, searchLocataires } from "../services/locataireService";
import { FaTrash, FaPhone, FaEnvelope, FaBriefcase, FaMapMarkerAlt, FaEdit, FaSearch, FaIdCard, FaUser, FaCheckCircle, FaExclamationTriangle, FaUsers } from "react-icons/fa";

function Locataires() {
  const [locataires, setLocataires] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });

  const [form, setForm] = useState({
    user: "",
    nom: "",
    telephone: "",
    email: "",
    adresse: "",
    profession: "",
    pieceIdentite: ""
  });

  const loadData = useCallback(async () => {
    try {
      const locData = await getLocataires();
      setLocataires(locData || []);
      const userData = await getLocataireUsers();
      setUsers(userData || []);
    } catch (error) {
      console.error("Erreur de chargement des locataires:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchTerm(query);
    if (query.trim()) {
      try {
        const results = await searchLocataires(query);
        setLocataires(results || []);
      } catch (error) {
        console.error("Erreur recherche:", error);
      }
    } else {
      loadData();
    }
  };

  const handleEdit = (locataire) => {
    setEditingId(locataire._id);
    setForm({
      user: locataire.user?._id || "",
      nom: locataire.nom,
      telephone: locataire.telephone,
      email: locataire.email,
      adresse: locataire.adresse || "",
      profession: locataire.profession || "",
      pieceIdentite: locataire.pieceIdentite || ""
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({
      user: "",
      nom: "",
      telephone: "",
      email: "",
      adresse: "",
      profession: "",
      pieceIdentite: ""
    });
  };

  const handleUserChange = (e) => {
    const selectedUserId = e.target.value;
    const selectedUser = users.find(u => u._id === selectedUserId);
    if (selectedUser) {
      setForm({
        ...form,
        user: selectedUserId,
        nom: selectedUser.nom,
        email: selectedUser.email
      });
    } else {
      setForm({
        ...form,
        user: "",
        nom: "",
        email: ""
      });
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });
    if (!form.user && !editingId) {
      setMessage({ text: "Veuillez sélectionner un compte utilisateur pour le locataire.", type: "error" });
      return;
    }
    try {
      if (editingId) {
        await updateLocataire(editingId, form);
        setMessage({ text: "Profil locataire mis à jour avec succès !", type: "success" });
        cancelEdit();
      } else {
        await createLocataire(form);
        setMessage({ text: "Locataire enregistré avec succès !", type: "success" });
        setForm({
          user: "",
          nom: "",
          telephone: "",
          email: "",
          adresse: "",
          profession: "",
          pieceIdentite: ""
        });
      }
      loadData();
    } catch (error) {
      console.error("Erreur:", error);
      setMessage({
        text: error.response?.data?.message || "Erreur lors de l'enregistrement",
        type: "error"
      });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Supprimer ce profil locataire ?")) {
      try {
        await deleteLocataire(id);
        setMessage({ text: "Profil locataire supprimé avec succès.", type: "success" });
        loadData();
      } catch (error) {
        console.error("Erreur de suppression:", error);
        setMessage({ text: "Erreur de suppression du profil", type: "error" });
      }
    }
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
          <FaUsers className="text-blue-600" /> Gestion des Locataires
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-1">Administrez les dossiers et informations personnelles de vos locataires.</p>
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
        {/* Form */}
        <div className="lg:col-span-1">
          <Card title={editingId ? "Modifier le locataire" : "Fiche profil locataire"} className="shadow-sm border border-slate-100 rounded-3xl">
            <form onSubmit={handleSubmit} className="space-y-4">
              {!editingId && (
                <div>
                  <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">Compte Utilisateur</label>
                  <select
                    name="user"
                    value={form.user}
                    onChange={handleUserChange}
                    required={!editingId}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-xs font-semibold"
                  >
                    <option value="">-- Choisir un utilisateur inscrit --</option>
                    {users.map(u => (
                      <option key={u._id} value={u._id}>{u.nom} ({u.email})</option>
                    ))}
                  </select>
                </div>
              )}

              <Input
                label="Nom Complet"
                name="nom"
                value={form.nom}
                onChange={handleChange}
                required
                placeholder="Nom complet"
                disabled={!editingId && form.user === ""}
              />

              <Input
                label="Adresse Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="email@exemple.com"
                disabled={!editingId && form.user === ""}
              />

              <Input
                label="Numéro de Téléphone"
                name="telephone"
                value={form.telephone}
                onChange={handleChange}
                required
                placeholder="+243 818 451 340"
                placeholder="+243 997 300 932"
              />

              <Input
                label="Adresse physique"
                name="adresse"
                value={form.adresse}
                onChange={handleChange}
                placeholder="Adresse du domicile"
              />

              <Input
                label="Profession"
                name="profession"
                value={form.profession}
                onChange={handleChange}
                placeholder="Activité professionnelle"
              />

              <Input
                label="Pièce d'identité (CNI / Passeport)"
                name="pieceIdentite"
                value={form.pieceIdentite}
                onChange={handleChange}
                placeholder="Numéro de pièce d'identité"
              />

              <div className="flex gap-2 pt-2">
                <Button type="submit" variant="primary" className="flex-1 py-3 rounded-2xl font-bold flex items-center justify-center gap-2">
                  {editingId ? "Mettre à jour" : "Enregistrer"}
                </Button>
                {editingId && (
                  <Button type="button" onClick={cancelEdit} className="flex-1 py-3 rounded-2xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold">
                    Annuler
                  </Button>
                )}
              </div>
            </form>
          </Card>
        </div>

        {/* List */}
        <div className="lg:col-span-2">
          <Card title="Répertoire des locataires" className="shadow-sm border border-slate-100 rounded-3xl">
            <div className="mb-6">
              <div className="relative">
                <FaSearch className="absolute left-3.5 top-3.5 text-slate-400 text-sm" />
                <input
                  type="text"
                  placeholder="Rechercher par nom, email ou téléphone..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-xs font-semibold"
                />
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-48">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
              </div>
            ) : locataires.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <FaUsers className="text-4xl text-slate-300 mx-auto mb-2" />
                <p className="font-semibold text-slate-600">Aucun locataire trouvé</p>
              </div>
            ) : (
              <>
                {/* Desktop View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 text-xs font-bold uppercase tracking-wider">
                        <th className="py-3 px-4">Locataire</th>
                        <th className="py-3 px-4">Contact</th>
                        <th className="py-3 px-4">Profession & Adresse</th>
                        <th className="py-3 px-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {locataires.map((loc) => (
                        <tr key={loc._id} className="border-b border-slate-50 hover:bg-slate-50/60 transition text-slate-700">
                          <td className="py-4 px-4">
                            <p className="font-extrabold text-slate-900">{loc.nom}</p>
                            <p className="text-[10px] text-slate-400">ID: {loc.user?._id || "N/A"}</p>
                          </td>
                          <td className="py-4 px-4 space-y-1 text-xs">
                            <p className="flex items-center gap-1.5 font-medium"><FaEnvelope className="text-slate-400" /> {loc.email}</p>
                            <p className="flex items-center gap-1.5 font-medium"><FaPhone className="text-slate-400" /> {loc.telephone}</p>
                          </td>
                          <td className="py-4 px-4 space-y-1 text-xs">
                            {loc.profession && <p className="flex items-center gap-1.5 font-medium"><FaBriefcase className="text-slate-400" /> {loc.profession}</p>}
                            {loc.adresse && <p className="flex items-center gap-1.5 font-medium"><FaMapMarkerAlt className="text-slate-400" /> {loc.adresse}</p>}
                            {loc.pieceIdentite && <p className="flex items-center gap-1.5 font-medium"><FaIdCard className="text-slate-400" /> Pièce: {loc.pieceIdentite}</p>}
                          </td>
                          <td className="py-4 px-4 text-center">
                            <div className="flex gap-2 justify-center">
                              <button
                                onClick={() => handleEdit(loc)}
                                className="p-2 text-blue-600 hover:text-white rounded-xl bg-blue-50 hover:bg-blue-600 transition cursor-pointer border border-blue-100"
                                title="Modifier"
                              >
                                <FaEdit />
                              </button>
                              <button
                                onClick={() => handleDelete(loc._id)}
                                className="p-2 text-red-600 hover:text-white rounded-xl bg-red-50 hover:bg-red-600 transition cursor-pointer border border-red-100"
                                title="Supprimer"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile View */}
                <div className="md:hidden space-y-4">
                  {locataires.map((loc) => (
                    <div 
                      key={loc._id} 
                      className="p-4 rounded-3xl border border-slate-100 bg-white shadow-xs space-y-3 text-slate-700"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <p className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                            <FaUser className="text-blue-600 text-xs" /> {loc.nom}
                          </p>
                          <p className="text-[10px] text-slate-400 mt-0.5">ID: {loc.user?._id || "N/A"}</p>
                        </div>

                        <div className="flex gap-1.5">
                          <button
                            onClick={() => handleEdit(loc)}
                            className="p-2 text-blue-600 hover:text-white rounded-xl bg-blue-50 hover:bg-blue-600 border border-blue-100"
                            title="Modifier"
                          >
                            <FaEdit className="text-xs" />
                          </button>
                          <button
                            onClick={() => handleDelete(loc._id)}
                            className="p-2 text-red-600 hover:text-white rounded-xl bg-red-50 hover:bg-red-600 border border-red-100"
                            title="Supprimer"
                          >
                            <FaTrash className="text-xs" />
                          </button>
                        </div>
                      </div>

                      <hr className="border-slate-100" />

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="space-y-1">
                          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Contact</p>
                          <p className="flex items-center gap-1.5 font-medium"><FaEnvelope className="text-slate-400 text-[10px]" /> {loc.email}</p>
                          <p className="flex items-center gap-1.5 font-medium"><FaPhone className="text-slate-400 text-[10px]" /> {loc.telephone}</p>
                        </div>

                        <div className="space-y-1">
                          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Détails</p>
                          {loc.profession && <p className="flex items-center gap-1.5 font-medium"><FaBriefcase className="text-slate-400 text-[10px]" /> {loc.profession}</p>}
                          {loc.adresse && <p className="flex items-center gap-1.5 font-medium"><FaMapMarkerAlt className="text-slate-400 text-[10px]" /> {loc.adresse}</p>}
                          {loc.pieceIdentite && <p className="flex items-center gap-1.5 font-medium"><FaIdCard className="text-slate-400 text-[10px]" /> Pièce: {loc.pieceIdentite}</p>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </Card>
        </div>
      </div>
    </Layout>
  );
}

export default Locataires;
