import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Table,
  User,
  LogOut,
  Menu,
  X,
  AlertTriangle,
  PlusCircle,
  UserPlus,
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
  ADMINISTRADOR: '/dashboard-admin',
  CASASHOW: '/dashboard-casa',
};

const PROFILE_BY_TYPE = {
  CLIENTE: '/perfil',
  ARTISTA: '/perfil-artista',
  ADMINISTRADOR: '/perfil-admin',
  CASASHOW: '/perfil-casa',
};

export default function Sidebar({ currentPath, onNavigate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

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

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    logout();
    setShowLogoutModal(false);
    onNavigate('/login');
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  let menuPrincipal = [];
  let conta = [{ icon: User, label: 'Perfil', path: profilePath }];

  switch (userType) {
    case 'CLIENTE':
      menuPrincipal = [
        { icon: Home, label: 'Painel', path: homePath },
      ];
      break;

    case 'ARTISTA':
      menuPrincipal = [
        { icon: Home, label: 'Painel', path: homePath },
        // { icon: Table, label: 'Propostas', path: '/propostas' },
      ];
      break;

    case 'CASASHOW':
      menuPrincipal = [
        { icon: Home, label: 'Painel', path: homePath },
        { icon: Table, label: 'Propostas', path: '/propostas' },
        { icon: PlusCircle, label: 'Criar evento', path: '/novo-evento' },
      ];
      break;

    case 'ADMINISTRADOR':
      menuPrincipal = [
        { icon: Home, label: 'Painel', path: homePath },
        { icon: Table, label: 'Tabelas', path: '/tabelas' },
        { icon: UserPlus, label: 'Cadastrar', path: '/cadastro' },
      ];
      break;

    default:
      menuPrincipal = [
        { icon: Home, label: 'Painel', path: homePath },
      ];
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
              onClick={handleLogoutClick}
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
        <AnimatePresence>
          {showLogoutModal && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={cancelLogout}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.2 }}
                className="glass p-6 rounded-2xl w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-danger/20 flex items-center justify-center">
                    <AlertTriangle className="text-danger" size={24} />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-text mb-2">
                      Confirmar Saída
                    </h2>
                    <p className="text-muted mb-6">
                      Tem certeza que deseja sair da aplicação?
                    </p>
                    
                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={cancelLogout}
                        className="btn-secondary px-4 py-2"
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        onClick={confirmLogout}
                        className="bg-danger hover:bg-danger/80 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                      >
                        Sim, Sair
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

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
    <>
      <AnimatePresence>
        {showLogoutModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={cancelLogout}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.2 }}
              className="glass p-6 rounded-2xl w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-danger/20 flex items-center justify-center">
                  <AlertTriangle className="text-danger" size={24} />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-text mb-2">
                    Confirmar Saída
                  </h2>
                  <p className="text-muted mb-6">
                    Tem certeza que deseja sair da aplicação?
                  </p>
                  
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={cancelLogout}
                      className="btn-secondary px-4 py-2"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={confirmLogout}
                      className="bg-danger hover:bg-danger/80 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                    >
                      Sim, Sair
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed left-0 top-0 w-80 h-full glass-panel z-30">
        {sidebarContent}
      </div>
    </>
  );
}