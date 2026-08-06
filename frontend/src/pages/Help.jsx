import {
  FaQuestionCircle,
  FaFileContract,
  FaMoneyBillWave,
  FaHome,
  FaUserShield,
  FaArrowRight
} from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Help() {
  const sections = [
    {
      icon: <FaHome />,
      title: "Gestion des biens",
      text: "Ajoutez, modifiez et consultez facilement vos maisons, appartements, bureaux ou boutiques avec photos et descriptions détaillées."
    },
    {
      icon: <FaFileContract />,
      title: "Contrats de bail",
      text: "Générez vos contrats officiels en quelques clics, suivez leurs dates d'échéance et téléchargez les documents PDF."
    },
    {
      icon: <FaMoneyBillWave />,
      title: "Paiements & factures",
      text: "Enregistrez les loyers perçus, générez automatiquement les factures d'acompte ou de solde et éditez les quittances."
    },
    {
      icon: <FaUserShield />,
      title: "Sécurité & Accès",
      text: "Chaque rôle (bailleur, locataire, administrateur) dispose d'espaces et de permissions adaptés et sécurisés."
    }
  ];

  return (
    <div className="py-12 px-4 sm:px-6 max-w-6xl mx-auto">
      {/* HEADER */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center text-3xl mx-auto mb-4 border border-blue-100/60 shadow-xs">
          <FaQuestionCircle />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Centre d'aide Gestion-Bail
        </h1>
        <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
          Retrouvez toutes les informations et guides nécessaires pour maîtriser votre plateforme de gestion locative.
        </p>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {sections.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl mb-5">
                {item.icon}
              </div>
              <h2 className="text-xl font-bold text-slate-900">{item.title}</h2>
              <p className="text-sm text-slate-500 mt-2 leading-relaxed">{item.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA BANNER */}
      <div className="mt-16 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 rounded-3xl p-8 sm:p-12 text-center text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold">Une question spécifique ?</h2>
          <p className="mt-3 text-blue-100 text-sm sm:text-base">
            Notre équipe d'assistance est joignable pour vous guider à chaque étape.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 mt-8 bg-white text-blue-700 px-8 py-3.5 rounded-2xl font-extrabold hover:bg-blue-50 shadow-md transition transform hover:-translate-y-0.5"
          >
            Nous contacter <FaArrowRight className="text-xs" />
          </Link>
        </div>
      </div>
    </div>
  );
}