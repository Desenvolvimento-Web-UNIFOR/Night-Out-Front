const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export async function login({ email, password }) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    let message = "Falha ao autenticar.";
    try {
      const j = await res.json();
      message = j?.message || j?.error || message;
    } catch {
    }
    throw new Error(message);
  }

  const data = await res.json();

  const token = data?.token || data?.accessToken || data?.jwt;
  const user =
    data?.user || data?.usuario || {
      id: data?.id,
      name: data?.name || data?.nome,
      email: data?.email,
      role:
        (data?.role || data?.papel || data?.perfil || data?.tipo || "user") +
        "",
    };

  if (!token) {
    throw new Error("Resposta inválida do servidor: token ausente.");
  }

  return { token, user };
}

export function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    return {};
  }
}

export function getToken() {
  return localStorage.getItem("token");
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

export async function authFetch(path, options = {}) {
  const token = getToken();
  const res = await fetch(
    path.startsWith("http") ? path : `${BASE_URL}${path}`,
    {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: token ? `Bearer ${token}` : "",
      },
    }
  );

  if (!res.ok) {
    let message = "Erro na requisição.";
    try {
      const j = await res.json();
      message = j?.message || j?.error || message;
    } catch {}
    throw new Error(message);
  }

  try {
    return await res.json();
  } catch {
    return await res.text();
  }
}
