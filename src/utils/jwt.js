export function parseJwt(token) {
  if (!token) return null;
  try {
    const base64Payload = token.split(".")[1];
    if (!base64Payload) return null;

    const payload = atob(base64Payload.replace(/-/g, "+").replace(/_/g, "/"));
    const jsonPayload = decodeURIComponent(
      payload
        .split("")
        .map((c) => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`)
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Failed to parse JWT", error);
    return null;
  }
}

export function getTokenRole(token = typeof window !== "undefined" ? localStorage.getItem("token") : null) {
  const payload = parseJwt(token);
  return payload?.role || payload?.user?.role || null;
}
