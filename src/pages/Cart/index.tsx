import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { type Product } from "../../interfaces/products";
import Swal from "sweetalert2";

export default function Cart() {
  const [products, setProducts] = useState(
    JSON.parse(localStorage.getItem("products_cart") ?? "[]")
  );

  const [nItem, setNum] = useState(
    Number(JSON.parse(localStorage.getItem("n_item") ?? "[]"))
  );

  const deleteProducts = (product: Product) => {
    const newProducts = products.filter(
      (productO: Product) => productO.id !== product.id
    );
    setProducts(newProducts);
    setNum(nItem - 1);
    Swal.fire({
      position: 'bottom-end',
      icon: 'success',
      title: '¡Eliminado!',
      showConfirmButton: false,
      background: '#242424',
      color: "#fff",
      timer: 1250
    })
  };
  const [pay, setPay] = useState(false);
  const navigate = useNavigate();

  const dataFetchedRef = useRef(false);

  useEffect(() => {
    if(products.length == 0){
     localStorage.removeItem("products_cart");
     setPay(false);
    }
    else {
      localStorage.setItem("products_cart", JSON.stringify(products));
    }
    localStorage.setItem("n_item", JSON.stringify(nItem));
  }, [products]);

  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;

    const mp = new MercadoPago("TEST-37b0aa8b-93a4-4943-91e4-6a24e05f2fa7", {
      ale: "es",
    });
    const bricksBuilder = mp.bricks();
    const renderCardPaymentBrick = async (bricksBuilder: any) => {
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

  const handleClick = () => {
    navigate("/");
  };

  const hidePay = () => {
    pay ? setPay(false) : setPay(true);
  };
  return (
    <div>
      <h1 className="center">Carrito de compras</h1>
      <button onClick={handleClick} type="button">
        Retornar
      </button>
      {products.length != 0 ? <button onClick={hidePay}>Pagar</button> : null}
      {products.length == 0 ? (
        <div className="noProduct">No hay productos añadidos</div>
      ) : null}
      <div className="products">
        {products.map((product: Product) => (
          <div className="card__product" key={product.id}>
            <img src={product.image} alt="" />
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <p>$ {product.price}</p>
            <button onClick={() => deleteProducts(product)}>Delete</button>
          </div>
        ))}
      </div>
      <div
        id="cardPaymentBrick_container"
        style={{ display: pay ? "block" : "none" }}
      ></div>
    </div>
  );
}
