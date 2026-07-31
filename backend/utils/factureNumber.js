function genererNumeroFacture(){

    const date = new Date();

    const annee = date.getFullYear();

    const mois = String(date.getMonth()+1)
    .padStart(2,'0');


    const numero = Math.floor(
        Math.random()*100000
    );


    return `FAC-${annee}${mois}-${numero}`;

}


module.exports = genererNumeroFacture;