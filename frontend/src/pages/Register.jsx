import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FaBuilding, FaUser, FaEnvelope, FaLock, FaUserTag, FaUserPlus, FaArrowLeft } from "react-icons/fa";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    password: "",
    role: "locataire"
  });

  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setSuccess(false);
    setLoading(true);

    try {
     const response = await axios.post(
  "https://gestion-bail.onrender.com/api/auth/register",
  formData
);

      setSuccess(true);
      setMessage(response.data.message || "Compte créé avec succès ! Redirection vers la page de connexion...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Une erreur est survenue lors de la création du compte."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-slate-900 via-indigo-950 to-blue-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-20 pointer-events-none"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500 rounded-full blur-3xl opacity-20 pointer-events-none"></div>

      <div className="relative bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl max-w-md w-full p-8 border border-slate-100/50">
        {/* Back Link */}
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 mb-6 transition-colors duration-150">
          <FaArrowLeft /> Retour à l'accueil
        </Link>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white mb-4 shadow-lg shadow-blue-500/20">
            <FaBuilding className="text-3xl" />
          </div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Inscription</h1>
          <p className="text-slate-500 text-xs mt-1.5 font-medium">Créez votre compte en quelques secondes</p>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-2xl border text-xs font-semibold ${
            success 
              ? "bg-green-50 border-green-200 text-green-700" 
              : "bg-red-50 border-red-200 text-red-700"
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Nom complet
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                <FaUser />
              </span>
              <input
                type="text"
                name="nom"
                required
                placeholder="Jean Dupont"
                value={formData.nom}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all duration-200 text-sm text-slate-800 bg-slate-50/50 hover:bg-slate-50 font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Adresse Email
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                <FaEnvelope />
              </span>
              <input
                type="email"
                name="email"
                required
                placeholder="jean@exemple.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all duration-200 text-sm text-slate-800 bg-slate-50/50 hover:bg-slate-50 font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Mot de passe
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                <FaLock />
              </span>
              <input
                type="password"
                name="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all duration-200 text-sm text-slate-800 bg-slate-50/50 hover:bg-slate-50 font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Type de compte (Rôle)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                <FaUserTag />
              </span>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all duration-200 text-sm text-slate-700 bg-slate-50/50 hover:bg-slate-50 appearance-none cursor-pointer font-bold"
              >
                <option value="locataire">Locataire</option>
                <option value="bailleur">Bailleur</option>
                <option value="agent">Agent</option>
                <option value="admin">Administrateur</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-md shadow-blue-500/10 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:translate-y-0 mt-2"
          >
            {loading ? "Création..." : (
              <>
                <FaUserPlus /> S'inscrire
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-slate-500 font-semibold">
          Vous possédez déjà un compte ?{" "}
          <Link to="/login" className="text-blue-600 hover:text-indigo-600 hover:underline font-bold transition-colors">
            Se connecter
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;