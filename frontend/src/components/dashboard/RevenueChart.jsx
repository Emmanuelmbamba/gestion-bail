import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

import { Line } from "react-chartjs-2";


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);



function RevenueChart(){


const data = {

labels:[

"Jan",
"Fév",
"Mar",
"Avr",
"Mai",
"Juin",
"Juil",
"Août",
"Sep",
"Oct",
"Nov",
"Déc"

],


datasets:[

{

label:"Revenus mensuels ($)",


data:[

2500,
3200,
4100,
3800,
5200,
6000,
7200,
6800,
8000,
9500,
10500,
12500

],


tension:0.4,


fill:false

}

]

};



const options={


responsive:true,


plugins:{


legend:{

position:"top"

},


title:{

display:true,

text:"Évolution des revenus"

}

},


scales:{


y:{

beginAtZero:true

}


}


};



return (

<div className="bg-white rounded-xl shadow p-6">


<h2 className="text-xl font-bold mb-5">

Revenus mensuels

</h2>


<Line

data={data}

options={options}

/>


</div>

);


}


export default RevenueChart;