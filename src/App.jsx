import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

import Sidebar from "./components/Sidebar";
import TopbarTabs from "./components/TopbarTabs";

import Dashboard from "./pages/Dashboard";
import Tabelas from "./pages/Tabelas";
import Estabelecimentos from "./pages/Estabelecimentos";
import Eventos from "./pages/Eventos";
import Perfil from "./pages/Perfil";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EventPage from "./pages/EventPage";
import FeedCliente from "./pages/FeedCliente";
import DashboardArtista from "./pages/DashboardArtista";
import PerfilArtista from "./pages/PerfilArtista";
import PropostasCasa from "./pages/PropostasCasa";

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    return {};
  }
}

function getToken() {
  return localStorage.getItem("token");
}

function isAuthed() {
  return Boolean(getToken());
}

function normalizeUserType(raw) {
  if (!raw) return "CLIENTE";
  const txt = String(raw)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toUpperCase();
  if (["USUARIO", "USUÁRIO", "USER"].includes(txt)) return "CLIENTE";
  if (["ESTABELECIMENTO", "CASA DE SHOW", "CASA_SHOW"].includes(txt))
    return "CASASHOW";
  if (["CLIENTE", "ARTISTA", "ADMINISTRADOR", "CASASHOW"].includes(txt))
    return txt;
  return "CLIENTE";
}

const HOME_BY_TYPE = {
  CLIENTE: "/",
  ARTISTA: "/dashboard-artista",
  ADMINISTRADOR: "/admin",
  CASASHOW: "/admin",
};

const ALLOWED_BY_TYPE = {
  CLIENTE: new Set(["/", "/perfil", "/event/:id"]),
  ARTISTA: new Set(["/dashboard-artista", "/perfil-artista"]),
  ADMINISTRADOR: new Set(["/admin", "/tabelas", "/perfil"]),
  CASASHOW: new Set(["/admin", "/propostas", "/perfil"]),
};

const PUBLIC_PATHS = new Set(["/login", "/register"]);

const routes = {
  "/dashboard-artista": DashboardArtista,
  "/perfil-artista": PerfilArtista,
  "/admin": Dashboard,
  "/tabelas": Tabelas,
  "/estabelecimentos": Estabelecimentos,
  "/eventos": Eventos,
  "/perfil": Perfil,
  "/login": Login,
  "/register": Register,
  "/event/:id": EventPage,
  "/": FeedCliente,
  "/propostas": PropostasCasa,
};

const layoutRoutes = [
  "/",
  "/tabelas",
  "/estabelecimentos",
  "/eventos",
  "/perfil",
  "/perfil-artista",
  "/dashboard-artista",
  "/admin",
  "/event/:id",
  "/propostas",
];

function matchRoute(path) {
  for (const pattern of Object.keys(routes)) {
    const paramNames = [];
    const regex = new RegExp(
      "^" +
        pattern.replace(/:[^/]+/g, (m) => {
          paramNames.push(m.slice(1));
          return "([^/]+)";
        }) +
        "$"
    );

    const m = path.match(regex);
    if (m) {
      const params = {};
      paramNames.forEach(
        (name, i) => (params[name] = decodeURIComponent(m[i + 1]))
      );
      return { Component: routes[pattern], params, pattern };
    }
  }
  return { Component: Dashboard, params: {}, pattern: "/" };
}

export default function App() {
  const [currentPath, setCurrentPath] = useState("/login");
  const [isMobile, setIsMobile] = useState(false);

  const authed = isAuthed();
  const user = getStoredUser();
  const userType = useMemo(
    () => normalizeUserType(user?.tipo ?? user?.role),
    [user]
  );
  const homePath = HOME_BY_TYPE[userType] || "/";

  useEffect(() => {
    if (!authed && !PUBLIC_PATHS.has(currentPath)) {
      if (currentPath !== "/login") setCurrentPath("/login");
      return;
    }

    if (authed && PUBLIC_PATHS.has(currentPath)) {
      if (currentPath !== homePath) setCurrentPath(homePath);
      return;
    }

    if (authed) {
      const allowed = ALLOWED_BY_TYPE[userType] || new Set([homePath]);
      const isAllowed =
        [...allowed].some((pattern) => {
          const regex = new RegExp(
            "^" + pattern.replace(/:[^/]+/g, "([^/]+)") + "$"
          );
          return regex.test(currentPath);
        }) || allowed.has(currentPath);
      if (!isAllowed && currentPath !== homePath) {
        setCurrentPath(homePath);
      }
    }
  }, [authed, currentPath, userType, homePath]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const navigate = (path) => setCurrentPath(path);

  const { Component: CurrentPage, params, pattern } = matchRoute(currentPath);
  const needsLayout = layoutRoutes.includes(pattern);

  if (!needsLayout) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bg via-bgAlt to-bg">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPath}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <CurrentPage onNavigate={navigate} params={params} />
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg via-bgAlt to-bg">
      <Sidebar currentPath={currentPath} onNavigate={navigate} />
      <div
        className={`transition-all duration-300 ${
          !isMobile ? "ml-80" : "ml-0"
        }`}
      >
        <main className="p-6 max-w-7xl mx-auto">
          <TopbarTabs currentPath={currentPath} onNavigate={navigate} />
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPath}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <CurrentPage onNavigate={navigate} params={params} />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
