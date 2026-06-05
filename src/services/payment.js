import { fetchAPI } from "./api";

export async function getPaymentMethods() {
  return fetchAPI("/payment-methods");
}

export async function generatePaymentMethods() {
  return fetchAPI("/generate-payment-methods", {
    method: "POST",
  });
}
