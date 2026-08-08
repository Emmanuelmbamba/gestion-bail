import { useEffect, useState, useCallback } from "react";
import Layout from "../components/layout/Layout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { getBiens, createBien, deleteBien } from "../services/bienService";
import api from "../api/axios";
import {
  FaHome,
  FaPlus,
  FaMapMarkerAlt,
  FaBuilding,
  FaBed,
  FaDollarSign,
  FaTrash,
  FaCheckCircle,
  FaExclamationTriangle,
  FaCamera,
  FaImages,
  FaTimes
} from "react-icons/fa";

const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace("/api", "");

function Biens() {
  const [biens, setBiens] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [message, setMessage] = useState({ text: "", type: "" });

  const [form, setForm] = useState({
    titre: "",
    adresse: "",
    ville: "",
    quartier: "",
    type: "Maison",
    chambres: "0",
    prix: "",
    description: "",
    statut: "Disponible"
  });

  // Nettoyage et création des URLs de prévisualisation
  useEffect(() => {
    if (!selectedFiles.length) {
      setPreviews([]);
      return;
    }
    const objectUrls = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreviews(objectUrls);

    return () => objectUrls.forEach((url) => URL.revokeObjectURL(url));
  }, [selectedFiles]);

  const loadBiens = useCallback(async () => {
    try {
      const data = await getBiens(true);
      setBiens(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erreur chargement biens :", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadCategories = useCallback(async () => {
    try {
      const res = await api.get("/categories");
      if (res.data && res.data.length > 0) {
        setCategories(res.data);
      }
    } catch (err) {
      console.error("Erreur chargement catégories:", err);
    }
  }, []);

  useEffect(() => {
    loadBiens();
    loadCategories();
  }, [loadBiens, loadCategories]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    if (newFiles.length > 0) {
      setSelectedFiles((prev) => [...prev, ...newFiles]);
    }
    e.target.value = "";
  };

  const handleRemoveFile = (indexToRemove) => {
    setSelectedFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });
    try {
      const formData = new FormData();
      formData.append("titre", form.titre);
      formData.append("adresse", form.adresse);
      formData.append("ville", form.ville);
      formData.append("quartier", form.quartier);
      formData.append("type", form.type);
      formData.append("chambres", Number(form.chambres || 0));
      formData.append("prix", Number(form.prix));
      formData.append("description", form.description);
      formData.append("statut", (form.statut || "disponible").toLowerCase());
      formData.append("status", (form.statut || "disponible").toLowerCase());

      selectedFiles.forEach((file) => {
        formData.append("images", file);
      });

      await createBien(formData);

      setForm({
        titre: "",
        adresse: "",
        ville: "",
        quartier: "",
        type: "Maison",
        chambres: "0",
        prix: "",
        description: "",
        statut: "Disponible"
      });
      setSelectedFiles([]);

      await loadBiens();
      setMessage({ text: "Bien immobilier ajouté avec succès !", type: "success" });
    } catch (error) {
      console.error("Erreur création bien :", error);
      setMessage({
        text: error.response?.data?.message || "Erreur lors de la création du bien",
        type: "error"
      });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce bien immobilier ?")) {
      try {
        await deleteBien(id);
        await loadBiens();
        setMessage({ text: "Bien supprimé avec succès.", type: "success" });
      } catch (error) {
        console.error("Erreur suppression bien :", error);
        setMessage({
          text: error.response?.data?.message || "Erreur de suppression",
          type: "error"
        });
      }
    }
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
          <FaHome className="text-blue-600" /> Gestion du Parc Immobilier
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-1">
          Publiez et administrer l'ensemble de vos logements, bureaux et terrains.
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
        {/* FORMULAIRE */}
        <div>
          <Card title="Ajouter un bien" className="shadow-sm border border-slate-100 rounded-3xl">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Titre du bien"
                name="titre"
                value={form.titre}
                onChange={handleChange}
                required
                placeholder="Ex: Appt Standing 3 Pièces"
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Ville"
                  name="ville"
                  value={form.ville}
                  onChange={handleChange}
                  required
                  placeholder="Ex: Kinshasa"
                />
                <Input
                  label="Quartier"
                  name="quartier"
                  value={form.quartier}
                  onChange={handleChange}
                  placeholder="Ex: Gombe"
                />
              </div>

              <Input
                label="Adresse complète"
                name="adresse"
                value={form.adresse}
                onChange={handleChange}
                required
                placeholder="Ex: 15 Av. de la Justice"
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Type de bien
                  </label>
                  <select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50/50 text-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                  >
                    {categories.length > 0 ? (
                      categories.map((c) => (
                        <option key={c._id || c.nom} value={c.nom}>
                          {c.nom}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="Maison">Maison</option>
                        <option value="Appartement">Appartement</option>
                        <option value="Studio">Studio</option>
                        <option value="Bureau">Bureau</option>
                        <option value="Boutique">Boutique</option>
                        <option value="Terrain">Terrain</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Statut
                  </label>
                  <select
                    name="statut"
                    value={form.statut}
                    onChange={handleChange}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50/50 text-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                  >
                    <option value="Disponible">Disponible</option>
                    <option value="Occupé">Occupé</option>
                    <option value="Réservé">Réservé</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Chambres"
                  name="chambres"
                  type="number"
                  value={form.chambres}
                  onChange={handleChange}
                />
                <Input
                  label="Loyer Mensuel ($)"
                  name="prix"
                  type="number"
                  value={form.prix}
                  onChange={handleChange}
                  required
                  placeholder="Ex: 850"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Photos du bien
                  </label>
                  {selectedFiles.length > 0 && (
                    <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                      {selectedFiles.length} photo{selectedFiles.length > 1 ? "s" : ""} sélectionnée{selectedFiles.length > 1 ? "s" : ""}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                  {/* Option 1: Appareil Photo Mobile */}
                  <div
                    onClick={() => document.getElementById("camera-upload-input")?.click()}
                    className="border-2 border-dashed border-slate-200 hover:border-blue-500 rounded-2xl p-3.5 bg-slate-50/50 hover:bg-blue-50/30 transition cursor-pointer text-center group flex items-center gap-3"
                  >
                    <input
                      id="camera-upload-input"
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <div className="p-2.5 bg-white shadow-xs rounded-xl border border-slate-200 group-hover:border-blue-300 shrink-0">
                      <FaCamera className="text-base text-blue-600" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-bold text-slate-800 group-hover:text-blue-600">
                        Prendre une photo
                      </p>
                      <p className="text-[10px] text-slate-400">Caméra smartphone</p>
                    </div>
                  </div>

                  {/* Option 2: Galerie Multi-Photos */}
                  <div
                    onClick={() => document.getElementById("gallery-upload-input")?.click()}
                    className="border-2 border-dashed border-slate-200 hover:border-indigo-500 rounded-2xl p-3.5 bg-slate-50/50 hover:bg-indigo-50/30 transition cursor-pointer text-center group flex items-center gap-3"
                  >
                    <input
                      id="gallery-upload-input"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <div className="p-2.5 bg-white shadow-xs rounded-xl border border-slate-200 group-hover:border-indigo-300 shrink-0">
                      <FaImages className="text-base text-indigo-600" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-bold text-slate-800 group-hover:text-indigo-600">
                        Ouvrir la galerie
                      </p>
                      <p className="text-[10px] text-slate-400">Multiples fichiers</p>
                    </div>
                  </div>
                </div>

                {previews.length > 0 && (
                  <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {previews.map((url, idx) => (
                      <div
                        key={idx}
                        className="relative group rounded-xl overflow-hidden aspect-square border border-slate-200 bg-slate-100 shadow-xs"
                      >
                        <img
                          src={url}
                          alt={`Aperçu ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                          #{idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveFile(idx);
                          }}
                          className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full text-xs shadow-md hover:bg-red-700 transition cursor-pointer"
                          title="Supprimer cette photo"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Décrivez les atouts du bien..."
                  rows="4"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 bg-slate-50/50 text-slate-800 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                />
              </div>

              <Button type="submit" className="w-full flex justify-center gap-2 py-3 rounded-2xl mt-4 font-bold">
                <FaPlus /> Publier le bien
              </Button>
            </form>
          </Card>
        </div>

        {/* LISTE */}
        <div className="lg:col-span-2">
          <Card title="Portefeuille des biens" className="shadow-sm border border-slate-100 rounded-3xl">
            {loading ? (
              <div className="flex justify-center items-center h-48">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
              </div>
            ) : biens.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <FaHome className="text-4xl text-slate-300 mx-auto mb-2" />
                <p className="font-semibold text-slate-600">Aucun bien immobilier enregistré</p>
                <p className="text-xs text-slate-400 mt-1">Utilisez le formulaire pour ajouter votre premier bien.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {biens.map((bien) => {
                  const hasPhoto = bien.images && bien.images.length > 0;
                  const firstPhoto = hasPhoto ? bien.images[0] : null;

                  return (
                    <div
                      key={bien._id}
                      className="border border-slate-100 rounded-3xl overflow-hidden bg-white shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                    >
                      {/* Image / Thumbnail */}
                      <div className="h-48 bg-slate-100 relative flex items-center justify-center text-slate-400 overflow-hidden">
                        {firstPhoto ? (
                          <img
                            crossOrigin="anonymous"
                            src={
                              firstPhoto.startsWith("http")
                                ? firstPhoto
                                : `${API_BASE_URL}${firstPhoto}`
                            }
                            alt={bien.titre}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex flex-col items-center gap-1.5">
                            <FaHome className="text-4xl text-slate-300" />
                            <span className="text-xs text-slate-400">Aucune photo</span>
                          </div>
                        )}

                        <span className="absolute top-3 left-3 bg-blue-600 text-white text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-1 rounded-full shadow-xs">
                          {bien.type}
                        </span>

                        <span
                          className={`absolute top-3 right-3 text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-1 rounded-full shadow-xs ${
                            bien.statut === "Disponible" || bien.statut === "disponible"
                              ? "bg-emerald-500 text-white"
                              : "bg-amber-500 text-white"
                          }`}
                        >
                          {bien.statut || "Disponible"}
                        </span>

                        {hasPhoto && bien.images.length > 1 && (
                          <span className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                            <FaImages className="text-blue-400" /> {bien.images.length} photos
                          </span>
                        )}
                      </div>

                      {/* Details */}
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div className="space-y-2">
                          <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                            <FaBuilding className="text-blue-600 text-base" />
                            {bien.titre || "Sans titre"}
                          </h3>

                          <div className="text-slate-500 text-xs space-y-1">
                            <p className="flex items-center gap-1.5">
                              <FaMapMarkerAlt className="text-slate-400" />
                              {bien.adresse || "Adresse non renseignée"}
                            </p>
                            <p className="pl-5 text-slate-400">
                              {bien.quartier ? `${bien.quartier}, ` : ""}
                              {bien.ville || ""}
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-600">
                            {bien.chambres > 0 ? (
                              <span className="flex items-center gap-1 font-semibold">
                                <FaBed className="text-slate-400" /> {bien.chambres} ch.
                              </span>
                            ) : <span></span>}

                            <span className="flex items-center gap-1 text-sm font-extrabold text-blue-600">
                              <FaDollarSign />
                              {Number(bien.prix || 0).toLocaleString("fr-FR")} $/mois
                            </span>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 flex justify-end">
                          <button
                            onClick={() => handleDelete(bien._id)}
                            className="p-2.5 text-red-500 hover:text-white rounded-xl bg-red-50 hover:bg-red-600 transition duration-150 cursor-pointer border border-red-100 hover:border-red-600"
                            title="Supprimer ce bien"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>
      </div>
    </Layout>
  );
}

export default Biens;