import { useState } from "react";
import api from "../api/axios";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPaperPlane,
  FaCheckCircle,
  FaExclamationCircle
} from "react-icons/fa";

export default function Contact() {
  const [form, setForm] = useState({
    nom: "",
    email: "",
    message: ""
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const contacts = [
    {
      icon: <FaPhoneAlt />,
      title: "Téléphone",
      values: ["+243 818 451 340", "+243 997 300 932"],
      color: "emerald"
    },
    {
      icon: <FaEnvelope />,
      title: "Email",
      values: ["contact@gestion-bail.com", "emmanuel.mbamba87@gmail.com"],
      color: "blue"
    },
    {
      icon: <FaMapMarkerAlt />,
      title: "Adresse",
      values: ["Kinshasa, République Démocratique du Congo"],
      color: "indigo"
    }
  ];

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    try {
      const response = await api.post("/contact", form);
      setSuccess(response.data.message || "Message envoyé avec succès !");
      setForm({ nom: "", email: "", message: "" });
    } catch (err) {
      console.error("ERREUR CONTACT:", err.response?.data);
      setError(
        err.response?.data?.message || "Erreur lors de l'envoi du message."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 max-w-6xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600 bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-100/60">
          Contact
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-4">
          Contactez Gestion-Bail
        </h1>
        <p className="text-slate-500 text-sm sm:text-base mt-2">
          Notre équipe est à votre disposition pour vous accompagner dans la gestion de vos baux et opportunités.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {contacts.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 text-center hover:shadow-lg transition duration-300"
          >
            <div className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center text-2xl mb-4 bg-blue-50 text-blue-600 shadow-xs">
              {item.icon}
            </div>
            <h3 className="font-extrabold text-slate-800 text-lg mb-2">{item.title}</h3>
            {item.values.map((v, i) => (
              <p key={i} className="text-xs sm:text-sm text-slate-500 font-medium">
                {v}
              </p>
            ))}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-10 max-w-3xl mx-auto">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 text-center mb-6">
          Envoyez-nous un message
        </h2>

        {success && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 text-sm font-semibold">
            <FaCheckCircle className="text-emerald-600 text-lg" />
            <span>{success}</span>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 flex items-center gap-3 text-sm font-semibold">
            <FaExclamationCircle className="text-red-600 text-lg" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Nom complet</label>
            <input
              type="text"
              name="nom"
              value={form.nom}
              onChange={handleChange}
              placeholder="Ex: Jean Dupont"
              required
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Adresse Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Ex: jean.dupont@gmail.com"
              required
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Votre Message</label>
            <textarea
              name="message"
              rows="5"
              value={form.message}
              onChange={handleChange}
              placeholder="Décrivez votre demande..."
              required
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
            />
          </div>

          <button
            disabled={loading}
            type="submit"
            className="w-full py-3.5 px-6 rounded-2xl font-extrabold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <FaPaperPlane />
            {loading ? "Envoi en cours..." : "Envoyer le message"}
          </button>
        </form>
      </div>
    </div>
  );
}