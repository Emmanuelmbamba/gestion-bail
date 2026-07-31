import {

MapContainer,
TileLayer,
Marker,
Popup

} from "react-leaflet";



export default function Map({latitude,longitude,adresse}){


const position=[

latitude || -4.325,

longitude || 15.322

];



return (

<div className="
h-96
rounded-xl
overflow-hidden
">


<MapContainer

center={position}

zoom={13}

className="h-full w-full"

>


<TileLayer

url="
https://tile.openstreetmap.org/{z}/{x}/{y}.png
"

/>



<Marker position={position}>


<Popup>

{adresse || "Localisation du bien"}

</Popup>


</Marker>



</MapContainer>



</div>

);


}