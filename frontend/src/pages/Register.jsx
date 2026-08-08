import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  FaBuilding,
  FaUser,
  FaEnvelope,
  FaLock,
  FaUserTag,
  FaUserPlus,
  FaArrowLeft,
  FaPhone,
  FaCheckCircle,
  FaSms,
  FaRedo
} from "react-icons/fa";

function Register() {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const [step, setStep] = useState("register"); // 'register' | 'verify'

  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    telephone: "",
    password: "",
    role: "locataire"
  });

  const [smsCode, setSmsCode] = useState("");
  const [demoSmsCode, setDemoSmsCode] = useState("");
  const [targetIdentifier, setTargetIdentifier] = useState("");

  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setSuccess(false);
    setLoading(true);

    try {
      const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

      const response = await axios.post(
        `${API}/auth/register`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 30000,
        }
      );

      console.log("Inscription réussie :", response.data);

      setSuccess(true);
      setMessage(response.data.message || "Compte créé. Saisissez le code SMS reçu pour activer votre compte.");
      
      const sentCode = response.data.smsCode || "";
      const phoneOrEmail = response.data.telephone || formData.telephone || formData.email;
      
      setDemoSmsCode(sentCode);
      setTargetIdentifier(phoneOrEmail);
      
      // Passage à l'étape de saisie du code SMS
      setStep("verify");

    } catch (error) {
      console.error("Erreur Inscription :", error);

      if (error.response) {
        setMessage(
          error.response.data.message ||
          JSON.stringify(error.response.data)
        );
      } else if (error.request) {
        setMessage("Le serveur ne répond pas. Veuillez vérifier votre connexion.");
      } else {
        setMessage(error.message);
      }

      setSuccess(false);

    } finally {
      setLoading(false);
    }
  };

  const handleVerifySmsSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setSuccess(false);
    setLoading(true);

    try {
      const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

      const response = await axios.post(
        `${API}/auth/verify-sms`,
        {
          identifier: targetIdentifier || formData.telephone || formData.email,
          code: smsCode
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Vérification SMS réussie :", response.data);

      setSuccess(true);
      setMessage("Compte activé avec succès par SMS ! Connexion en cours...");

      if (response.data.token && response.data.user) {
        localStorage.setItem("token", response.data.token);
        setUser(response.data.user);
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      } else {
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }

    } catch (error) {
      console.error("Erreur validation SMS :", error);
      setSuccess(false);
      setMessage(
        error.response?.data?.message ||
        "Erreur lors de la validation du code SMS. Veuillez réessayer."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendSms = async () => {
    setMessage("");
    try {
      const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      const res = await axios.post(`${API}/auth/resend-sms`, {
        identifier: targetIdentifier || formData.telephone || formData.email
      });
      setSuccess(true);
      setMessage(res.data.message || "Un nouveau code SMS vous a été envoyé !");
      if (res.data.smsCode) {
        setDemoSmsCode(res.data.smsCode);
      }
    } catch (err) {
      setSuccess(false);
      setMessage(err.response?.data?.message || "Impossible de renvoyer le code pour le moment.");
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

        {step === "register" ? (
          <>
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white mb-4 shadow-lg shadow-blue-500/20">
                <FaBuilding className="text-3xl" />
              </div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight">Inscription</h1>
              <p className="text-slate-500 text-xs mt-1.5 font-medium">Créez votre compte et confirmez par code SMS</p>
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

            <form onSubmit={handleRegisterSubmit} className="space-y-4">
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
                  Numéro de Téléphone (Pour confirmation SMS)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                    <FaPhone />
                  </span>
                  <input
                    type="tel"
                    name="telephone"
                    required
                    placeholder="+243 812 345 678"
                    value={formData.telephone}
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
                {loading ? "Envoi du SMS..." : (
                  <>
                    <FaUserPlus /> S'inscrire & Recevoir le SMS
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
          </>
        ) : (
          /* ==================================================== */
          /* ÉTAPE DE VALIDATION DU CODE SMS A 6 CHIFFRES        */
          /* ==================================================== */
          <>
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white mb-3 shadow-lg shadow-emerald-500/20">
                <FaSms className="text-3xl" />
              </div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight">Confirmation par SMS</h1>
              <p className="text-slate-500 text-xs mt-1 font-medium">
                Saisissez le code à 6 chiffres transmis au <strong className="text-slate-700">{targetIdentifier}</strong>
              </p>
            </div>

            {demoSmsCode && (
              <div className="mb-6 p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold text-center flex flex-col items-center gap-1 shadow-xs">
                <span className="text-[10px] uppercase font-extrabold tracking-wider text-blue-500">📲 Notification SMS Reçue</span>
                <span className="text-lg font-black tracking-widest text-blue-700 bg-white px-4 py-1.5 rounded-xl border border-blue-200 shadow-inner">
                  {demoSmsCode}
                </span>
                <span className="text-[10px] text-blue-600 mt-0.5">Code de validation prêt à être saisi</span>
              </div>
            )}

            {message && (
              <div className={`mb-6 p-4 rounded-2xl border text-xs font-semibold ${
                success 
                  ? "bg-green-50 border-green-200 text-green-700" 
                  : "bg-red-50 border-red-200 text-red-700"
              }`}>
                {message}
              </div>
            )}

            <form onSubmit={handleVerifySmsSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 text-center">
                  Code de confirmation (6 chiffres)
                </label>
                <input
                  type="text"
                  maxLength="6"
                  required
                  placeholder="123456"
                  value={smsCode}
                  onChange={(e) => setSmsCode(e.target.value.replace(/\D/g, ""))}
                  className="w-full text-center tracking-[0.5em] text-2xl font-mono py-3 rounded-2xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:outline-none transition-all duration-200 text-slate-900 bg-slate-50 font-black"
                />
              </div>

              <button
                type="submit"
                disabled={loading || smsCode.length < 6}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 hover:shadow-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Vérification..." : (
                  <>
                    <FaCheckCircle /> Valider mon compte
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => setStep("register")}
                className="text-slate-400 hover:text-slate-600 font-semibold cursor-pointer"
              >
                ← Modifier le numéro
              </button>
              <button
                type="button"
                onClick={handleResendSms}
                className="text-blue-600 hover:text-indigo-600 font-bold flex items-center gap-1 cursor-pointer"
              >
                <FaRedo className="text-[10px]" /> Renvoyer le code SMS
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Register;