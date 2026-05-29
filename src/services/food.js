import { fetchAPI } from "./api";

export async function getFoods() {
  return fetchAPI("/foods");
}

export async function getFoodDetail(id) {
  return fetchAPI(`/foods/${id}`);
}