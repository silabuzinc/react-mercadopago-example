import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header>
      <nav>
        <Link to="/">Home</Link>
        <a href="#">About</a>
        <Link to="/cart">Ir al Carrito</Link>
      </nav>
    </header>
  );
}
