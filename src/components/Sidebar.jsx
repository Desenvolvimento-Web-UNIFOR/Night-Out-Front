import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Home,
  Table,
  User,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { logout } from '../services/auth';

function normalizeUserType(raw) {
  if (!raw) return 'CLIENTE';
  const txt = String(raw)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toUpperCase();
  if (['USUARIO', 'USUÁRIO', 'USER'].includes(txt)) return 'CLIENTE';
  if (['ESTABELECIMENTO', 'CASA DE SHOW', 'CASA_SHOW'].includes(txt)) return 'CASASHOW';
  if (['CLIENTE', 'ARTISTA', 'ADMINISTRADOR', 'CASASHOW'].includes(txt)) return txt;
  return 'CLIENTE';
}

const HOME_BY_TYPE = {
  CLIENTE: '/',
  ARTISTA: '/dashboard-artista',
  ADMINISTRADOR: '/admin',
  CASASHOW: '/admin',
};

const PROFILE_BY_TYPE = {
  CLIENTE: '/perfil',
  ARTISTA: '/perfil-artista',
  ADMINISTRADOR: '/perfil',
  CASASHOW: '/perfil',
};

export default function Sidebar({ currentPath, onNavigate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const user =
    (typeof window !== 'undefined' &&
      JSON.parse(localStorage.getItem('user') || '{}')) ||
    {};
  const userType = normalizeUserType(user?.tipo ?? user?.role);

  const homePath = HOME_BY_TYPE[userType] || '/';
  const profilePath = PROFILE_BY_TYPE[userType] || '/perfil';

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleItemClick = (path) => {
    onNavigate(path);
    if (isMobile) setIsOpen(false);
  };

  const handleLogout = () => {
    logout();
    onNavigate('/login');
  };

  let menuPrincipal = [];
  let conta = [];

  if (userType === 'CLIENTE' || userType === 'ARTISTA') {
    menuPrincipal = [{ icon: Home, label: 'Painel', path: homePath }];
    conta = [{ icon: User, label: 'Perfil', path: profilePath }];
  } else {
    menuPrincipal = [
      { icon: Home, label: 'Painel', path: homePath },
      { icon: Table, label: 'Tabelas', path: '/tabelas' },
    ];
    conta = [{ icon: User, label: 'Perfil', path: profilePath }];
  }

  const sidebarContent = (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-border">
        <h1 className="text-2xl font-bold text-text tracking-tight">
          NIGHT OUT
        </h1>
        <p className="text-sm text-muted mt-1">
          {user?.nome || user?.name || 'Usuário'} • {userType}
        </p>
      </div>

      <div className="flex-1 p-6 space-y-8">
        <div>
          <h3 className="text-sm font-medium text-muted mb-4 uppercase tracking-wider">
            Menu Principal
          </h3>
          <nav className="space-y-2">
            {menuPrincipal.map((item) => (
              <button
                key={item.path}
                onClick={() => handleItemClick(item.path)}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                  currentPath === item.path
                    ? 'bg-primary/20 text-primary border border-primary/30'
                    : 'text-muted hover:text-text hover:bg-panel/50'
                } focus-ring`}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div>
          <h3 className="text-sm font-medium text-muted mb-4 uppercase tracking-wider">
            Conta
          </h3>
          <nav className="space-y-2">
            {conta.map((item) => (
              <button
                key={item.path}
                onClick={() => handleItemClick(item.path)}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                  currentPath === item.path
                    ? 'bg-primary/20 text-primary border border-primary/30'
                    : 'text-muted hover:text-text hover:bg-panel/50'
                } focus-ring`}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}

            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-muted hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 focus-ring mt-2"
            >
              <LogOut size={20} />
              <span className="font-medium">Sair</span>
            </button>
          </nav>
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <>
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 glass p-2 text-text hover:text-primary transition-colors focus-ring"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {isOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
        )}

        <motion.div
          initial={{ x: -300 }}
          animate={{ x: isOpen ? 0 : -300 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed left-0 top-0 z-50 w-80 h-full glass-panel"
        >
          {sidebarContent}
        </motion.div>
      </>
    );
  }

  return (
    <div className="fixed left-0 top-0 w-80 h-full glass-panel z-30">
      {sidebarContent}
    </div>
  );
}
