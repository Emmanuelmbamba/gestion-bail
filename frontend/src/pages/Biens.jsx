  import { useEffect, useState, useCallback } from "react";
  import Layout from "../components/layout/Layout";
  import Card from "../components/ui/Card";
  import Button from "../components/ui/Button";
  import Input from "../components/ui/Input";
  import { getBiens, createBien, deleteBien } from "../services/bienService";
  import { FaHome, FaPlus, FaMapMarkerAlt, FaBuilding, FaBed, FaDollarSign, FaTrash } from "react-icons/fa";
const API_BASE_URL = ( import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace("/api", "");

  function Biens() {
    const [biens, setBiens] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedFiles, setSelectedFiles] = useState([]);

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

    useEffect(() => {
      Promise.resolve().then(() => {
        loadBiens();
      });
    }, [loadBiens]);

    const handleChange = (e) => {
      setForm({
        ...form,
        [e.target.name]: e.target.value
      });
    };

    const handleFileChange = (e) => {
      setSelectedFiles(Array.from(e.target.files));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
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
        formData.append("statut", form.statut);

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
        
        const fileInput = document.getElementById("file-upload-input");
        if (fileInput) fileInput.value = "";

        await loadBiens();
        alert("Bien immobilier ajouté avec succès !");
      } catch (error) {
        console.error("Erreur création bien :", error);
        alert(error.response?.data?.message || "Erreur lors de la création");
      }
    };

    const handleDelete = async (id) => {
      if (window.confirm("Êtes-vous sûr de vouloir supprimer ce bien immobilier ?")) {
        try {
          await deleteBien(id);
          await loadBiens();
          alert("Bien supprimé avec succès.");
        } catch (error) {
          console.error("Erreur suppression bien :", error);
          alert(error.response?.data?.message || "Erreur de suppression");
        }
      }
    };

    return (
      <Layout>
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
            Gestion des biens immobiliers 🏠
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Ajoutez et gérez vos maisons, appartements, studios, bureaux, boutiques et terrains
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* FORMULAIRE */}
          <div>
            <Card title="Ajouter un bien" className="shadow-sm border border-slate-100">
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Titre"
                  name="titre"
                  value={form.titre}
                  onChange={handleChange}
                  required
                  placeholder="Ex: Villa moderne"
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Ville"
                    name="ville"
                    value={form.ville}
                    onChange={handleChange}
                    required
                    placeholder="Ville"
                  />
                  <Input
                    label="Quartier"
                    name="quartier"
                    value={form.quartier}
                    onChange={handleChange}
                    placeholder="Quartier"
                  />
                </div>

                <Input
                  label="Adresse"
                  name="adresse"
                  value={form.adresse}
                  onChange={handleChange}
                  required
                  placeholder="Adresse du bien"
                />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      Type de bien
                    </label>
                    <select
                      name="type"
                      value={form.type}
                      onChange={handleChange}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                    >
                      <option value="Maison">Maison</option>
                      <option value="Appartement">Appartement</option>
                      <option value="Studio">Studio</option>
                      <option value="Bureau">Bureau</option>
                      <option value="Boutique">Boutique</option>
                      <option value="Terrain">Terrain</option>
                    </select>
                    
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      Disponibilité
                    </label>
                    <select
                      name="statut"
                      value={form.statut}
                      onChange={handleChange}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                    >
                      <option value="Disponible">Disponible</option>
                      <option value="Occupé">Occupé</option>
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
                    label="Prix / Loyer ($)"
                    name="prix"
                    type="number"
                    value={form.prix}
                    onChange={handleChange}
                    required
                    placeholder="Ex: 850"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Photos du bien (Fichiers images)
                  </label>
                  <input
                    id="file-upload-input"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-sm"
                  />
                </div>
<div>
  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
    Description du bien
  </label>

  <textarea
    name="description"
    value={form.description}
    onChange={handleChange}
    placeholder="Décrivez le bien (nombre de chambres, emplacement, équipements...)"
    rows="5"
    className="w-full border border-slate-200 rounded-lg px-3 py-2 bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
  />
</div>
                <Button type="submit" className="w-full flex justify-center gap-2 py-3 rounded-xl mt-6">
                  <FaPlus /> Ajouter le bien
                </Button>
              </form>
            </Card>
          </div>

          {/* LISTE */}
          <div className="lg:col-span-2">
            <Card title="Liste des biens immobiliers" className="shadow-sm border border-slate-100">
              {loading ? (
                <div className="flex justify-center items-center h-48">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
                </div>
              ) : biens.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  Aucun bien enregistré
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {biens.map((bien) => {
                    const hasPhoto = bien.images && bien.images.length > 0;
                    const firstPhoto = hasPhoto ? bien.images[0] : null;

                    return (
                      <div
                        key={bien._id}
                        className="border border-slate-100 rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                      >
                        {/* Image / Thumbnail */}
                        <div className="h-44 bg-slate-100 relative flex items-center justify-center text-slate-400 overflow-hidden">
                          {firstPhoto ? (
                            <img
  crossOrigin="anonymous"
  src={
    firstPhoto
      ? firstPhoto.startsWith("http")
        ? firstPhoto
        : `${API_BASE_URL}${firstPhoto}`
      : ""
  }
  alt={bien.titre}
  className="w-full h-full object-cover"
/>
                          ) : (
                            <div className="flex flex-col items-center gap-2">
                              <FaHome className="text-5xl text-slate-300" />
                              <span className="text-xs text-slate-400">Aucune photo</span>
                            </div>
                          )}
                          {/* Type Badge */}
                          <span className="absolute top-3 left-3 bg-blue-600 text-white text-[10px] font-bold tracking-wider uppercase px-2 py-1 rounded shadow-sm">
                            {bien.type}
                          </span>
                          {/* Status Badge */}
                          <span className={`absolute top-3 right-3 text-[10px] font-bold tracking-wider uppercase px-2 py-1 rounded shadow-sm ${
                            bien.statut === "Disponible" 
                              ? "bg-green-500 text-white" 
                              : "bg-red-500 text-white"
                          }`}>
                            {bien.statut || "Disponible"}
                          </span>
                        </div>

                        {/* Content */}
                        <div className="p-5 flex-1 flex flex-col justify-between">
                          <div className="space-y-2">
                            <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                              <FaBuilding className="text-blue-600 text-base" />
                              {bien.titre || "Sans titre"}
                            </h3>

                            <div className="text-slate-500 text-sm space-y-1">
                              <p className="flex items-center gap-1.5">
                                <FaMapMarkerAlt className="text-slate-400 text-xs" />
                                {bien.adresse || "Adresse non fournie"}
                              </p>
                              <p className="pl-5 text-xs text-slate-400">
                                {bien.quartier ? `${bien.quartier}, ` : ""}{bien.ville || "Ville inconnue"}
                              </p>
                            </div>

                            <div className="flex gap-4 pt-2 text-sm text-slate-600">
                              {bien.chambres > 0 && (
                                <span className="flex items-center gap-1.5">
                                  <FaBed className="text-slate-400" /> {bien.chambres} ch.
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <FaDollarSign className="text-slate-400" />
                                <strong>{Number(bien.prix || 0).toLocaleString("fr-FR")} $</strong>
                              </span>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="mt-5 pt-3 border-t border-slate-50 flex justify-end">
                            <button
                              onClick={() => handleDelete(bien._id)}
                              className="p-2.5 text-red-500 hover:text-white rounded-xl bg-red-50 hover:bg-red-600 transition-all duration-150 cursor-pointer border border-red-100 hover:border-red-600"
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