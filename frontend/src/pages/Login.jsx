import { useState, useContext } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaEnvelope, FaLock, FaSignInAlt, FaArrowLeft, FaSms, FaCheckCircle, FaRedo } from "react-icons/fa";
import Logo from "../components/common/Logo";

function Login() {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [needsSmsVerify, setNeedsSmsVerify] = useState(false);
  const [smsIdentifier, setSmsIdentifier] = useState("");
  const [smsCode, setSmsCode] = useState("");

  const [message, setMessage] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
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
    setSuccessMsg("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", formData);
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      setUser(user);

      navigate("/dashboard");
    } catch (error) {
      console.error("Erreur de connexion :", error);

      if (error.response?.data?.requireSmsVerification) {
        setNeedsSmsVerify(true);
        setSmsIdentifier(error.response.data.identifier || formData.email);
        setMessage("Votre compte requiert une validation par SMS. Entrez le code reçu.");
      } else {
        setMessage(
          error.response?.data?.message ||
          error.message ||
          "Erreur de connexion. Veuillez vérifier vos identifiants."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySms = async (e) => {
    e.preventDefault();
    setMessage("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const res = await api.post("/auth/verify-sms", {
        identifier: smsIdentifier || formData.email,
        code: smsCode
      });

      setSuccessMsg("Compte validé avec succès par SMS ! Redirection...");
      if (res.data.token && res.data.user) {
        localStorage.setItem("token", res.data.token);
        setUser(res.data.user);
        setTimeout(() => {
          navigate("/dashboard");
        }, 1200);
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Code SMS incorrect ou expiré.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendSms = async () => {
    try {
      const res = await api.post("/auth/resend-sms", {
        identifier: smsIdentifier || formData.email
      });
      setSuccessMsg(res.data.message || "Un nouveau code SMS vous a été envoyé !");
    } catch (err) {
      setMessage(err.response?.data?.message || "Erreur lors du renvoi du code SMS.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-slate-900 via-indigo-950 to-blue-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-20 pointer-events-none"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500 rounded-full blur-3xl opacity-20 pointer-events-none"></div>

      <div className="relative bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl max-w-md w-full p-8 border border-slate-100/50">
        {/* Back Link to Home */}
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 mb-6 transition-colors duration-150">
          <FaArrowLeft /> Retour à l'accueil
        </Link>

        {!needsSmsVerify ? (
          <>
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <Logo size={70} />
              </div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight">Connexion</h1>
              <p className="text-slate-500 text-sm mt-2">Bienvenue sur MKTech Bail</p>
            </div>

            {message && (
              <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Email ou Numéro de Téléphone
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                    <FaEnvelope />
                  </span>
                  <input
                    type="text"
                    name="email"
                    required
                    placeholder="Email ou téléphone (+243...)"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all duration-200 text-sm text-slate-800 bg-slate-50/50 hover:bg-slate-50 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
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
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all duration-200 text-sm text-slate-800 bg-slate-50/50 hover:bg-slate-50 font-semibold"
                  />
                </div>
              </div>

              <div className="flex justify-end text-xs">
                <Link to="/forgot-password" className="text-blue-600 hover:text-indigo-600 hover:underline font-bold transition-colors">
                  Mot de passe oublié ?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-md shadow-blue-500/10 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:translate-y-0"
              >
                {loading ? "Connexion..." : (
                  <>
                    <FaSignInAlt /> Se connecter
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center text-xs text-slate-500 font-semibold">
              Pas encore de compte ?{" "}
              <Link to="/register" className="text-blue-600 hover:text-indigo-600 hover:underline font-bold transition-colors">
                Créer un compte
              </Link>
            </div>
          </>
        ) : (
          /* ==================================================== */
          /* ÉTAPE VALIDATION CODE SMS DEPUIS CONNEXION          */
          /* ==================================================== */
          <>
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white mb-3 shadow-lg shadow-emerald-500/20">
                <FaSms className="text-3xl" />
              </div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight">Validation par SMS</h1>
              <p className="text-slate-500 text-xs mt-1 font-medium">
                Saisissez le code SMS reçu pour débloquer votre compte ({smsIdentifier})
              </p>
            </div>

            {successMsg && (
              <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                {successMsg}
              </div>
            )}

            {message && (
              <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold">
                {message}
              </div>
            )}

            <form onSubmit={handleVerifySms} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 text-center">
                  Code SMS (6 chiffres)
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
                {loading ? "Validation..." : (
                  <>
                    <FaCheckCircle /> Valider & Se connecter
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => setNeedsSmsVerify(false)}
                className="text-slate-400 hover:text-slate-600 font-semibold cursor-pointer"
              >
                ← Retour à la connexion
              </button>
              <button
                type="button"
                onClick={handleResendSms}
                className="text-blue-600 hover:text-indigo-600 font-bold flex items-center gap-1 cursor-pointer"
              >
                <FaRedo className="text-[10px]" /> Renvoyer le SMS
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Login;