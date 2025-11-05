import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Facebook } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { useState } from 'react';

const ROLES = [
  {
    key: 'artist',
    label: 'Artista',
    target: '/dashboard-artista',
    subtitle: 'Gerencie eventos e sua agenda.',
  },
  {
    key: 'user',
    label: 'Usuário',
    target: '/',
    subtitle: 'Descubra festas e artistas próximos.',
  },
  {
    key: 'establishment',
    label: 'Admin',
    target: '/admin',
    subtitle: 'Controle eventos, vendas e reservas.',
  },
];

export default function Login({ onNavigate }) {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [role, setRole] = useState('user');

const handleSubmit = (e) => {
  e.preventDefault();
  const selected = ROLES.find((r) => r.key === role);
  sessionStorage.setItem('role', role);
  onNavigate(selected?.target || '/');
};

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:flex-1 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-gradient-to-br from-bg via-bgAlt to-panel"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=800&h=1000&fit=crop&auto=format')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/50 to-transparent" />
        <div className="relative z-10 flex items-end p-12">
          <div>
            <h1 className="text-4xl font-bold text-text mb-4">Bem-vindo ao Night Out</h1>
            <p className="text-lg text-muted">A plataforma completa para gerenciar sua vida noturna</p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="glass p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-text">Entrar na conta</h2>
              <p className="text-muted mt-2">Escolha o tipo de acesso e entre com suas credenciais</p>
            </div>

            <div className="mt-2 mb-6 bg-white/10 rounded-xl p-1 border border-white/20 grid grid-cols-3">
              {ROLES.map((r) => {
                const active = role === r.key;
                return (
                  <button
                    key={r.key}
                    type="button"
                    onClick={() => setRole(r.key)}
                    className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                      active
                        ? 'bg-primary text-white'
                        : 'text-white/80 hover:text-white'
                    }`}
                  >
                    {r.label}
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-muted text-center mb-6">
              {ROLES.find((r) => r.key === role)?.subtitle}
            </p>

            <div className="space-y-3 mb-6">
              <button className="w-full flex items-center justify-center space-x-3 bg-[#1877f2] hover:bg-[#1877f2]/90 text-white py-3 px-4 rounded-xl font-medium transition-colors focus-ring">
                <Facebook size={20} />
                <span>Continuar com Facebook</span>
              </button>

              <button className="w-full flex items-center justify-center space-x-3 bg-white hover:bg-gray-100 border border-gray-300 text-gray-900 py-3 px-4 rounded-xl font-medium transition-colors focus-ring">
                <FcGoogle size={20} />
                <span>Continuar com Google</span>
              </button>
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-bgAlt px-4 text-muted">ou entre com email</span>
              </div>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-text mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-3 text-muted" />
                  <input
                    id="email"
                    type="email"
                    className="w-full pl-10 pr-4 py-3 bg-panel border border-border rounded-xl text-text placeholder-muted focus-ring transition-colors"
                    placeholder="seu@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-text mb-2">
                  Senha
                </label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-3 text-muted" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    className="w-full pl-10 pr-12 py-3 bg-panel border border-border rounded-xl text-text placeholder-muted focus-ring transition-colors"
                    placeholder="Sua senha"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted hover:text-text transition-colors focus-ring p-1"
                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-border text-primary focus:ring-primary/50 bg-panel focus-ring"
                  />
                  <span className="ml-2 text-sm text-muted">Lembrar de mim</span>
                </label>
                <button type="button" className="text-sm text-primary hover:text-primary2 transition-colors focus-ring">
                  Esqueceu a senha?
                </button>
              </div>

              <button type="submit" className="w-full btn-primary py-3 text-lg glow-primary">
                Entrar
              </button>
            </form>

            <p className="text-center text-muted text-sm mt-6">
              Não possui uma conta?{' '}
              <button
                onClick={() => onNavigate('/register')}
                className="text-primary hover:text-primary2 transition-colors focus-ring"
              >
                Registre-se
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
