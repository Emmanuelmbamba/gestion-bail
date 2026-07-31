import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";

export default function ReservationForm({ bienId }) {
  const { user } = useContext(AuthContext);
  const [form, setForm] = useState({
    dateVisite: "",
    message: ""
  });

  const change = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const envoyer = async (e) => {
    e.preventDefault();
    try {
      await api.post("/visites", {
        ...form,
        bien: bienId
      });
      alert("Votre demande de visite a bien été envoyée avec succès !");
      setForm({
        dateVisite: "",
        message: ""
      });
    } catch (error) {
      console.error("Erreur envoi visite:", error);
      alert(error.response?.data?.message || "Erreur lors de l'envoi de la demande de visite.");
    }
  };

  if (!user) {
    return (
      <div className="bg-white shadow-sm border border-slate-100 rounded-2xl p-6 text-center">
        <h2 className="text-xl font-bold text-slate-800 mb-3">Planifier une visite 📅</h2>
        <p className="text-slate-500 text-sm mb-5">
          Vous devez avoir un compte et être connecté pour envoyer une demande de visite pour ce bien.
        </p>
        <Link
          to="/login"
          className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-center py-3 rounded-xl transition duration-150 text-sm shadow-sm"
        >
          Se connecter
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={envoyer}
      className="bg-white shadow-sm border border-slate-100 rounded-2xl p-6 space-y-4"
    >
      <div>
        <h2 className="text-xl font-bold text-slate-800">Planifier une visite 📅</h2>
        <p className="text-slate-500 text-xs mt-1">Choisissez une date et envoyez un message au propriétaire</p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Date de visite souhaitée
        </label>
        <input
          type="date"
          name="dateVisite"
          required
          value={form.dateVisite}
          className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-sm"
          onChange={change}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Message ou précision
        </label>
        <textarea
          name="message"
          placeholder="Bonjour, je souhaiterais visiter ce bien..."
          value={form.message}
          className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-sm"
          rows="4"
          onChange={change}
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 transition-all duration-200 text-sm cursor-pointer"
      >
        Envoyer la demande
      </button>
    </form>
  );
}