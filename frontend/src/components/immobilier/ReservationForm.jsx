import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";
import { FaCalendarAlt, FaPaperPlane, FaCheckCircle, FaExclamationCircle, FaLock } from "react-icons/fa";

export default function ReservationForm({ bienId }) {
  const { user } = useContext(AuthContext);
  const [form, setForm] = useState({
    dateVisite: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ text: "", type: "" });

  const change = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const envoyer = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage({ text: "", type: "" });

    try {
      await api.post("/visites", {
        ...form,
        bien: bienId
      });
      setStatusMessage({
        text: "Votre demande de visite a bien été transmise au propriétaire !",
        type: "success"
      });
      setForm({
        dateVisite: "",
        message: ""
      });
    } catch (error) {
      console.error("Erreur envoi visite:", error);
      setStatusMessage({
        text: error.response?.data?.message || "Erreur lors de l'envoi de la demande.",
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-white/80 backdrop-blur-md shadow-lg border border-slate-100 rounded-3xl p-6 text-center space-y-4">
        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto text-xl shadow-xs">
          <FaLock />
        </div>
        <div>
          <h3 className="text-lg font-extrabold text-slate-800">Planifier une visite</h3>
          <p className="text-slate-500 text-xs mt-1 leading-relaxed">
            Connectez-vous à votre compte pour planifier une visite guidée avec le propriétaire.
          </p>
        </div>
        <Link
          to="/login"
          className="block w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-center py-3 rounded-2xl shadow-md shadow-blue-500/20 transition-all text-xs uppercase tracking-wider"
        >
          Se connecter
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-xl shadow-slate-200/50 border border-slate-100 rounded-3xl p-6 space-y-5">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
        <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl text-lg">
          <FaCalendarAlt />
        </div>
        <div>
          <h3 className="text-lg font-extrabold text-slate-800">Planifier une visite</h3>
          <p className="text-slate-400 text-xs">Directement avec le gestionnaire</p>
        </div>
      </div>

      {statusMessage.text && (
        <div
          className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-2.5 transition ${
            statusMessage.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {statusMessage.type === "success" ? (
            <FaCheckCircle className="text-emerald-600 text-base shrink-0" />
          ) : (
            <FaExclamationCircle className="text-red-600 text-base shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      <form onSubmit={envoyer} className="space-y-4">
        <div>
          <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5">
            Date de visite souhaitée
          </label>
          <input
            type="date"
            name="dateVisite"
            required
            value={form.dateVisite}
            className="w-full border border-slate-200 rounded-2xl px-4 py-3 bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-xs font-semibold"
            onChange={change}
          />
        </div>

        <div>
          <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5">
            Message ou précisions
          </label>
          <textarea
            name="message"
            placeholder="Bonjour, je souhaite visiter ce bien..."
            value={form.message}
            className="w-full border border-slate-200 rounded-2xl px-4 py-3 bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-xs font-semibold"
            rows="4"
            onChange={change}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold py-3.5 rounded-2xl shadow-lg shadow-blue-500/25 transition-all text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            "Envoi en cours..."
          ) : (
            <>
              <FaPaperPlane /> Envoyer la demande
            </>
          )}
        </button>
      </form>
    </div>
  );
}