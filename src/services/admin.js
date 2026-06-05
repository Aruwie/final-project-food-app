import { fetchAPI } from "./api";

export async function getAllTransactions() {
  const res = await fetchAPI("/all-transactions");
  if (res?.status === 404 || res?.status === 401) {
    return fetchAPI("/transactions");
  }
  return res;
}

export async function getAllUsers() {
  return fetchAPI("/users");
}
