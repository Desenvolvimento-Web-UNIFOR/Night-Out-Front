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
  Calendar, // Novo ícone para Eventos
  Lock,
  Save,
  UserCog,
  Mail,
  Phone
} from 'lucide-react';
import { logout, authFetch } from '../services/auth';

// --- FUNÇÃO AUXILIAR DE TIPO DE USUÁRIO ---
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

// --- COMPONENTE INTERNO: MODAL DE PERFIL ---
function ProfileModal({ user, onClose, onSave }) {
  const [formData, setFormData] = useState({
    nome: user?.nome || user?.name || '',
    email: user?.email || '',
    telefone: user?.telefone || '',
    senha: '',
    confirmarSenha: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // 1. Validação de Senha
    if (formData.senha || formData.confirmarSenha) {
      if (formData.senha !== formData.confirmarSenha) {
        setError('As senhas não coincidem.');
        return;
      }
      if (formData.senha.length < 6) {
        setError('A senha deve ter no mínimo 6 caracteres.');
        return;
      }
    }

    setLoading(true);
    try {
      // 2. Chamada ao Backend
      // Ajuste o endpoint se necessário (ex: /usuarios/me ou /usuarios/:id)
      const userId = user.id || user.sub || user.uid; 
      await authFetch(`/usuarios/${userId}`, { 
        method: 'PATCH', 
        body: JSON.stringify({
          nome: formData.nome,
          email: formData.email,
          telefone: formData.telefone,
          // Só envia senha se tiver sido alterada
          ...(formData.senha ? { senha: formData.senha } : {})
        }) 
      });

      setSuccess('Perfil atualizado com sucesso!');
      
      // Fecha após 1.5s
      setTimeout(() => {
        onClose();
        if(onSave) onSave(); // Callback para atualizar contexto se existir
      }, 1500);

    } catch (err) {
      console.error(err);
      setError('Erro ao atualizar. Verifique os dados.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="glass w-full max-w-lg overflow-hidden rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-border flex justify-between items-center">
          <h2 className="text-xl font-bold text-text flex items-center gap-2">
            <UserCog className="text-primary" /> Editar Perfil
          </h2>
          <button onClick={onClose} className="text-muted hover:text-text transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-danger/10 border border-danger/20 rounded-xl text-danger text-sm flex items-center gap-2">
              <AlertTriangle size={16} /> {error}
            </div>
          )}
          {success && (
            <div className="p-3 bg-success/10 border border-success/20 rounded-xl text-success text-sm flex items-center gap-2">
              <UserCog size={16} /> {success}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-xs uppercase tracking-wider text-muted font-semibold mb-1 block">Nome Completo</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  className="w-full bg-panel border border-border rounded-xl py-2.5 pl-10 pr-4 text-text focus:border-primary focus:outline-none transition-colors placeholder:text-muted/30"
                  placeholder="Seu nome"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs uppercase tracking-wider text-muted font-semibold mb-1 block">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-panel border border-border rounded-xl py-2.5 pl-10 pr-4 text-text focus:border-primary focus:outline-none transition-colors placeholder:text-muted/30"
                    placeholder="email@exemplo.com"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-muted font-semibold mb-1 block">Telefone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
                  <input
                    type="text"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                    className="w-full bg-panel border border-border rounded-xl py-2.5 pl-10 pr-4 text-text focus:border-primary focus:outline-none transition-colors placeholder:text-muted/30"
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border mt-2">
              <h3 className="text-sm font-semibold text-text mb-3 flex items-center gap-2">
                <Lock size={16} className="text-primary" /> Alterar Senha
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="password"
                  name="senha"
                  placeholder="Nova senha"
                  value={formData.senha}
                  onChange={handleChange}
                  className="w-full bg-panel border border-border rounded-xl py-2.5 px-4 text-text focus:border-primary focus:outline-none placeholder:text-muted/30"
                />
                <input
                  type="password"
                  name="confirmarSenha"
                  placeholder="Confirmar senha"
                  value={formData.confirmarSenha}
                  onChange={handleChange}
                  className="w-full bg-panel border border-border rounded-xl py-2.5 px-4 text-text focus:border-primary focus:outline-none placeholder:text-muted/30"
                />
              </div>
              <p className="text-xs text-muted mt-2 opacity-70">Preencha apenas se desejar alterar sua senha atual.</p>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-text hover:bg-panel rounded-xl transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary px-6 py-2 rounded-xl flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Salvando...' : <><Save size={18} /> Salvar Alterações</>}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

// --- SIDEBAR PRINCIPAL ---
export default function Sidebar({ currentPath, onNavigate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Estados dos Modais
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const user = (typeof window !== 'undefined' && JSON.parse(localStorage.getItem('user') || '{}')) || {};
  const userType = normalizeUserType(user?.tipo ?? user?.role);
  const homePath = HOME_BY_TYPE[userType] || '/';

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);

  // Lógica centralizada de cliques no menu
  const handleItemClick = (item) => {
    // 1. Ação Especial: Logout
    if (item.action === 'logout') {
      setShowLogoutModal(true);
      if (isMobile) setIsOpen(false);
      return;
    }

    // 2. Ação Especial: Perfil (Modal)
    if (item.action === 'modal_profile') {
      setShowProfileModal(true);
      if (isMobile) setIsOpen(false);
      return;
    }

    // 3. Ação Especial: Reload (Se já estiver na página)
    if (currentPath === item.path) {
      window.location.reload();
      return;
    }

    // 4. Navegação Padrão
    onNavigate(item.path);
    if (isMobile) setIsOpen(false);
  };

  const confirmLogout = () => {
    logout();
    setShowLogoutModal(false);
    onNavigate('/login');
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  // --- CONFIGURAÇÃO DOS MENUS ---
  let menuPrincipal = [];
  
  // Menu de Conta é fixo na estrutura, mas muda comportamento via 'action'
  const menuConta = [
    { icon: User, label: 'Perfil', action: 'modal_profile' }, 
    { icon: LogOut, label: 'Sair', action: 'logout' }
  ];

  switch (userType) {
    case 'ARTISTA':
      menuPrincipal = [
        { icon: Home, label: 'Painel', path: homePath },
        // Nova opção solicitada
        { icon: Calendar, label: 'Eventos', path: '/eventos' }, 
      ];
      break;

    case 'CASASHOW':
      menuPrincipal = [
        { icon: Home, label: 'Painel', path: homePath },
        { icon: PlusCircle, label: 'Eventos', path: '/novo-evento' },
      ];
      break;

    case 'ADMINISTRADOR':
      menuPrincipal = [
        { icon: Home, label: 'Painel', path: homePath },
        { icon: Table, label: 'Tabelas', path: '/tabelas' },
        { icon: UserPlus, label: 'Cadastrar', path: '/cadastro' },
      ];
      break;

    default: // CLIENTE
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
        <p className="text-sm text-muted mt-1 truncate">
          {user?.nome || user?.name || 'Usuário'} • {userType}
        </p>
      </div>

      <div className="flex-1 p-6 space-y-8 overflow-y-auto custom-scrollbar">
        <div>
          <h3 className="text-xs font-semibold text-muted mb-4 uppercase tracking-wider">
            Menu Principal
          </h3>
          <nav className="space-y-2">
            {menuPrincipal.map((item) => (
              <button
                key={item.label}
                onClick={() => handleItemClick(item)}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                  currentPath === item.path
                    ? 'bg-primary/10 text-primary border border-primary/20 shadow-lg shadow-primary/5'
                    : 'text-muted hover:text-text hover:bg-panel/50 border border-transparent'
                } focus-ring`}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-muted mb-4 uppercase tracking-wider">
            Conta
          </h3>
          <nav className="space-y-2">
            {menuConta.map((item) => (
              <button
                key={item.label}
                onClick={() => handleItemClick(item)}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all duration-200 border border-transparent ${
                  item.label === 'Sair'
                    ? 'text-muted hover:text-danger hover:bg-danger/10 hover:border-danger/20 mt-4'
                    : 'text-muted hover:text-text hover:bg-panel/50'
                } focus-ring`}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <AnimatePresence>
        {/* MODAL DE LOGOUT */}
        {showLogoutModal && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
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
              className="glass p-6 rounded-2xl w-full max-w-md border-danger/20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-danger/10 border border-danger/20 flex items-center justify-center">
                  <AlertTriangle className="text-danger" size={24} />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-text mb-2">
                    Confirmar Saída
                  </h2>
                  <p className="text-muted mb-6">
                    Tem certeza que deseja sair da aplicação? Você precisará fazer login novamente.
                  </p>
                  
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={cancelLogout}
                      className="btn-secondary px-4 py-2 text-sm"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={confirmLogout}
                      className="bg-danger hover:bg-danger/90 text-white px-4 py-2 rounded-full transition-colors font-medium text-sm shadow-lg shadow-danger/20"
                    >
                      Sim, Sair
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* MODAL DE PERFIL */}
        {showProfileModal && (
          <ProfileModal 
            user={user} 
            onClose={() => setShowProfileModal(false)}
            onSave={() => {
               // Opcional: Atualizar o localStorage com os novos dados se o back retornar o objeto atualizado
               console.log('Perfil salvo');
            }}
          />
        )}
      </AnimatePresence>

      {/* BOTÃO MOBILE */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 glass p-2 text-text hover:text-primary transition-colors focus-ring md:hidden"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* OVERLAY MOBILE */}
      {isOpen && isMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* SIDEBAR CONTAINER */}
      <motion.div
        className={`fixed left-0 top-0 h-full glass-panel z-50 w-80 shadow-2xl md:translate-x-0 border-r border-border`}
        initial={false}
        animate={{ x: isMobile ? (isOpen ? 0 : -320) : 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {sidebarContent}
      </motion.div>
    </>
  );
}