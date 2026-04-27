import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { getImage } from "../images";

const TYPE_LABELS = { people: "Personaje", vehicles: "Vehiculo", planets: "Planeta" };
const TYPE_COLORS = { people: "warning", vehicles: "info", planets: "success" };

const PLACEHOLDER = {
    people: { bg: "bg-primary bg-opacity-25", icon: "👤" },
    vehicles: { bg: "bg-info bg-opacity-25", icon: "🚀" },
    planets: { bg: "bg-success bg-opacity-25", icon: "🌍" },
};

const FIELD_LABELS = {
    gender: "Género", skin_color: "Color de piel", hair_color: "Color de cabello",
    height: "Altura (cm)", eye_color: "Color de ojos", mass: "Masa (kg)",
    birth_year: "Año de nacimiento",
    climate: "Clima", terrain: "Terreno", diameter: "Diámetro (km)",
    rotation_period: "Período de rotación", orbital_period: "Período orbital",
    gravity: "Gravedad", population: "Población", surface_water: "Agua superficial (%)",
    model: "Modelo", manufacturer: "Fabricante", cost_in_credits: "Costo (créditos)",
    length: "Longitud (m)", max_atmosphering_speed: "Velocidad máx. (atm)",
    crew: "Tripulación", passengers: "Pasajeros", cargo_capacity: "Capacidad de carga",
    consumables: "Consumibles", vehicle_class: "Clase",
};

const SKIP = new Set([
    "created", "edited", "url", "homeworld", "films", "vehicles",
    "starships", "pilots", "residents", "people", "name",
]);

function DetailImage({ type, uid, name }) {
    const [imgError, setImgError] = useState(false);
    const src = getImage(type, uid);
    const { bg, icon } = PLACEHOLDER[type] || { bg: "bg-dark", icon: "★" };

    if (src && !imgError) {
        return (
            <img
                src={src}
                alt={name}
                className="img-fluid rounded w-100"
                style={{ maxHeight: 420, objectFit: "cover" }}
                onError={() => setImgError(true)}
            />
        );
    }

    return (
        <div
            className={`rounded w-100 d-flex align-items-center justify-content-center display-1 ${bg}`}
            style={{ height: 420 }}
        >
            {icon}
        </div>
    );
}

export function Detail() {
    const { type, uid } = useParams();
    const { store, dispatch } = useGlobalReducer();
    const [detail, setDetail] = useState(null);
    const [loading, setLoading] = useState(true);

    const isFav = store.favorites.some((f) => f.uid === uid && f.type === type);

    useEffect(() => {
        setLoading(true);
        fetch(`https://www.swapi.tech/api/${type}/${uid}`)
            .then((r) => r.json())
            .then((data) => { setDetail(data.result?.properties || null); setLoading(false); })
            .catch(() => setLoading(false));
    }, [type, uid]);

    const toggleFav = () => {
        dispatch({
            type: isFav ? "REMOVE_FAVORITE" : "ADD_FAVORITE",
            payload: { uid, name: detail?.name || uid, type },
        });
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
                <div className="spinner-border text-warning" role="status" />
            </div>
        );
    }

    if (!detail) {
        return (
            <div className="container py-5 text-center">
                <p className="text-danger">No se pudo cargar la información.</p>
                <Link to="/" className="btn btn-outline-warning btn-sm">Volver al inicio</Link>
            </div>
        );
    }

    const rows = Object.entries(detail).filter(([k]) => !SKIP.has(k));

    return (
        <div className="container py-5">
            <Link to="/" className="btn btn-sm btn-outline-secondary mb-4">
                ← Volver
            </Link>

            <div className="row g-4">
                <div className="col-md-4">
                    <DetailImage type={type} uid={uid} name={detail.name} />
                </div>

                <div className="col-md-8">
                    <div className="d-flex flex-wrap align-items-start justify-content-between gap-3 mb-4">
                        <div>
                            <span className={`badge bg-${TYPE_COLORS[type]} mb-2`}>
                                {TYPE_LABELS[type]}
                            </span>
                            <h1 className="text-warning fw-bold mb-0">{detail.name}</h1>
                        </div>
                        <button
                            className={`btn ${isFav ? "btn-warning text-dark" : "btn-outline-warning"}`}
                            onClick={toggleFav}
                        >
                            {isFav ? "♥ En favoritos" : "♡ Agregar a favoritos"}
                        </button>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-dark table-bordered table-hover align-middle">
                            <tbody>
                                {rows.map(([key, val]) => (
                                    <tr key={key}>
                                        <th
                                            scope="row"
                                            className="text-warning text-capitalize"
                                            style={{ width: "40%" }}
                                        >
                                            {FIELD_LABELS[key] || key.replace(/_/g, " ")}
                                        </th>
                                        <td className="text-light">
                                            {Array.isArray(val) ? (val.length || "—") : (val || "—")}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
