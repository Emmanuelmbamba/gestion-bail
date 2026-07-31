import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import Card from "../components/ui/Card";
import { getNotifications, readNotification } from "../services/notificationService";
import { FaBell, FaCheck, FaExclamationCircle } from "react-icons/fa";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data || []);
    } catch (error) {
      console.error("Erreur de chargement des notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    Promise.resolve().then(() => {
      loadNotifications();
    });
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await readNotification(id);
      loadNotifications();
    } catch (error) {
      console.error("Erreur lors du marquage comme lu:", error);
    }
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Notifications 🔔</h1>
        <p className="text-slate-500 text-sm mt-1">Restez informé des activités, contrats et rappels de paiement</p>
      </div>

      <Card title="Vos alertes de gestion" className="shadow-sm border border-slate-100">
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <p className="text-lg">Aucune notification disponible</p>
            <p className="text-sm mt-1">Vous recevrez des alertes ici lors des nouveaux contrats, paiements, etc.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((n) => (
              <div
                key={n._id}
                className={`p-5 rounded-2xl border transition-all duration-150 flex flex-col sm:flex-row justify-between sm:items-center gap-4 ${
                  n.lu 
                    ? "bg-slate-50/50 border-slate-100 text-slate-500" 
                    : "bg-blue-50/20 border-blue-100 text-slate-800 shadow-sm"
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className={`p-3 rounded-xl mt-0.5 ${
                    n.lu ? "bg-slate-100 text-slate-400" : "bg-blue-100/50 text-blue-600"
                  }`}>
                    {n.type === "rappel" ? <FaExclamationCircle className="text-lg" /> : <FaBell className="text-lg" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className={`font-bold ${n.lu ? "text-slate-700" : "text-slate-900"}`}>{n.titre}</p>
                      {!n.lu && <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />}
                    </div>
                    <p className="text-sm mt-1">{n.message}</p>
                    <p className="text-xs text-slate-400 mt-2">{new Date(n.createdAt).toLocaleString("fr-FR")}</p>
                  </div>
                </div>

                {!n.lu && (
                  <div>
                    <button
                      onClick={() => handleMarkAsRead(n._id)}
                      className="w-full sm:w-auto px-4 py-2 text-xs font-bold text-blue-600 hover:text-white rounded-xl bg-blue-50 hover:bg-blue-600 border border-blue-100 hover:border-blue-600 transition-all duration-150 inline-flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <FaCheck /> Marquer lu
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </Layout>
  );
}

export default Notifications;