export async function apiFetch(url: string, options: RequestInit = {}) {
  const token = typeof window !== "undefined" 
    ? localStorage.getItem("token") 
    : null;

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(url, {
    ...options,
    headers,
  });

  // Auto logout for unauthorized
  if (res.status === 401 || res.status === 403) {
    console.warn("JWT expired or unauthorized → redirecting to login...");
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
  }

  return res.json();
}
