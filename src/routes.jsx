import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Detail } from "./pages/Detail";
import { Favorites } from "./pages/Favorites";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<h1 className="text-center mt-5 text-warning">404 — Not found!</h1>}>
      <Route index element={<Home />} />
      <Route path="/detail/:type/:uid" element={<Detail />} />
      <Route path="/favorites" element={<Favorites />} />
    </Route>
  )
);
