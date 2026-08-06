import {
  FaQuestionCircle,
  FaFileContract,
  FaMoneyBillWave,
  FaHome,
  FaUserShield
} from "react-icons/fa";


export default function Help() {


  const sections = [

    {
      icon: <FaHome />,
      title: "Gestion des biens",
      text:
        "Ajoutez, modifiez et consultez facilement vos maisons, appartements, bureaux ou boutiques."
    },

    {
      icon: <FaFileContract />,
      title: "Contrats de bail",
      text:
        "Créez vos contrats, suivez leurs statuts et téléchargez vos documents PDF."
    },

    {
      icon: <FaMoneyBillWave />,
      title: "Paiements & factures",
      text:
        "Suivez les loyers, générez les factures et gardez un historique sécurisé."
    },

    {
      icon: <FaUserShield />,
      title: "Sécurité du compte",
      text:
        "Vos informations personnelles sont protégées grâce à notre système d'authentification."
    }

  ];



  return (

    <main className="min-h-screen bg-slate-50 py-12 px-6">


      <div className="max-w-6xl mx-auto">



        {/* TITRE */}

        <section className="text-center mb-12">


          <FaQuestionCircle
            className="
            mx-auto
            text-5xl
            text-blue-600
            mb-4
            "
          />


          <h1
            className="
            text-3xl
            font-extrabold
            text-slate-800
            "
          >
            Centre d'aide Gestion-Bail
          </h1>



          <p
            className="
            text-slate-500
            mt-3
            max-w-2xl
            mx-auto
            "
          >
            Retrouvez toutes les informations nécessaires pour
            utiliser efficacement notre plateforme de gestion locative.
          </p>


        </section>





        {/* SERVICES */}

        <section
          className="
          grid
          grid-cols-1
          md:grid-cols-2
          gap-6
          "
        >


          {
            sections.map((item,index)=>(


              <div
                key={index}
                className="
                bg-white
                rounded-2xl
                p-6
                border
                border-slate-100
                shadow-sm
                hover:shadow-lg
                transition
                "
              >



                <div
                  className="
                  w-12
                  h-12
                  rounded-xl
                  bg-blue-50
                  text-blue-600
                  flex
                  items-center
                  justify-center
                  text-xl
                  mb-4
                  "
                >

                  {item.icon}

                </div>




                <h2
                  className="
                  text-lg
                  font-bold
                  text-slate-800
                  "
                >

                  {item.title}

                </h2>




                <p
                  className="
                  text-sm
                  text-slate-500
                  mt-2
                  leading-relaxed
                  "
                >

                  {item.text}

                </p>



              </div>


            ))
          }


        </section>






        {/* CONTACT */}

        <section
          className="
          mt-12
          bg-gradient-to-r
          from-blue-600
          to-indigo-700
          rounded-2xl
          p-8
          text-center
          text-white
          "
        >


          <h2
            className="
            text-2xl
            font-bold
            "
          >
            Besoin d'une assistance ?
          </h2>



          <p
            className="
            mt-3
            text-blue-100
            "
          >
            Notre équipe est disponible pour répondre à vos questions.
          </p>




          <a
            href="/contact"
            className="
            inline-block
            mt-6
            bg-white
            text-blue-700
            px-6
            py-3
            rounded-xl
            font-bold
            hover:bg-blue-50
            transition
            "
          >

            Nous contacter

          </a>



        </section>



      </div>


    </main>

  );

}