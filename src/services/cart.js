import { fetchAPI } from "./api";

export async function getCarts() {
  return fetchAPI("/carts");
}

export async function addCart(foodId) {
  return fetchAPI("/add-cart", {
    method: "POST",
    body: JSON.stringify({ foodId }),
  });
}

export async function updateCart(cartId, quantity) {
  return fetchAPI(`/update-cart/${cartId}`, {
    method: "POST",
    body: JSON.stringify({ quantity }),
  });
}

export async function deleteCart(cartId) {
  return fetchAPI(`/delete-cart/${cartId}`, {
    method: "DELETE",
  });
}
