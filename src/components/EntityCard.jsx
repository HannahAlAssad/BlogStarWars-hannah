import { useState } from "react";
import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { getImage } from "../images";

const TYPE_COLORS = { people: "warning", vehicles: "info", planets: "success" };
const TYPE_LABELS = { people: "Personaje", vehicles: "Vehiculo", planets: "Planeta" };

const PLACEHOLDER = {
    people: { bg: "bg-primary bg-opacity-25", icon: "👤" },
    vehicles: { bg: "bg-info bg-opacity-25", icon: "🚀" },
    planets: { bg: "bg-success bg-opacity-25", icon: "🌍" },
};

function CardImage({ type, uid, name }) {
    const [imgError, setImgError] = useState(false);
    const src = getImage(type, uid);
    const { bg, icon } = PLACEHOLDER[type] || { bg: "bg-dark", icon: "★" };

    if (src && !imgError) {
        return (
            <img
                src={src}
                className="card-img-top"
                alt={name}
                style={{ height: 200, objectFit: "cover" }}
                onError={() => setImgError(true)}
            />
        );
    }

    return (
        <div
            className={`card-img-top d-flex align-items-center justify-content-center fs-1 ${bg}`}
            style={{ height: 200 }}
        >
            {icon}
        </div>
    );
}

export function EntityCard({ item, type }) {
    const { store, dispatch } = useGlobalReducer();
    const isFav = store.favorites.some((f) => f.uid === item.uid && f.type === type);

    const toggleFav = (e) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch({
            type: isFav ? "REMOVE_FAVORITE" : "ADD_FAVORITE",
            payload: { uid: item.uid, name: item.name, type },
        });
    };

    return (
        <div className="card sw-card h-100 border border-secondary bg-dark text-light">
            <CardImage type={type} uid={item.uid} name={item.name} />
            <div className="card-body d-flex flex-column p-3">
                <span className={`badge bg-${TYPE_COLORS[type]} mb-2 align-self-start`}>
                    {TYPE_LABELS[type]}
                </span>
                <h6 className="card-title text-warning fw-bold mb-3">{item.name}</h6>
                <div className="mt-auto d-flex gap-2">
                    <Link
                        to={`/detail/${type}/${item.uid}`}
                        className="btn btn-sm btn-outline-light flex-grow-1"
                    >
                        Ver mas
                    </Link>
                    <button
                        className={`btn btn-sm ${isFav ? "btn-warning text-dark" : "btn-outline-warning"}`}
                        onClick={toggleFav}
                        title={isFav ? "Quitar de favoritos" : "Agregar a favoritos"}
                    >
                        {isFav ? "♥" : "♡"}
                    </button>
                </div>
            </div>
        </div>
    );
}
