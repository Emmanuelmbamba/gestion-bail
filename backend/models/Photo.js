import { FaImages } from "react-icons/fa";

export default function Photo() {


  const photos = [
    {
      image: "/images/maison.jpg",
      titre: "Maison moderne"
    },
    {
      image: "/images/appartement.jpg",
      titre: "Appartement"
    },
    {
      image: "/images/bureau.jpg",
      titre: "Bureau professionnel"
    },
    {
      image: "/images/boutique.jpg",
      titre: "Boutique commerciale"
    },
    {
      image: "/images/terrain.jpg",
      titre: "Terrain"
    }
  ];



  return (

    <main className="min-h-screen bg-slate-50 py-16 px-6">


      <div className="max-w-6xl mx-auto">


        <div className="text-center mb-12">


          <FaImages 
            className="
            mx-auto
            text-5xl
            text-blue-600
            mb-4
            "
          />


          <h1 className="
          text-3xl
          font-extrabold
          text-slate-800
          ">
            Galerie Photos
          </h1>


          <p className="
          text-slate-500
          mt-3
          ">
            Découvrez nos biens immobiliers en images.
          </p>


        </div>




        <div className="
        grid
        grid-cols-1
        sm:grid-cols-2
        md:grid-cols-3
        gap-6
        ">


        {
          photos.map((photo,index)=>(


            <div
            key={index}
            className="
            bg-white
            rounded-2xl
            overflow-hidden
            shadow-sm
            border
            hover:shadow-lg
            transition
            "
            >


              <img
              src={photo.image}
              alt={photo.titre}
              className="
              w-full
              h-56
              object-cover
              "
              />


              <div className="p-4">


                <h2 className="
                font-bold
                text-slate-800
                ">
                  {photo.titre}
                </h2>


              </div>


            </div>


          ))
        }


        </div>


      </div>


    </main>

  );

}