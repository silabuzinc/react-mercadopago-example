import products from "../../services/products";
import { type Product } from "../../interfaces/products";

export default function Home() {
  const addProducts = (product: Product) => {
    const products = JSON.parse(localStorage.getItem("products") || "[]");
    products.push(product);
    localStorage.setItem("products", JSON.stringify(products));
  };

  return (
    <div>
      <h1 className="center">Lista de productos</h1>
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
