import products from "../../services/products";
import { type Product } from "../../interfaces/products";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function Home() {
  const [nItem, setNum] = useState(
    Number(JSON.parse(localStorage.getItem("n_item") ?? "[0]"))
  );

  const addProducts = (product: Product) => {
    const productsCart = JSON.parse(localStorage.getItem("products_cart") || "[]");
    product.id = nItem;
    productsCart.push(product);
    setNum(nItem + 1);
    localStorage.setItem("products_cart", JSON.stringify(productsCart));
 
    Swal.fire({
      position: 'bottom-end',
      icon: 'success',
      title: '¡Añadido correctamente!',
      showConfirmButton: false,
      background: '#242424',
      color: "#fff",
      timer: 1250
    })

  };

  useEffect(()=>{
    localStorage.setItem("n_item", JSON.stringify(nItem));
  },[nItem]);

  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/cart");
  };

  return (
    <div>
      <h1 className="center">Lista de productos</h1>
      <button onClick={handleClick}>Ir al carrito</button>
      <div className="products">
        {products.map((product: Product) => (
          <div className="card__product" key={product.id}>
            <img src={product.image} alt="" />
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <p>$ {product.price}</p>
            <button onClick={() => addProducts(product)}>Add to cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}
