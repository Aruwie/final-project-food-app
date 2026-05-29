import { fetchAPI } from "./api";

export async function login(data) {
  return fetchAPI("/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function register(data) {
  return fetchAPI("/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}