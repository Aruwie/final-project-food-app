import { fetchAPI } from "./api";

export async function getFoods() {
  return fetchAPI("/foods");
}

export async function getFoodDetail(id) {
  return fetchAPI(`/foods/${id}`);
}

export async function createFood(foodData) {
  return fetchAPI("/foods", {
    method: "POST",
    body: JSON.stringify(foodData),
  });
}

export async function updateFood(id, foodData) {
  return fetchAPI(`/foods/${id}`, {
    method: "PUT",
    body: JSON.stringify(foodData),
  });
}

export async function deleteFood(id) {
  return fetchAPI(`/foods/${id}`, {
    method: "DELETE",
  });
}