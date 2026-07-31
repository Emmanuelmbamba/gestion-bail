import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaBuilding, FaEnvelope, FaPaperPlane, FaArrowLeft } from "react-icons/fa";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/auth/forgot-password", { email });
      setMessage(response.data.message || "E-mail envoyé avec succès.");
    } catch (err) {
      setError(err.response?.data?.message || "Une erreur est survenue lors de la demande.");
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
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white mb-4 shadow-lg shadow-blue-500/20">
            <FaBuilding className="text-3xl" />
          </div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Mot de passe oublié</h1>
          <p className="text-slate-500 text-xs mt-1.5 font-medium">Saisissez votre email pour réinitialiser votre compte</p>
        </div>

        {message && (
          <div className="mb-6 p-4 rounded-2xl bg-green-50 border border-green-200 text-green-700 text-xs font-semibold">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Adresse Email
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                <FaEnvelope />
              </span>
              <input
                type="email"
                required
                placeholder="nom@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all duration-200 text-sm text-slate-800 bg-slate-50/50 hover:bg-slate-50 font-semibold"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-md shadow-blue-500/10 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:translate-y-0"
          >
            {loading ? "Envoi en cours..." : (
              <>
                <FaPaperPlane /> Envoyer la demande
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-slate-500 font-semibold">
          <Link to="/login" className="inline-flex items-center gap-2 text-blue-600 hover:text-indigo-600 hover:underline font-bold transition-colors">
            <FaArrowLeft /> Retour à la connexion
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
