import { useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { EntityCard } from "../components/EntityCard";

const SECTIONS = [
	{ key: "people", label: "Personajes" },
	{ key: "vehicles", label: "Vehiculos" },
	{ key: "planets", label: "Planetas" },
];

async function fetchFirst15(endpoint) {
	try {
		const res = await fetch(`https://www.swapi.tech/api/${endpoint}?page=1&limit=15`);
		const data = await res.json();
		return (data.results || []).slice(0, 15);
	} catch (_) { return []; }
}

export function Home() {
	const { store, dispatch } = useGlobalReducer();

	useEffect(() => {
		const load = async () => {
			dispatch({ type: "SET_LOADING", payload: true });
			try {
				const [people, vehicles, planets] = await Promise.all([
					store.people.length ? null : fetchFirst15("people"),
					store.vehicles.length ? null : fetchFirst15("vehicles"),
					store.planets.length ? null : fetchFirst15("planets"),
				]);
				if (people) dispatch({ type: "SET_PEOPLE", payload: people });
				if (vehicles) dispatch({ type: "SET_VEHICLES", payload: vehicles });
				if (planets) dispatch({ type: "SET_PLANETS", payload: planets });
			} catch (err) {
				dispatch({ type: "SET_ERROR", payload: err.message });
			} finally {
				dispatch({ type: "SET_LOADING", payload: false });
			}
		};
		load();
	}, []);

	if (store.loading && store.people.length === 0) {
		return (
			<div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
				<div className="text-center">
					<div className="spinner-border text-warning mb-3" role="status" />
					<p className="text-secondary">Cargando la galaxia...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="container-fluid px-4 py-4">
			{SECTIONS.map(({ key, label }) => (
				<section key={key} className="mb-5">
					<h5 className="text-warning fw-bold text-uppercase border-bottom border-secondary pb-2 mb-3 ls-wide">
						{label}
					</h5>

					{store[key].length === 0 ? (
						<p className="text-secondary fst-italic">Cargando {label.toLowerCase()}...</p>
					) : (
						<div className="d-flex gap-3 scroll-row pb-2">
							{store[key].map((item) => (
								<EntityCard key={item.uid} item={item} type={key} />
							))}
						</div>
					)}
				</section>
			))}
		</div>
	);
}
