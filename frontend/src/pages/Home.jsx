import Navbar from "../components/layout/Navbar";
import Hero from "../components/home/Hero";
import PromoTicker from "../components/home/PromoTicker";
import FeaturedBiens from "../components/home/FeaturedBiens";
import { 
  FaFileContract, 
  FaRegBell, 
  FaShieldAlt,
  FaQuestionCircle,
  FaPhoneAlt
} from "react-icons/fa";
import Logo from "../components/common/Logo";


export default function Home() {

  return (

    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">

      <div>

        <Navbar />

        <Hero />

        <PromoTicker />


        {/* FEATURES SECTION */}

        <section className="bg-white border-y border-slate-100 py-16">

          <div className="container mx-auto px-6 max-w-6xl">


            <div className="text-center max-w-2xl mx-auto mb-12">

              <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full">

                🚀 Notre Mission

              </span>


              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight mt-3">

                Une gestion locative moderne et transparente

              </h2>


              <p className="text-sm text-slate-500 mt-2">

                Simplifiez vos démarches administratives et sécurisez vos relations bailleur-locataire.

              </p>


            </div>




            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">


              {/* CONTRATS */}

              <div className="p-6 rounded-2xl border border-slate-100 bg-slate-50/50 hover:shadow-md transition text-center space-y-4">


                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mx-auto text-xl">

                  <FaFileContract />

                </div>


                <h3 className="font-bold text-slate-800 text-lg">

                  Contrats PDF officiels

                </h3>


                <p className="text-slate-500 text-sm">

                  Générez et téléchargez vos contrats de bail au format PDF.

                </p>


              </div>





              {/* PAIEMENTS */}

              <div className="p-6 rounded-2xl border border-slate-100 bg-slate-50/50 hover:shadow-md transition text-center space-y-4">


                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mx-auto text-xl">

                  <FaShieldAlt />

                </div>


                <h3 className="font-bold text-slate-800 text-lg">

                  Paiements sécurisés

                </h3>


                <p className="text-slate-500 text-sm">

                  Suivez vos paiements et gérez vos factures facilement.

                </p>


              </div>





              {/* NOTIFICATIONS */}

              <div className="p-6 rounded-2xl border border-slate-100 bg-slate-50/50 hover:shadow-md transition text-center space-y-4">


                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mx-auto text-xl">

                  <FaRegBell />

                </div>


                <h3 className="font-bold text-slate-800 text-lg">

                  Suivi & Notifications

                </h3>


                <p className="text-slate-500 text-sm">

                  Recevez les alertes concernant vos contrats et visites.

                </p>


              </div>



            </div>


          </div>


        </section>





        {/* BIENS EN VEDETTE */}

        <FeaturedBiens />





        {/* HELP SECTION */}

        <section className="py-16 bg-slate-50">


          <div className="container mx-auto px-6 max-w-4xl text-center">


            <FaQuestionCircle className="mx-auto text-4xl text-blue-600 mb-5" />


            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">

              Besoin d'aide ?

            </h2>


            <p className="text-slate-500 mt-3">

              Consultez notre centre d'aide pour apprendre à utiliser Gestion-Bail.

            </p>


            <a

              href="/help"

              className="inline-block mt-6 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"

            >

              Centre d'aide

            </a>


          </div>


        </section>






        {/* CONTACT SECTION */}

        <section className="py-16 bg-white">


          <div className="container mx-auto px-6 max-w-4xl text-center">


            <FaPhoneAlt className="mx-auto text-4xl text-green-600 mb-5" />


            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">

              Contactez-nous

            </h2>


            <p className="text-slate-500 mt-3">

              Une question ? Notre équipe est disponible pour vous accompagner.

            </p>


            <a

              href="/contact"

              className="inline-block mt-6 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"

            >

              Nous contacter

            </a>


          </div>


        </section>



      </div>







      {/* FOOTER */}

      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">


        <div className="container mx-auto px-6 max-w-6xl flex flex-col md:flex-row justify-between items-center gap-6">



          <div className="space-y-2 text-center md:text-left">


            <Logo size={60} />


            <p className="text-xs text-slate-500">

              La solution intelligente pour les locataires et les bailleurs.

            </p>


          </div>





          <div className="flex flex-wrap justify-center gap-6 text-xs font-semibold">


            <a href="/" className="hover:text-white">

              Accueil

            </a>


            <a href="/recherche" className="hover:text-white">

              Rechercher

            </a>


            <a href="/help" className="hover:text-white">

              Aide

            </a>


            <a href="/contact" className="hover:text-white">

              Contact

            </a>


            <a href="/login" className="hover:text-white">

              Connexion

            </a>


            <a href="/register" className="hover:text-white">

              Inscription

            </a>


          </div>




          <div className="text-center text-[10px] text-slate-600">

            © {new Date().getFullYear()} Gestion-Bail. Tous droits réservés.

          </div>



        </div>


      </footer>



    </div>


  );

}