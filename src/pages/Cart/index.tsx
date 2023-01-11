import { useState, useEffect } from "react";
import { type Product } from "../../interfaces/products";

export default function Cart() {
  const [products, setProducts] = useState(
    JSON.parse(localStorage.getItem("products") ?? "[]")
  );

  useEffect(() => {
    const mp = new MercadoPago("TEST-37b0aa8b-93a4-4943-91e4-6a24e05f2fa7", {
      ale: "es",
    });
    const bricksBuilder = mp.bricks();
    const renderCardPaymentBrick = async (bricksBuilder) => {
      const settings = {
        initialization: {
          amount: 100, // monto a ser pago
          payer: {
            email: "",
          },
        },
        customization: {
          visual: {
            style: {
              theme: "default", // | 'dark' | 'bootstrap' | 'flat'
            },
          },
        },
        callbacks: {
          onReady: () => {
            // callback llamado cuando Brick esté listo
          },
          onSubmit: (cardFormData) => {
            //  callback llamado cuando el usuario haga clic en el botón enviar los datos
            //  ejemplo de envío de los datos recolectados por el Brick a su servidor
            return new Promise((resolve, reject) => {
              fetch("/process_payment", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(cardFormData),
              })
                .then((response) => {
                  // recibir el resultado del pago
                  resolve();
                })
                .catch((error) => {
                  // tratar respuesta de error al intentar crear el pago
                  reject();
                });
            });
          },
          onError: (error) => {
            // callback llamado para todos los casos de error de Brick
          },
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
    <div>
      <h1 className="center">Carrito de compras</h1>
      <button>Pagar</button>
      <div className="products">
        {products.map((product: Product) => (
          <div className="card__product" key={product.id}>
            <img src={product.image} alt="" />
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <p>$ {product.price}</p>
          </div>
        ))}
      </div>
      <div id="cardPaymentBrick_container"></div>
    </div>
  );
}
