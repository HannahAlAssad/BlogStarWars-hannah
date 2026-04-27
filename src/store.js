const loadFromLocalStorage = () => {
  try {
    const saved = localStorage.getItem("swDatabank");
    if (saved) return JSON.parse(saved);
  } catch (_) { }
  return null;
};

export const initialStore = () => {
  const saved = loadFromLocalStorage();
  return {
    people: saved?.people || [],
    vehicles: saved?.vehicles || [],
    planets: saved?.planets || [],
    favorites: saved?.favorites || [],
    loading: false,
    error: null,
  };
};

export default function storeReducer(store, action = {}) {
  let nextStore;

  switch (action.type) {
    case "SET_PEOPLE":
      nextStore = { ...store, people: action.payload };
      break;

    case "SET_VEHICLES":
      nextStore = { ...store, vehicles: action.payload };
      break;

    case "SET_PLANETS":
      nextStore = { ...store, planets: action.payload };
      break;

    case "SET_LOADING":
      return { ...store, loading: action.payload };

    case "SET_ERROR":
      return { ...store, error: action.payload };

    case "ADD_FAVORITE": {
      const already = store.favorites.some(
        (f) => f.uid === action.payload.uid && f.type === action.payload.type
      );
      if (already) return store;
      nextStore = { ...store, favorites: [...store.favorites, action.payload] };
      break;
    }

    case "REMOVE_FAVORITE": {
      nextStore = {
        ...store,
        favorites: store.favorites.filter(
          (f) =>
            !(f.uid === action.payload.uid && f.type === action.payload.type)
        ),
      };
      break;
    }

    default:
      throw new Error(`Unknown action: ${action.type}`);
  }

  try {
    const { loading, error, ...toSave } = nextStore;
    localStorage.setItem("swDatabank", JSON.stringify(toSave));
  } catch (_) { }

  return nextStore;
}
