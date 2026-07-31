function Card({

children,
title,
className=""

}){


return (

<div

className={`
bg-white
rounded-xl
shadow
p-6
${className}
`}

>


{
title && (

<h2 className="text-xl font-bold mb-4">

{title}

</h2>

)

}


{children}


</div>

);


}


export default Card;    