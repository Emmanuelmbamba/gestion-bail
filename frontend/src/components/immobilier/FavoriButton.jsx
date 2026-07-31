import { useEffect, useState } from "react";

import {

addFavori,
removeFavori,
checkFavori

} from "../../api/favoriApi";

export default function FavoriButton({ bienId }) {

    const [favori, setFavori] = useState(false);

    useEffect(() => {
        const charger = async () => {
            try {
                const res = await checkFavori(bienId);
                setFavori(res.data.favori);
            } catch (err) {
                console.log(err);
            }
        };
        charger();
    }, [bienId]);

    const toggle = async () => {

        if (favori) {

            await removeFavori(bienId);

            setFavori(false);

        } else {

            await addFavori(bienId);

            setFavori(true);

        }

    };

    return (

        <button

            onClick={toggle}

            className="text-3xl"

        >

            {favori ? "❤️" : "🤍"}

        </button>

    );

}