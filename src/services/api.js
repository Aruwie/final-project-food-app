const BASE_URL = "https://api-bootcamp.do.dibimbing.id/api/v1";

export async function fetchAPI(endpoint, options = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const isFormData = options.body instanceof FormData;

  const headers = {
    apiKey: "w05KkI9AWhKxzvPFtXotUva-",
  };

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

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
    } catch {
      return { message: text, ...baseResponse };
    }
  }

  return { message: text, ...baseResponse };
}