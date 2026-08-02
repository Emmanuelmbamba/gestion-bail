    import { useState, useContext } from "react";
    import axios from "axios";
    import { useNavigate, Link } from "react-router-dom";
    import { AuthContext } from "../context/AuthContext";
    import { FaBuilding, FaEnvelope, FaLock, FaSignInAlt, FaArrowLeft } from "react-icons/fa";

    function Login() {
      const navigate = useNavigate();
      const { setUser } = useContext(AuthContext);

      const [formData, setFormData] = useState({
        email: "",
        password: ""
      });

      const [message, setMessage] = useState("");
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
      setLoading(true);

      try {
        const API = import.meta.env.VITE_API_URL;

        if (!API) {
          throw new Error("VITE_API_URL n'est pas définie.");
        }

        const response = await axios.post(
          `${API}/auth/login`,
          formData
        );

        const { token, user } = response.data;

        localStorage.setItem("token", token);
        setUser(user);

        navigate("/dashboard");
      } catch (error) {
        console.error(error);

        setMessage(
          error.response?.data?.message ||
          error.message ||
          "Erreur de connexion. Veuillez vérifier vos identifiants."
        );
      } finally {
        setLoading(false);
      }
    };
/*
    if (!user.estConfirme) {
      return res.status(403).json({
        message: "Veuillez confirmer votre adresse e-mail."
      });
    }
*/
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

            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white mb-4 shadow-lg shadow-blue-500/20">
                <FaBuilding className="text-3xl" />
              </div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight">Connexion</h1>
              <p className="text-slate-500 text-xs mt-1.5 font-medium">Gérez facilement vos contrats et paiements</p>
            </div>

            {message && (
              <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                {message}
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
                    name="email"
                    required
                    placeholder="nom@exemple.com"
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
          </div>
        </div>
      );
    }

    export default Login;