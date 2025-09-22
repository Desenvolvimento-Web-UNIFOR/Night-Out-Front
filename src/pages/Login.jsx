import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Facebook, Chrome } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { useState } from 'react';

export default function Login({ onNavigate }) {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <div className="min-h-screen flex">

      <div className="hidden lg:flex lg:flex-1 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-bg via-bgAlt to-panel"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=800&h=1000&fit=crop&auto=format')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/50 to-transparent" />
        <div className="relative z-10 flex items-end p-12">
          <div>
            <h1 className="text-4xl font-bold text-text mb-4">
              Bem-vindo ao Night Out
            </h1>
            <p className="text-lg text-muted">
              A plataforma completa para gerenciar sua vida noturna
            </p>
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
              <p className="text-muted mt-2">Entre com suas credenciais para continuar</p>
            </div>

            <div className="space-y-3 mb-6">
              <button className="w-full flex items-center justify-center space-x-3 bg-[#1877f2] hover:bg-[#1877f2]/90 text-white py-3 px-4 rounded-xl font-medium transition-colors focus-ring">
                <Facebook size={20} />
                <span>Continuar com Facebook</span>
              </button>
              
<button className="w-full flex items-center justify-center space-x-3 bg-white hover:bg-gray-100 border border-gray-300 text-gray-900 py-3 px-4 rounded-xl font-medium transition-colors focus-ring">
  <FcGoogle size={20} />
  <span>Continuar com Google</span>
</button>

              
              <button className="w-full flex items-center justify-center space-x-3 bg-black hover:bg-gray-900 text-white py-3 px-4 rounded-xl font-medium transition-colors focus-ring">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <span>Continuar com Apple</span>
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

            <form className="space-y-4">
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
                    type={showPassword ? "text" : "password"}
                    className="w-full pl-10 pr-12 py-3 bg-panel border border-border rounded-xl text-text placeholder-muted focus-ring transition-colors"
                    placeholder="Sua senha"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted hover:text-text transition-colors focus-ring p-1"
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
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
                <button
                  type="button"
                  className="text-sm text-primary hover:text-primary2 transition-colors focus-ring"
                >
                  Esqueceu a senha?
                </button>
              </div>

              <button
                type="submit"
                className="w-full btn-primary py-3 text-lg glow-primary"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('/');
                }}
              >
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