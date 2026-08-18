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

// Two fully separate auth systems — actor calls only ever hit
// /api/auth/actor/*, producer calls only ever hit /api/auth/producer/*.
// There is no shared signup/login function on purpose: mixing them up
// here is exactly what would let a role's credentials leak into the
// wrong table's request.

export function signupActor({ name, email, phone, password, age }) {
  return request("/api/auth/actor/signup", {
    method: "POST",
    body: JSON.stringify({ name, email, phone, password, age }),
  });
}

export function loginActor({ email, password }) {
  return request("/api/auth/actor/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function signupProducer({ name, email, phone, password, company }) {
  return request("/api/auth/producer/signup", {
    method: "POST",
    body: JSON.stringify({ name, email, phone, password, company }),
  });
}

export function loginProducer({ email, password }) {
  return request("/api/auth/producer/login", {
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
