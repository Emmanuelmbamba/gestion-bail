import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import Card from "../components/ui/Card";
import { getFactures, downloadFacture } from "../services/factureService";
import { FaFileInvoiceDollar, FaDownload, FaUser, FaCalendarAlt, FaMoneyBillWave } from "react-icons/fa";

function Factures() {
  const [factures, setFactures] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadFactures = async () => {
    try {
      const data = await getFactures();
      setFactures(data || []);
    } catch (error) {
      console.error("Erreur de chargement des factures:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    Promise.resolve().then(() => {
      loadFactures();
    });
  }, []);

  const handleDownload = (id, numeroFacture) => {
    downloadFacture(id, `Facture_${numeroFacture}.pdf`);
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">Factures & Reçus 🧾</h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-1">Consultez et téléchargez les reçus fiscaux et factures de loyer</p>
      </div>

      <Card title="Historique des factures générées" className="shadow-sm border border-slate-100">
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : factures.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <p className="text-lg">Aucune facture disponible</p>
            <p className="text-sm mt-1">Les factures sont créées automatiquement dès qu'un paiement est validé.</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 text-sm font-semibold">
                    <th className="py-3 px-4">Numéro Facture</th>
                    <th className="py-3 px-4">Locataire</th>
                    <th className="py-3 px-4">Date d'émission</th>
                    <th className="py-3 px-4">Montant total</th>
                    <th className="py-3 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {factures.map((f) => (
                    <tr key={f._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors duration-150 text-slate-700">
                      <td className="py-4 px-4 font-bold text-slate-800 flex items-center gap-2">
                        <FaFileInvoiceDollar className="text-blue-500 text-base" /> {f.numeroFacture}
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm font-semibold flex items-center gap-1.5"><FaUser className="text-slate-400 text-xs" /> {f.locataire?.nom || "Locataire inconnu"}</p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm flex items-center gap-1.5"><FaCalendarAlt className="text-slate-400 text-xs" /> {new Date(f.dateEmission).toLocaleDateString("fr-FR")}</p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-base font-extrabold text-slate-800 flex items-center gap-1.5">
                          <FaMoneyBillWave className="text-green-500 text-xs" /> {Number(f.montant || 0).toLocaleString("fr-FR")} $
                        </p>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => handleDownload(f._id, f.numeroFacture)}
                          className="px-3.5 py-2 text-blue-600 hover:text-white rounded-xl bg-blue-50 hover:bg-blue-600 border border-blue-100 hover:border-blue-600 font-bold text-xs transition-all duration-150 inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <FaDownload /> Reçu PDF
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List View */}
            <div className="md:hidden space-y-4">
              {factures.map((f) => (
                <div 
                  key={f._id} 
                  className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 flex flex-col justify-between gap-3 text-slate-700"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                      <FaFileInvoiceDollar className="text-blue-500" /> {f.numeroFacture}
                    </span>
                    <span className="text-sm font-extrabold text-slate-800 flex items-center gap-1">
                      <FaMoneyBillWave className="text-green-500 text-xs" /> {Number(f.montant || 0).toLocaleString("fr-FR")} $
                    </span>
                  </div>

                  <div className="text-xs text-slate-500 space-y-1">
                    <p className="flex items-center gap-1.5">
                      <FaUser className="text-slate-400" /> Locataire: <span className="font-semibold text-slate-700">{f.locataire?.nom || "Locataire inconnu"}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <FaCalendarAlt className="text-slate-400" /> Émis le: <span className="font-semibold text-slate-700">{new Date(f.dateEmission).toLocaleDateString("fr-FR")}</span>
                    </p>
                  </div>

                  <button
                    onClick={() => handleDownload(f._id, f.numeroFacture)}
                    className="w-full py-2.5 text-blue-600 hover:text-white rounded-xl bg-blue-50 hover:bg-blue-600 border border-blue-100 hover:border-blue-600 font-bold text-xs transition-all duration-150 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <FaDownload /> Reçu PDF
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </Card>
    </Layout>
  );
}

export default Factures;