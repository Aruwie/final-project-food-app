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

  const text = await res.text();
  const contentType = res.headers.get("content-type") || "";
  const baseResponse = {
    status: res.status,
    ok: res.ok,
  };

  if (contentType.includes("application/json")) {
    try {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) {
        return { data: parsed, ...baseResponse };
      }
      return { ...parsed, ...baseResponse };
    } catch (error) {
      return { message: text, ...baseResponse };
    }
  }

  return { message: text, ...baseResponse };
}