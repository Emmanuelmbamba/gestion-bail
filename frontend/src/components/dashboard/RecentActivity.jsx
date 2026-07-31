import {
  FaFileContract,
  FaMoneyBillWave,
  FaHome,
  FaFileInvoice,
  FaUserPlus
} from "react-icons/fa";


function RecentActivity(){


const activities = [

{
icon:<FaFileContract />,
title:"Nouveau contrat créé",
description:"Contrat de location ajouté pour un appartement",
date:"Aujourd'hui"
},


{
icon:<FaMoneyBillWave />,
title:"Paiement reçu",
description:"Paiement du loyer reçu avec succès",
date:"Hier"
},


{
icon:<FaHome />,
title:"Nouveau bien ajouté",
description:"Une nouvelle maison a été enregistrée",
date:"Il y a 2 jours"
},


{
icon:<FaFileInvoice />,
title:"Facture générée",
description:"Facture mensuelle créée automatiquement",
date:"Il y a 3 jours"
},


{
icon:<FaUserPlus />,
title:"Nouveau locataire",
description:"Un nouveau locataire a été enregistré",
date:"Il y a 5 jours"
}

];



return (

<div className="bg-white rounded-xl shadow p-6">


<h2 className="text-xl font-bold mb-5">

Activités récentes

</h2>



<div className="space-y-4">


{

activities.map((activity,index)=>(


<div

key={index}

className="flex items-center gap-4 border-b pb-4"


>


<div className="text-blue-600 text-xl">

{activity.icon}

</div>



<div className="flex-1">


<h3 className="font-semibold">

{activity.title}

</h3>


<p className="text-gray-500 text-sm">

{activity.description}

</p>


</div>



<span className="text-gray-400 text-sm">

{activity.date}

</span>


</div>


))


}


</div>


</div>

);


}


export default RecentActivity;