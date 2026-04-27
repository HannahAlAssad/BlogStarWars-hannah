import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { EntityCard } from "../components/EntityCard";

export function Favorites() {
    const { store } = useGlobalReducer();

    if (store.favorites.length === 0) {
        return (
            <div className="container py-5 text-center">
                <div className="py-5">
                    <p className="display-6 mb-2">🌌</p>
                    <h2 className="text-warning mb-3">Sin favoritos aún</h2>
                    <p className="text-secondary mb-4">Agrega personajes, vehiculos o planetas desde la pagina principal.</p>
                    <Link to="/" className="btn btn-outline-warning">Explorar galaxia</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid px-4 py-4">
            <h5 className="text-warning fw-bold text-uppercase border-bottom border-secondary pb-2 mb-4">
                Mis Favoritos
                <span className="badge bg-warning text-dark ms-2">{store.favorites.length}</span>
            </h5>
            <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5 g-3">
                {store.favorites.map((fav) => (
                    <div className="col" key={`${fav.type}-${fav.uid}`}>
                        <EntityCard item={fav} type={fav.type} />
                    </div>
                ))}
            </div>
        </div>
    );
}
