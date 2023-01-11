export const paymentJSON = (name: string, price: number) => {
  return {
    additional_info: {
      items: [
        {
          id: "1",
          title: name,
          description:
            "Producto Point para cobros con tarjetas mediante bluetooth",
          category_id: "electronics",
          quantity: 1,
          unit_price: price,
        },
      ],
      payer: {
        first_name: "Linder",
        last_name: "Hassinger",
        phone: {
          area_code: "51",
          number: "989772179",
        },
      },
    },
    description: "Payment for product",
    installments: 1,
    token: "c89f4527b38ac77c645de0cdb9cdef4a",
    payer: {
      entity_type: "individual",
      type: "customer",
      email: "linderhassinger00@gmail.com",
    },
    payment_method_id: "visa",
    transaction_amount: price,
  };
};
