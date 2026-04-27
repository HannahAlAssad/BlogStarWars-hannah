import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

const TYPE_LABELS = { people: "Personaje", vehicles: "Vehiculo", planets: "Planeta" };
const TYPE_COLORS = { people: "warning", vehicles: "info", planets: "success" };
const TYPE_ICONS = { people: "👤", vehicles: "🚀", planets: "🌍" };

export function Navbar() {
	const { store, dispatch } = useGlobalReducer();
	const [query, setQuery] = useState("");
	const [suggestions, setSugg] = useState([]);
	const [showSugg, setShowSugg] = useState(false);
	const [showFavs, setShowFavs] = useState(false);

	const searchRef = useRef(null);
	const favsRef = useRef(null);
	const navigate = useNavigate();

	useEffect(() => {
		if (!query.trim()) { setSugg([]); setShowSugg(false); return; }
		const q = query.toLowerCase();
		const results = [];
		["people", "vehicles", "planets"].forEach((type) => {
			store[type]
				.filter((item) => item.name.toLowerCase().includes(q))
				.slice(0, 5)
				.forEach((item) => results.push({ ...item, type }));
		});
		setSugg(results);
		setShowSugg(results.length > 0);
	}, [query, store.people, store.vehicles, store.planets]);

	useEffect(() => {
		const close = (e) => {
			if (searchRef.current && !searchRef.current.contains(e.target)) setShowSugg(false);
			if (favsRef.current && !favsRef.current.contains(e.target)) setShowFavs(false);
		};
		document.addEventListener("mousedown", close);
		return () => document.removeEventListener("mousedown", close);
	}, []);

	const handleSelect = (item) => {
		setQuery(""); setShowSugg(false);
		navigate(`/detail/${item.type}/${item.uid}`);
	};

	const removeFav = (e, fav) => {
		e.preventDefault(); e.stopPropagation();
		dispatch({ type: "REMOVE_FAVORITE", payload: fav });
	};

	return (
		<nav className="navbar navbar-expand-lg navbar-dark bg-black border-bottom border-secondary sticky-top">
			<div className="container-fluid px-4">

				<Link className="navbar-brand fw-bold text-warning me-4" to="/" style={{ letterSpacing: 2 }}>
					★ STAR WARS
				</Link>

				<button
					className="navbar-toggler"
					type="button"
					data-bs-toggle="collapse"
					data-bs-target="#navMain"
				>
					<span className="navbar-toggler-icon" />
				</button>

				<div className="collapse navbar-collapse" id="navMain">

					<div className="position-relative me-auto" style={{ maxWidth: 380, width: "100%" }} ref={searchRef}>
						<input
							type="search"
							className="form-control form-control-sm bg-dark text-light border-secondary"
							placeholder="Buscar personajes, planetas, vehiculos..."
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							onFocus={() => suggestions.length > 0 && setShowSugg(true)}
						/>
						{showSugg && (
							<ul className="autocomplete-list list-group shadow border border-secondary bg-dark">
								{suggestions.map((s) => (
									<li
										key={`${s.type}-${s.uid}`}
										className="list-group-item list-group-item-action bg-dark text-light border-secondary d-flex align-items-center gap-2"
										style={{ cursor: "pointer" }}
										onClick={() => handleSelect(s)}
									>
										<span className={`badge bg-${TYPE_COLORS[s.type]}`}>{TYPE_LABELS[s.type]}</span>
										{s.name}
									</li>
								))}
							</ul>
						)}
					</div>

					<div className="position-relative ms-3" ref={favsRef}>
						<button
							className="btn btn-outline-warning btn-sm d-flex align-items-center gap-2"
							onClick={() => setShowFavs((v) => !v)}
						>
							♥ Favoritos
							{store.favorites.length > 0 && (
								<span className="badge bg-warning text-dark">{store.favorites.length}</span>
							)}
						</button>

						{showFavs && (
							<div
								className="position-absolute end-0 mt-1 bg-dark border border-secondary rounded shadow favorites-menu"
								style={{ zIndex: 1050 }}
							>
								<div className="d-flex justify-content-between align-items-center px-3 py-2 border-bottom border-secondary">
									<span className="text-warning fw-bold small text-uppercase">Mis Favoritos</span>
									<span className="badge bg-warning text-dark">{store.favorites.length}</span>
								</div>

								{store.favorites.length === 0 ? (
									<p className="text-secondary text-center small py-3 mb-0">Sin favoritos aún</p>
								) : (
									store.favorites.map((fav) => (
										<div
											key={`${fav.type}-${fav.uid}`}
											className="d-flex align-items-center gap-2 px-3 py-2 border-bottom border-secondary favorites-item"
										>
											<span>{TYPE_ICONS[fav.type]}</span>
											<Link
												to={`/detail/${fav.type}/${fav.uid}`}
												className="text-decoration-none text-light flex-grow-1 text-truncate"
												onClick={() => setShowFavs(false)}
											>
												<div className="fw-semibold small text-truncate">{fav.name}</div>
												<span className={`badge bg-${TYPE_COLORS[fav.type]}`} style={{ fontSize: "0.6rem" }}>
													{TYPE_LABELS[fav.type]}
												</span>
											</Link>
											<button
												className="btn btn-sm btn-outline-danger py-0 px-2"
												onClick={(e) => removeFav(e, fav)}
												title="Quitar"
											>
												✕
											</button>
										</div>
									))
								)}
							</div>
						)}
					</div>

				</div>
			</div>
		</nav>
	);
}
