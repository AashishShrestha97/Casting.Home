const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    // no JSON body
  }

  if (!res.ok) {
    throw new Error(data?.error || "Something went wrong. Please try again.");
  }
  return data;
}

export function signup({ role, name, email, phone, password, age, company }) {
  return request("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify({ role, name, email, phone, password, age, company }),
  });
}

export function login({ email, password }) {
  return request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function saveSession({ token, user }) {
  localStorage.setItem("ch_token", token);
  localStorage.setItem("ch_user", JSON.stringify(user));
}

export function getSession() {
  const token = localStorage.getItem("ch_token");
  const userRaw = localStorage.getItem("ch_user");
  if (!token || !userRaw) return null;
  try {
    return { token, user: JSON.parse(userRaw) };
  } catch {
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem("ch_token");
  localStorage.removeItem("ch_user");
}
