import {
  FaHome,
  FaBuilding,
  FaStore,
  FaBriefcase,
  FaMapMarkedAlt
} from "react-icons/fa";


export default function Categories() {


  const categories = [
    {
      nom: "Maison",
      icon: <FaHome />,
      description: "Maisons disponibles à la location."
    },

    {
      nom: "Appartement",
      icon: <FaBuilding />,
      description: "Appartements modernes et confortables."
    },

    {
      nom: "Bureau",
      icon: <FaBriefcase />,
      description: "Espaces professionnels pour vos activités."
    },

    {
      nom: "Boutique",
      icon: <FaStore />,
      description: "Locaux commerciaux et magasins."
    },

    {
      nom: "Terrain",
      icon: <FaMapMarkedAlt />,
      description: "Terrains disponibles pour vos projets."
    }
  ];



  return (

    <main className="min-h-screen bg-slate-50 py-16 px-6">


      <div className="max-w-6xl mx-auto">


        <div className="text-center mb-12">

          <span className="
          text-xs
          font-bold
          uppercase
          tracking-widest
          text-blue-600
          bg-blue-50
          px-3
          py-1
          rounded-full
          ">
            Catégories
          </span>


          <h1 className="
          text-3xl
          md:text-4xl
          font-extrabold
          text-slate-800
          mt-4
          ">
            Découvrez nos catégories de biens
          </h1>


          <p className="
          text-slate-500
          mt-3
          ">
            Trouvez rapidement le type de bien qui correspond à vos besoins.
          </p>


        </div>




        <div className="
        grid
        grid-cols-1
        sm:grid-cols-2
        md:grid-cols-5
        gap-6
        ">


        {
          categories.map((item,index)=>(

            <div
            key={index}
            className="
            bg-white
            rounded-2xl
            border
            border-slate-100
            shadow-sm
            p-6
            text-center
            hover:shadow-lg
            transition
            "
            >


              <div className="
              w-14
              h-14
              mx-auto
              rounded-xl
              bg-blue-100
              text-blue-600
              flex
              items-center
              justify-center
              text-2xl
              mb-4
              ">

                {item.icon}

              </div>



              <h2 className="
              font-bold
              text-slate-800
              ">
                {item.nom}
              </h2>



              <p className="
              text-xs
              text-slate-500
              mt-2
              ">
                {item.description}
              </p>


            </div>


          ))
        }


        </div>


      </div>


    </main>

  );

}