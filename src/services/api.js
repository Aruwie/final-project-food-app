const BASE_URL = "https://api-bootcamp.do.dibimbing.id/api/v1";

export async function fetchAPI(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    apiKey: "w05KkI9AWhKxzvPFtXotUva-",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...headers,
      ...(options.headers || {}),
    },
  });

  const data = await res.json();
  return data;
}