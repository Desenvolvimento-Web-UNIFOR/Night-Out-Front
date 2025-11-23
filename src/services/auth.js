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
    try {
      const j = await res.json();
      message = j?.message || j?.error || message;
    } catch {
      console.error("login: falha ao parsear resposta de erro");
    }

    const err = new Error(message);
    err.status = res.status;
    err.statusText = res.statusText;
    throw err;
  }

  const data = await res.json();
  console.log("Login response data:", data);

  const token = data?.token || data?.accessToken || data?.jwt;

  let userId = data?.id || data?.id_usuario;
  if (!userId && token) {
    try {
      const payload = token.split(".")[1];
      const decoded = JSON.parse(atob(payload));
      userId = decoded?.id || decoded?.id_usuario;
      console.log("Decoded JWT payload:", decoded);
    } catch (err) {
      console.error("Failed to decode JWT:", err);
    }
  }

  const user = {
    id: userId,
    name: data?.nome || data?.name,
    email: data?.email,
    role: data?.tipo || data?.role || data?.papel || data?.perfil || "user",
  };

  console.log("Parsed user:", user);

  if (!token) {
    throw new Error("Resposta inválida do servidor: token ausente.");
  }

  return { token, user };
}


export function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "{}");
  } catch (err) {
    console.error("getCurrentUser: erro ao parsear usuário:", err);
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

  if (path.startsWith("/eventos") || path.startsWith("/evento")) {
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

  console.log("authFetch - path:", path);

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    Authorization: token ? `Bearer ${token}` : "",
    "x-api-key": apiKey || "",
  };

  const baseUrl = resolveBaseUrl(path);

  const url = path.startsWith("http")
    ? path
    : `${baseUrl}${path}`;

  console.log("authFetch - URL final:", url);

  const res = await fetch(url, {
    ...options,
    headers,
  });

  console.log("authFetch response:", {
    url,
    status: res.status,
    ok: res.ok,
  });

  if (!res.ok) {
    let message = "Erro na requisição.";
    try {
      const j = await res.json();
      message = j?.message || j?.error || message;
    } catch (err) {
      console.error("authFetch: erro ao parsear JSON de erro:", err);
    }

    const err = new Error(message);
    err.status = res.status;
    err.statusText = res.statusText;
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
  } catch (err) {
    console.error("authFetch: erro ao parsear JSON:", err);
    return {};
  }
}