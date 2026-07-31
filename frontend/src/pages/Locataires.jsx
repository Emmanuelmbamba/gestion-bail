import { useEffect, useState, useCallback } from "react";
import Layout from "../components/layout/Layout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { getLocataires, createLocataire, deleteLocataire, getLocataireUsers, updateLocataire, searchLocataires } from "../services/locataireService";
import { FaTrash, FaPhone, FaEnvelope, FaBriefcase, FaMapMarkerAlt, FaEdit, FaSearch, FaIdCard, FaUser } from "react-icons/fa";

function Locataires() {
  const [locataires, setLocataires] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
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
    // eslint-disable-next-line
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
    if (!form.user && !editingId) {
      alert("Veuillez sélectionner un compte utilisateur pour le locataire.");
      return;
    }
    try {
      if (editingId) {
        await updateLocataire(editingId, form);
        alert("Locataire modifié avec succès");
        cancelEdit();
      } else {
        await createLocataire(form);
        alert("Locataire créé avec succès");
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
      alert(error.response?.data?.message || "Erreur d'opération");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Supprimer ce profil locataire ?")) {
      try {
        await deleteLocataire(id);
        loadData();
      } catch (error) {
        console.error("Erreur de suppression:", error);
      }
    }
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">Gestion des Locataires 👤</h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-1">Créez, modifiez et suivez les profils détaillés de vos locataires</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-1">
          <Card title={editingId ? "Modifier le locataire" : "Créer un profil locataire"} className="shadow-sm border border-slate-100">
            <form onSubmit={handleSubmit} className="space-y-4">
              {!editingId && (
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-semibold text-slate-700">Associer à un compte</label>
                  <select
                    name="user"
                    value={form.user}
                    onChange={handleUserChange}
                    required={!editingId}
                    className="w-full border border-slate-200 rounded-lg px-4 py-2.5 bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-sm font-medium"
                  >
                    <option value="">-- Choisir un utilisateur --</option>
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
                placeholder="Nom du locataire"
                disabled={!editingId && form.user === ""}
              />

              <Input
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="email@exemple.com"
                disabled={!editingId && form.user === ""}
              />

              <Input
                label="Téléphone"
                name="telephone"
                value={form.telephone}
                onChange={handleChange}
                required
                placeholder="ex. +33 6 12 34 56 78"
              />

              <Input
                label="Adresse actuelle"
                name="adresse"
                value={form.adresse}
                onChange={handleChange}
                placeholder="ex. 45 Avenue des Champs-Élysées"
              />

              <Input
                label="Profession"
                name="profession"
                value={form.profession}
                onChange={handleChange}
                placeholder="ex. Ingénieur logiciel"
              />

              <Input
                label="Pièce d'identité"
                name="pieceIdentite"
                value={form.pieceIdentite}
                onChange={handleChange}
                placeholder="ex. CNI, Passeport..."
              />

              <div className="flex gap-2">
                <Button type="submit" variant="primary" className="flex-1 py-3 rounded-xl flex items-center justify-center gap-2">
                  {editingId ? "Mettre à jour" : "Enregistrer"}
                </Button>
                {editingId && (
                  <Button type="button" onClick={cancelEdit} className="flex-1 py-3 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700">
                    Annuler
                  </Button>
                )}
              </div>
            </form>
          </Card>
        </div>

        {/* List */}
        <div className="lg:col-span-2">
          <Card title="Liste des profils locataires" className="shadow-sm border border-slate-100">
            <div className="mb-6">
              <div className="relative">
                <FaSearch className="absolute left-3 top-3.5 text-slate-400 text-sm" />
                <input
                  type="text"
                  placeholder="Rechercher par nom, email ou téléphone..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-sm font-semibold"
                />
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-48">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
              </div>
            ) : locataires.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <p className="text-lg">Aucun locataire enregistré</p>
                <p className="text-sm mt-1">Les locataires s'inscrivent puis vous associez leur profil ici.</p>
              </div>
            ) : (
              <>
                {/* Desktop View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 text-sm font-semibold">
                        <th className="py-3 px-4">Locataire</th>
                        <th className="py-3 px-4">Contact</th>
                        <th className="py-3 px-4">Profession & Ville</th>
                        <th className="py-3 px-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {locataires.map((loc) => (
                        <tr key={loc._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors duration-150 text-slate-700">
                          <td className="py-4 px-4">
                            <p className="font-bold text-slate-800">{loc.nom}</p>
                            <p className="text-xs text-slate-400">ID: {loc.user?._id || "N/A"}</p>
                          </td>
                          <td className="py-4 px-4 space-y-1">
                            <p className="text-sm flex items-center gap-2"><FaEnvelope className="text-slate-400 text-xs" /> {loc.email}</p>
                            <p className="text-sm flex items-center gap-2"><FaPhone className="text-slate-400 text-xs" /> {loc.telephone}</p>
                          </td>
                          <td className="py-4 px-4 space-y-1">
                            {loc.profession && <p className="text-sm flex items-center gap-2"><FaBriefcase className="text-slate-400 text-xs" /> {loc.profession}</p>}
                            {loc.adresse && <p className="text-sm flex items-center gap-2"><FaMapMarkerAlt className="text-slate-400 text-xs" /> {loc.adresse}</p>}
                            {loc.pieceIdentite && <p className="text-sm flex items-center gap-2"><FaIdCard className="text-slate-400 text-xs" /> Pièce: {loc.pieceIdentite}</p>}
                          </td>
                          <td className="py-4 px-4 text-center">
                            <div className="flex gap-2 justify-center">
                              <button
                                onClick={() => handleEdit(loc)}
                                className="p-2 text-blue-500 hover:text-white rounded-lg bg-blue-50 hover:bg-blue-600 transition-all duration-150 cursor-pointer border border-blue-100 hover:border-blue-600"
                              >
                                <FaEdit />
                              </button>
                              <button
                                onClick={() => handleDelete(loc._id)}
                                className="p-2 text-red-500 hover:text-white rounded-lg bg-red-50 hover:bg-red-600 transition-all duration-150 cursor-pointer border border-red-100 hover:border-red-600"
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
                      className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-3 text-slate-700"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <p className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
                            <FaUser className="text-blue-500 text-xs" /> {loc.nom}
                          </p>
                          <p className="text-[10px] text-slate-400 mt-1">ID: {loc.user?._id || "N/A"}</p>
                        </div>

                        <div className="flex gap-1.5">
                          <button
                            onClick={() => handleEdit(loc)}
                            className="p-2 text-blue-500 hover:text-white rounded-xl bg-blue-50 hover:bg-blue-600 border border-blue-100 hover:border-blue-600 transition-all duration-150"
                            title="Modifier"
                          >
                            <FaEdit className="text-xs" />
                          </button>
                          <button
                            onClick={() => handleDelete(loc._id)}
                            className="p-2 text-red-500 hover:text-white rounded-xl bg-red-50 hover:bg-red-600 border border-red-100 hover:border-red-600 transition-all duration-150"
                            title="Supprimer"
                          >
                            <FaTrash className="text-xs" />
                          </button>
                        </div>
                      </div>

                      <hr className="border-slate-100" />

                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div className="space-y-1.5">
                          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Contact</p>
                          <p className="flex items-center gap-1.5 text-slate-600 font-semibold"><FaEnvelope className="text-[10px]" /> {loc.email}</p>
                          <p className="flex items-center gap-1.5 text-slate-600 font-semibold"><FaPhone className="text-[10px]" /> {loc.telephone}</p>
                        </div>

                        <div className="space-y-1.5">
                          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Profil & Identité</p>
                          {loc.profession && <p className="flex items-center gap-1.5 text-slate-600 font-semibold"><FaBriefcase className="text-[10px]" /> {loc.profession}</p>}
                          {loc.adresse && <p className="flex items-center gap-1.5 text-slate-600 font-semibold"><FaMapMarkerAlt className="text-[10px]" /> {loc.adresse}</p>}
                          {loc.pieceIdentite && <p className="flex items-center gap-1.5 text-slate-600 font-semibold"><FaIdCard className="text-[10px]" /> Pièce: {loc.pieceIdentite}</p>}
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
