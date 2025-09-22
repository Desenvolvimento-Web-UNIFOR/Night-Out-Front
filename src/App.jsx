import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './components/Sidebar';
import TopbarTabs from './components/TopbarTabs';
import Dashboard from './pages/Dashboard';
import Tabelas from './pages/Tabelas';
import Estabelecimentos from './pages/Estabelecimentos';
import Eventos from './pages/Eventos';
import Perfil from './pages/Perfil';
import Login from './pages/Login';
import Register from './pages/Register';
import EventPage from './pages/EventPage';
import FeedCliente from './pages/FeedCliente';

const routes = {
  '/admin': Dashboard,
  '/tabelas': Tabelas,
  '/estabelecimentos': Estabelecimentos,
  '/eventos': Eventos,
  '/perfil': Perfil,
  '/login': Login,
  '/register': Register,
  '/event/:id': EventPage,
  '/': FeedCliente,
};

const layoutRoutes = ['/', '/tabelas', '/estabelecimentos', '/eventos', '/perfil', '/event/:id'];

function matchRoute(path) {
  for (const pattern of Object.keys(routes)) {
    const paramNames = [];
    const regex = new RegExp(
      '^' +
        pattern.replace(/:[^/]+/g, (m) => {
          paramNames.push(m.slice(1));
          return '([^/]+)';
        }) +
        '$'
    );

    const m = path.match(regex);
    if (m) {
      const params = {};
      paramNames.forEach((name, i) => (params[name] = decodeURIComponent(m[i + 1])));
      return { Component: routes[pattern], params, pattern };
    }
  }
  return { Component: Dashboard, params: {}, pattern: '/' };
}

export default function App() {
  const [currentPath, setCurrentPath] = useState('/login');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
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

      <div className={`transition-all duration-300 ${!isMobile ? 'ml-80' : 'ml-0'}`}>
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
