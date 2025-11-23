const BASE_USERS_URL =
  import.meta.env.VITE_USERS_API_URL || "http://localhost:3000";

const BASE_EVENTS_URL =
  import.meta.env.VITE_EVENTS_API_URL || "http://localhost:3002";

const BASE_REPORTS_URL =
  import.meta.env.VITE_REPORTS_API_URL || "http://localhost:3003";

export async function login({ email, password }) {
  const res = await fetch(`${BASE_USERS_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": import.meta.env.VITE_X_API_KEY || "",
    },
    body: JSON.stringify({ email, senha: password }),
  });

  if (!res.ok) {
    let message = "Falha ao autenticar.";
    const j = await res.json().catch(() => ({}));
    message = j?.message || j?.error || message;

    const err = new Error(message);
    err.status = res.status;
    err.statusText = res.statusText;
    throw err;
  }

  const data = await res.json();

  const token = data?.token || data?.accessToken || data?.jwt;

  let userId = data?.id || data?.id_usuario;
  if (!userId && token) {
    try {
      const payload = token.split(".")[1];
      const decoded = JSON.parse(atob(payload));
      userId = decoded?.id || decoded?.id_usuario;
    } catch (e) {
      console.log(e);
    }
  }

  const user = {
    id: userId,
    name: data?.nome || data?.name,
    email: data?.email,
    role: data?.tipo || data?.role || data?.papel || data?.perfil || "user",
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

function resolveBaseUrl(path) {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return "";
  }

  if (
    path.startsWith("/evento") ||
    path.startsWith("/eventos") ||
    path.startsWith("/propostaCasa") ||
    path.startsWith("/propostaArtista") ||
    path.startsWith("/eventoArtista")
  ) {
    return BASE_EVENTS_URL;
  }

  if (path.startsWith("/relatorios") || path.startsWith("/relatorio")) {
    return BASE_REPORTS_URL;
  }

  return BASE_USERS_URL;
}

export async function authFetch(path, options = {}) {
  const token = getToken();
  const apiKey = import.meta.env.VITE_X_API_KEY;

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    "x-api-key": apiKey || "",
  };

  const baseUrl = resolveBaseUrl(path);

  const url = path.startsWith("http") ? path : `${baseUrl}${path}`;

  const res = await fetch(url, {
    ...options,
    headers,
  });

  if (!res.ok) {
    let message = "Erro na requisição.";
    let errorDetails = null;
    const j = await res.json().catch(() => ({}));
    message = j?.message || j?.error || message;
    errorDetails = j;

    const err = new Error(message);
    err.status = res.status;
    err.statusText = res.statusText;
    err.details = errorDetails;
    throw err;
  }

  if (res.status === 204 || res.headers.get("content-length") === "0") {
    return {};
  }

  const contentType = res.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    const text = await res.text();
    return text || {};
  }

  try {
    return await res.json();
  } catch {
    return {};
  }
}
