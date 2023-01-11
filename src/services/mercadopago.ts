import api from "./api";
import { paymentJSON } from "./pay-test";

export const storePay = async (name: string, price: number) => {
  const { API_URL, ACCESS_TOKEN } = api;

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
      body: JSON.stringify(paymentJSON(name, price)),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};
