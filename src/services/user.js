import { fetchAPI } from "./api";

export async function getProfile() {
  const res = await fetchAPI("/profile");
  if (res?.status === 404) {
    return fetchAPI("/me");
  }
  return res;
}

export async function updateProfile(data) {
  const res = await fetchAPI("/profile", {
    method: "PUT",
    body: JSON.stringify(data),
  });

  if (res?.status === 404) {
    return {
      ok: false,
      status: 404,
      message: "Update profile tidak tersedia di backend.",
    };
  }

  return res;
}
