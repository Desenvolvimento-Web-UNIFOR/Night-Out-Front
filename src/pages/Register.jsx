import { motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

export default function Register({ onNavigate }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="glass p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-text">Criar conta</h2>
            <p className="text-muted mt-2">Junte-se ao Night Out hoje</p>
          </div>

          <form className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-text mb-2">
                Nome completo
              </label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-3 text-muted" />
                <input
                  id="name"
                  type="text"
                  className="w-full pl-10 pr-4 py-3 bg-panel border border-border rounded-xl text-text placeholder-muted focus-ring transition-colors"
                  placeholder="Seu nome completo"
                />
              </div>
            </div>

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
                  placeholder="seuemail@email.com"
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
                  placeholder="Crie uma senha"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted hover:text-text transition-colors focus-ring p-1"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-text mb-2">
                Confirmar senha
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-3 text-muted" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  className="w-full pl-10 pr-12 py-3 bg-panel border border-border rounded-xl text-text placeholder-muted focus-ring transition-colors"
                  placeholder="Confirme sua senha"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-muted hover:text-text transition-colors focus-ring p-1"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-border text-primary focus:ring-primary/50 bg-panel focus-ring"
                required
              />
              <span className="ml-2 text-sm text-muted">
                Aceito os{' '}
                <a href="#" className="text-primary hover:text-primary2 transition-colors">
                  termos de uso
                </a>{' '}
                e{' '}
                <a href="#" className="text-primary hover:text-primary2 transition-colors">
                  política de privacidade
                </a>
              </span>
            </div>

            <button
              type="submit"
              className="w-full btn-primary py-3 text-lg glow-primary"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('/');
              }}
            >
              Criar conta
            </button>
          </form>

          <p className="text-center text-muted text-sm mt-6">
            Já tem uma conta?{' '}
            <button
              onClick={() => onNavigate('/login')}
              className="text-primary hover:text-primary2 transition-colors focus-ring"
            >
              Faça login
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}