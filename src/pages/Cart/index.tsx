import { useState, useEffect, useRef } from "react";
import { type Product } from "../../interfaces/products";
import { Header } from "../../components";
import Swal from "sweetalert2";

export default function Cart() {
  const [products, setProducts] = useState(
    JSON.parse(localStorage.getItem("products_cart") ?? "[]")
  );

  const [nItem, setNum] = useState(
    Number(JSON.parse(localStorage.getItem("n_item") ?? "[]"))
  );

  const [total, setTotal] = useState(0);

  const dataFetchedRef = useRef(false);

  const deleteProducts = (product: Product) => {
    const newProducts = products.filter(
      (productO: Product) => productO.id !== product.id
    );
    setProducts(newProducts);
    setNum(nItem - 1);
    Swal.fire({
      position: "bottom-end",
      icon: "success",
      title: "¡Eliminado!",
      showConfirmButton: false,
      background: "#242424",
      color: "#fff",
      timer: 1250,
    });
  };

  useEffect(() => {
    const sum = products.reduce(
      (acc: number, product: Product) => acc + product.price,
      0
    );
    setTotal(sum);
  }, []);

  useEffect(() => {
    localStorage.setItem("products_cart", JSON.stringify(products));
    localStorage.setItem("n_item", JSON.stringify(nItem));
  }, [products]);

  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;

    const mp = new MercadoPago(import.meta.env.VITE_PUBLIC_KEY, {
      ale: "es",
    });

    const bricksBuilder = mp.bricks();

    const renderCardPaymentBrick = async (bricksBuilder: any) => {
      const settings = {
        initialization: {
          amount: products.reduce(
            (acc: number, product: Product) => acc + product.price,
            0
          ),
          payer: {
            email: "linderhassinger00@gmail.com",
          },
        },
        customization: {
          visual: {
            style: {
              theme: "default",
            },
          },
        },
        callbacks: {
          onReady: () => {},
          onSubmit: async (cardFormData: any) => {
            const response = await fetch(
              "http://localhost:9004/process_payment",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(cardFormData),
              }
            );
            console.log("response", response);
          },
          onError: (error: any) => {},
        },
      };
      window.cardPaymentBrickController = await bricksBuilder.create(
        "cardPayment",
        "cardPaymentBrick_container",
        settings
      );
    };
    renderCardPaymentBrick(bricksBuilder);
  }, []);

  return (
    <>
      <Header />
      <div className="container mt-3">
        <h1 className="center">Carrito de compras</h1>
        {products.length === 0 && (
          <div className="noProduct">No hay productos añadidos</div>
        )}
        <div className="row mt-5">
          <div className="col-md-6">
            <h4>Payment</h4>
            <hr />
            <div id="cardPaymentBrick_container"></div>
          </div>
          <div className="col-md-6">
            <h4>Orden Summary</h4>
            <hr />
            {products.map((product: Product) => (
              <div className="card mb-3" key={product.id}>
                <div className="card-body">
                  <div className="row">
                    <div className="col-2">
                      <img
                        className="rounded"
                        src={product.image}
                        width={70}
                        alt=""
                      />
                    </div>
                    <div className="col-8">
                      <h5>{product.name}</h5>
                      <p>{product.description}</p>
                    </div>
                    <div className="col-2">
                      <p className="font-weight-bold">
                        $ {product.price.toFixed(2)}
                      </p>
                      <button
                        className="btn btn-danger"
                        onClick={() => deleteProducts(product)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-6">
                    <p>Productos</p>
                  </div>
                  <div
                    className="col-6"
                    style={{
                      textAlign: "right",
                    }}
                  >
                    <p>{nItem}</p>
                  </div>
                  <div className="col-6">
                    <p>Costo de envio</p>
                  </div>
                  <div
                    className="col-6"
                    style={{
                      textAlign: "right",
                    }}
                  >
                    <p>0.00</p>
                  </div>
                  <div className="col-6">
                    <p>Total</p>
                  </div>
                  <div
                    className="col-6"
                    style={{
                      textAlign: "right",
                    }}
                  >
                    {" "}
                    <h3> $ {total.toFixed(2)} </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
