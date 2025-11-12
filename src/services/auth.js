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
  // Falha ao interpretar o corpo de erro. Logamos para debug.
  // Não sobrescrevemos a mensagem padrão, pois pode não haver JSON.
  console.error("login: falha ao parsear resposta de erro do servidor");
    }
    const err = new Error(message);
    // anexar status para que o front-end consiga tomar decisões de UI
    err.status = res.status;
    err.statusText = res.statusText;
    throw err;
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
  } catch (err) {
  // Se houver problema ao ler/parsear, retornamos objeto vazio e logamos o erro.
  console.error("getCurrentUser: erro ao parsear usuário do localStorage:", err);
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
    } catch (err) {
  // Não foi possível interpretar o JSON de erro. Logamos para diagnóstico.
  console.error("authFetch: falha ao parsear corpo de erro como JSON:", err);
    }
    const err = new Error(message);
    // incluir informações do status HTTP para consumo pela UI
    err.status = res.status;
    err.statusText = res.statusText;
    throw err;
  }

  try {
    return await res.json();
  } catch (err) {
  // Resposta não é JSON — tentamos retornar como texto. Logamos o motivo.
  console.error("authFetch: resposta não é JSON, retornando texto (parse error):", err);
    return await res.text();
  }
}
