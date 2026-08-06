import { useState } from "react";
import api from "../api/axios";

import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPaperPlane
} from "react-icons/fa";


export default function Contact() {


  const [form, setForm] = useState({

    nom:"",
    email:"",
    message:""

  });



  const [loading,setLoading] = useState(false);

  const [success,setSuccess] = useState("");

  const [error,setError] = useState("");




  const contacts=[

    {
      icon:<FaPhoneAlt />,
      title:"Téléphone",
      values:[
        "+243 818 451 340",
        "+243 997 300 932"
      ],
      color:"green"
    },


    {
      icon:<FaEnvelope />,
      title:"Email",
      values:[
        "contact@gestion-bail.com",
        "emmanuel.mbamba87@gmail.com"
      ],
      color:"blue"
    },


    {
      icon:<FaMapMarkerAlt />,
      title:"Adresse",
      values:[
        "Kinshasa, République Démocratique du Congo"
      ],
      color:"red"
    }

  ];






  const handleChange=(e)=>{


    setForm({

      ...form,

      [e.target.name]:e.target.value

    });


  };






  const handleSubmit=async(e)=>{


    e.preventDefault();


    setLoading(true);

    setSuccess("");

    setError("");



    try{


      console.log(
        "DONNEES ENVOYEES:",
        form
      );



      const response = await api.post(
        "/contact",
        form
      );



      console.log(
        "REPONSE:",
        response.data
      );



      setSuccess(
        response.data.message ||
        "Message envoyé avec succès"
      );



      setForm({

        nom:"",
        email:"",
        message:""

      });



    }
    catch(err){


      console.error(
        "ERREUR CONTACT:",
        err.response?.data
      );



      setError(

        err.response?.data?.message ||

        "Erreur lors de l'envoi du message"

      );


    }
    finally{


      setLoading(false);


    }


  };







return (

<main className="min-h-screen bg-slate-50 py-16 px-6">


<div className="max-w-6xl mx-auto">



<section className="text-center mb-12">


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

Contact

</span>



<h1 className="
text-3xl
md:text-4xl
font-extrabold
text-slate-800
mt-4
">

Contactez Gestion-Bail

</h1>



<p className="
text-slate-500
mt-3
max-w-xl
mx-auto
">

Notre équipe est disponible pour répondre à vos questions
et vous accompagner dans la gestion de vos biens immobiliers.

</p>


</section>






<section className="
grid
grid-cols-1
md:grid-cols-3
gap-6
mb-12
">


{

contacts.map((item,index)=>(


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


<div className={`

w-14
h-14
mx-auto
rounded-xl
flex
items-center
justify-center
text-2xl
mb-4

${
item.color==="green"

?
"bg-green-100 text-green-600"

:

item.color==="blue"

?
"bg-blue-100 text-blue-600"

:

"bg-red-100 text-red-600"

}

`}>

{item.icon}

</div>



<h3 className="
font-bold
text-slate-800
">

{item.title}

</h3>




{
item.values.map((v,i)=>(


<p
key={i}
className="
text-sm
text-slate-500
mt-2
"
>

{v}

</p>


))
}


</div>


))

}


</section>







<section className="
bg-white
rounded-2xl
border
border-slate-100
shadow-sm
p-8
max-w-3xl
mx-auto
">


<h2 className="
text-xl
font-bold
text-slate-800
text-center
mb-6
">

Envoyez-nous un message

</h2>




{
success &&

<div className="
mb-4
p-3
rounded-xl
bg-green-50
text-green-700
text-center
">

{success}

</div>

}




{
error &&

<div className="
mb-4
p-3
rounded-xl
bg-red-50
text-red-700
text-center
">

{error}

</div>

}






<form
onSubmit={handleSubmit}
className="space-y-4"
>



<input

type="text"

name="nom"

value={form.nom}

onChange={handleChange}

placeholder="Votre nom"

required

className="
w-full
px-4
py-3
rounded-xl
border
border-slate-200
"

/>





<input

type="email"

name="email"

value={form.email}

onChange={handleChange}

placeholder="Votre email"

required

className="
w-full
px-4
py-3
rounded-xl
border
border-slate-200
"

/>






<textarea

name="message"

rows="5"

value={form.message}

onChange={handleChange}

placeholder="Votre message"

required

className="
w-full
px-4
py-3
rounded-xl
border
border-slate-200
"

/>





<button

disabled={loading}

className="
w-full
flex
items-center
justify-center
gap-2
bg-blue-600
text-white
py-3
rounded-xl
font-bold
hover:bg-blue-700
disabled:opacity-50
"

>


<FaPaperPlane/>


{

loading

?

"Envoi..."

:

"Envoyer"

}


</button>




</form>



</section>



</div>


</main>


);


}