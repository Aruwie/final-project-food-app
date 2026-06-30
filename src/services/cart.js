import { fetchAPI } from "./api";
import { getFoodDetail } from "./food";

/**
 * GET CARTS (ENRICHED VERSION)
 * - inject food detail supaya price tidak 0
 */
export async function getCarts() {
  const res = await fetchAPI("/carts");

  if (!res?.ok || !Array.isArray(res.data)) {
    return res;
  }

  try {
    const enriched = await Promise.all(
      res.data.map(async (cart) => {
        const foodId = cart.foodId || cart.food?.id || cart.food_id;

        if (!foodId) {
          return {
            ...cart,
            food: null,
            price: 0,
          };
        }

        const foodRes = await getFoodDetail(foodId);

        const food = foodRes?.data || null;

        return {
          ...cart,
          food,
          price: food?.price ?? 0,
          name: food?.name ?? cart.name,
          imageUrl: food?.imageUrl ?? cart.imageUrl,
        };
      })
    );

    return {
      ...res,
      data: enriched,
    };
  } catch (err) {
    console.error("Cart enrichment failed:", err);

    // fallback kalau gagal enrichment
    return res;
  }
}

/**
 * ADD CART
 */
export async function addCart(foodId) {
  return fetchAPI("/add-cart", {
    method: "POST",
    body: JSON.stringify({ foodId }),
  });
}

/**
 * UPDATE CART
 */
export async function updateCart(cartId, quantity) {
  return fetchAPI(`/update-cart/${cartId}`, {
    method: "POST",
    body: JSON.stringify({ quantity }),
  });
}

/**
 * DELETE CART
 */
export async function deleteCart(cartId) {
  return fetchAPI(`/delete-cart/${cartId}`, {
    method: "DELETE",
  });
}