import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HomeView, CartView } from "../pages";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/cart" element={<CartView />} />
      </Routes>
    </BrowserRouter>
  );
}
