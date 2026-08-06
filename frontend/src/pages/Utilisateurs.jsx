import { useEffect, useState, useCallback } from "react";
import Layout from "../components/layout/Layout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import api from "../api/axios";
import {
  FaUserShield,
  FaUserPlus,
  FaSearch,
  FaTrash,
  FaEdit,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaUserTag,
  FaEnvelope
} from "react-icons/fa";

export default function Utilisateurs() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });

  const [form, setForm] = useState({
    nom: "",
    email: "",
    password: "",
    role: "locataire",
    estConfirme: true,
  });

  const loadUsers = useCallback(async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data || []);
    } catch (error) {
      console.error("Erreur chargement utilisateurs:", error);
      setMessage({
        text: error.response?.data?.message || "Erreur de chargement des utilisateurs",
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleChange = (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm({
      ...form,
      [e.target.name]: value,
    });
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setForm({
      nom: user.nom,
      email: user.email,
      password: "",
      role: user.role,
      estConfirme: user.estConfirme,
    });
  };

  const cancelEdit = () => {
    setEditingUser(null);
    setForm({
      nom: "",
      email: "",
      password: "",
      role: "locataire",
      estConfirme: true,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    try {
      if (editingUser) {
        await api.put(`/users/${editingUser._id}`, form);
        setMessage({ text: "Utilisateur modifié avec succès !", type: "success" });
        cancelEdit();
      } else {
        await api.post("/users", form);
        setMessage({ text: "Compte utilisateur créé avec succès !", type: "success" });
        setForm({
          nom: "",
          email: "",
          password: "",
          role: "locataire",
          estConfirme: true,
        });
      }
      loadUsers();
    } catch (error) {
      console.error("Erreur enregistrement utilisateur:", error);
      setMessage({
        text: error.response?.data?.message || "Erreur lors de l'enregistrement de l'utilisateur",
        type: "error"
      });
    }
  };

  const handleDelete = async (id, nom) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur "${nom}" ?`)) {
      try {
        await api.delete(`/users/${id}`);
        setMessage({ text: "Utilisateur supprimé avec succès.", type: "success" });
        loadUsers();
      } catch (error) {
        console.error("Erreur suppression utilisateur:", error);
        setMessage({
          text: error.response?.data?.message || "Erreur lors de la suppression",
          type: "error"
        });
      }
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter ? u.role === roleFilter : true;
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "bailleur":
        return "bg-indigo-100 text-indigo-700 border-indigo-200";
      case "agent":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "locataire":
      default:
        return "bg-blue-100 text-blue-700 border-blue-200";
    }
  };

  return (
    <Layout>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            <FaUserShield className="text-blue-600" /> Gestion des Comptes Utilisateurs
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Administration centralisée des identifiants, attributions de rôles et accès système.
          </p>
        </div>
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
        {/* Formulaire */}
        <div className="lg:col-span-1">
          <Card
            title={editingUser ? "Modifier l'utilisateur" : "Créer un utilisateur"}
            className="shadow-sm border border-slate-100 rounded-3xl"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Nom complet"
                name="nom"
                value={form.nom}
                onChange={handleChange}
                required
                placeholder="Ex: Jean Marc"
              />

              <Input
                label="Adresse Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="user@domaine.com"
              />

              <Input
                label={editingUser ? "Nouveau mot de passe (optionnel)" : "Mot de passe"}
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required={!editingUser}
                placeholder={editingUser ? "Laisser vide pour ne pas modifier" : "Mot de passe"}
              />

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Rôle de l'utilisateur
                </label>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50/50 text-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                >
                  <option value="locataire">Locataire</option>
                  <option value="bailleur">Bailleur (Propriétaire)</option>
                  <option value="agent">Agent Immobilier</option>
                  <option value="admin">Administrateur</option>
                </select>
              </div>

              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  name="estConfirme"
                  checked={form.estConfirme}
                  onChange={handleChange}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                Compte confirmé & activé
              </label>

              <div className="flex gap-2 pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1 py-3 rounded-2xl font-bold flex items-center justify-center gap-2"
                >
                  {editingUser ? "Enregistrer" : <><FaUserPlus /> Créer</>}
                </Button>
                {editingUser && (
                  <Button
                    type="button"
                    onClick={cancelEdit}
                    className="flex-1 py-3 rounded-2xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold"
                  >
                    Annuler
                  </Button>
                )}
              </div>
            </form>
          </Card>
        </div>

        {/* Liste des utilisateurs */}
        <div className="lg:col-span-2">
          <Card title="Répertoire des utilisateurs" className="shadow-sm border border-slate-100 rounded-3xl">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <FaSearch className="absolute left-3.5 top-3.5 text-slate-400 text-sm" />
                <input
                  type="text"
                  placeholder="Rechercher par nom ou e-mail..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-xs font-semibold"
                />
              </div>

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="border border-slate-200 rounded-2xl px-4 py-2.5 bg-slate-50/50 text-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
              >
                <option value="">Tous les rôles</option>
                <option value="admin">Administrateurs</option>
                <option value="bailleur">Bailleurs</option>
                <option value="locataire">Locataires</option>
                <option value="agent">Agents</option>
              </select>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-48">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <FaUserTag className="text-4xl text-slate-300 mx-auto mb-2" />
                <p className="font-semibold text-slate-600">Aucun utilisateur trouvé</p>
              </div>
            ) : (
              <>
                {/* Desktop View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 text-xs font-bold uppercase tracking-wider">
                        <th className="py-3 px-4">Utilisateur</th>
                        <th className="py-3 px-4">Rôle</th>
                        <th className="py-3 px-4">Statut</th>
                        <th className="py-3 px-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((u) => (
                        <tr
                          key={u._id}
                          className="border-b border-slate-50 hover:bg-slate-50/60 transition text-slate-700"
                        >
                          <td className="py-4 px-4">
                            <p className="font-extrabold text-slate-900">{u.nom}</p>
                            <p className="text-xs text-slate-400 flex items-center gap-1">
                              <FaEnvelope className="text-[10px]" /> {u.email}
                            </p>
                          </td>
                          <td className="py-4 px-4">
                            <span
                              className={`px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider rounded-full border ${getRoleBadge(
                                u.role
                              )}`}
                            >
                              {u.role}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-bold rounded-full border ${
                                u.estConfirme
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : "bg-amber-50 text-amber-700 border-amber-200"
                              }`}
                            >
                              {u.estConfirme ? (
                                <>
                                  <FaCheckCircle className="text-xs" /> Activé
                                </>
                              ) : (
                                <>
                                  <FaTimesCircle className="text-xs" /> En attente
                                </>
                              )}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <div className="flex gap-2 justify-center">
                              <button
                                onClick={() => handleEdit(u)}
                                className="p-2 text-blue-600 hover:text-white rounded-xl bg-blue-50 hover:bg-blue-600 transition cursor-pointer border border-blue-100"
                                title="Modifier"
                              >
                                <FaEdit />
                              </button>
                              <button
                                onClick={() => handleDelete(u._id, u.nom)}
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
                  {filteredUsers.map((u) => (
                    <div
                      key={u._id}
                      className="p-4 rounded-3xl border border-slate-100 bg-white shadow-xs space-y-3 text-slate-700"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <p className="font-extrabold text-slate-900 text-sm">{u.nom}</p>
                          <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                            <FaEnvelope className="text-[10px]" /> {u.email}
                          </p>
                        </div>

                        <div className="flex gap-1.5">
                          <button
                            onClick={() => handleEdit(u)}
                            className="p-2 text-blue-600 hover:text-white rounded-xl bg-blue-50 hover:bg-blue-600 border border-blue-100"
                            title="Modifier"
                          >
                            <FaEdit className="text-xs" />
                          </button>
                          <button
                            onClick={() => handleDelete(u._id, u.nom)}
                            className="p-2 text-red-600 hover:text-white rounded-xl bg-red-50 hover:bg-red-600 border border-red-100"
                            title="Supprimer"
                          >
                            <FaTrash className="text-xs" />
                          </button>
                        </div>
                      </div>

                      <hr className="border-slate-100" />

                      <div className="flex justify-between items-center text-xs">
                        <span
                          className={`px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider rounded-full border ${getRoleBadge(
                            u.role
                          )}`}
                        >
                          {u.role}
                        </span>

                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-bold rounded-full border ${
                            u.estConfirme
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}
                        >
                          {u.estConfirme ? "Activé" : "En attente"}
                        </span>
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
