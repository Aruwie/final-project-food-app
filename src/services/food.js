import { fetchAPI } from "./api";

// GET ALL FOODS
export async function getFoods() {
  return fetchAPI("/foods");
}

// GET FOOD DETAIL
export async function getFoodDetail(id) {
  return fetchAPI(`/foods/${id}`);
}

// CREATE FOOD
export async function createFood(foodData) {
  return fetchAPI("/create-food", {
    method: "POST",
    body: JSON.stringify(foodData),
  });
}

// UPDATE FOOD
export async function updateFood(id, foodData) {
  return fetchAPI(`/update-food/${id}`, {
    method: "PUT", // lebih standar daripada POST
    body: JSON.stringify(foodData),
  });
}

// DELETE FOOD
export async function deleteFood(id) {
  return fetchAPI(`/delete-food/${id}`, {
    method: "DELETE",
  });
}

// UPLOAD IMAGE (FormData sudah benar)
export async function uploadImage(file) {
  const formData = new FormData();
  formData.append("image", file);

  return fetchAPI("/upload-image", {
    method: "POST",
    body: formData,
  });
}