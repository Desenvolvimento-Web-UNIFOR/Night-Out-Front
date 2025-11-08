import { motion } from 'framer-motion';
import { Mail, Lock, User as UserIcon, Eye, EyeOff, Phone } from 'lucide-react';
import { useState } from 'react';
import { registerUser } from '../services/users';

const USER_TYPES = [
  { value: 'CLIENTE', label: 'Usuário (padrão)' },
  { value: 'ARTISTA', label: 'Artista (sujeito à aprovação)' },
  { value: 'CASASHOW', label: 'Casa de show (sujeito à aprovação)' },
];

export default function Register({ onNavigate }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [form, setForm] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    telefone: '',
    tipo: 'CLIENTE',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const onChange = (e) => {
    const { id, value } = e.target;
    setForm((f) => ({ ...f, [id]: value }));
  };

  const onChangeTipo = (e) => {
    setForm((f) => ({ ...f, tipo: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setNotice('');
    if (!form.nome.trim() || !form.email.trim() || !form.senha) {
      setError('Preencha nome, email e senha.');
      return;
    }
    if (form.senha !== form.confirmarSenha) {
      setError('As senhas não conferem.');
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        nome: form.nome.trim(),
        email: form.email.trim(),
        senha: form.senha,
        telefone: form.telefone.trim(),
        tipo: String(form.tipo).toUpperCase(),
      };

      await registerUser(payload);

      if (payload.tipo !== 'CLIENTE') {
        setNotice(
          'Cadastro enviado e aguardando aprovação do administrador. Você poderá acessar após a aprovação.'
        );
      } else {
        setNotice('Conta criada com sucesso! Você já pode fazer login.');
      }

      setTimeout(() => onNavigate('/login'), 800);
    } catch (err) {
      setError(err?.message || 'Não foi possível criar a conta.');
    } finally {
      setSubmitting(false);
    }
  };

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

          {error && (
            <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-red-300 text-sm">
              {error}
            </div>
          )}
          {notice && (
            <div className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-emerald-300 text-sm">
              {notice}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="nome" className="block text-sm font-medium text-text mb-2">
                Nome completo
              </label>
              <div className="relative">
                <UserIcon size={18} className="absolute left-3 top-3 text-muted" />
                <input
                  id="nome"
                  type="text"
                  value={form.nome}
                  onChange={onChange}
                  required
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
                  value={form.email}
                  onChange={onChange}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-panel border border-border rounded-xl text-text placeholder-muted focus-ring transition-colors"
                  placeholder="seuemail@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="telefone" className="block text-sm font-medium text-text mb-2">
                Telefone
              </label>
              <div className="relative">
                <Phone size={18} className="absolute left-3 top-3 text-muted" />
                <input
                  id="telefone"
                  type="tel"
                  value={form.telefone}
                  onChange={onChange}
                  className="w-full pl-10 pr-4 py-3 bg-panel border border-border rounded-xl text-text placeholder-muted focus-ring transition-colors"
                  placeholder="(00) 00000-0000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text mb-2">
                Tipo de conta
              </label>
              <div className="grid grid-cols-1 gap-2">
                {USER_TYPES.map((t) => (
                  <label
                    key={t.value}
                    className={`flex items-center justify-between rounded-xl border px-4 py-3 cursor-pointer transition-colors
                    ${form.tipo === t.value ? 'border-primary/60 bg-primary/10 text-text' : 'border-border bg-panel text-muted hover:bg-panel/70'}`}
                  >
                    <span className="text-sm font-medium">
                      {t.label}
                    </span>
                    <input
                      type="radio"
                      name="tipo"
                      value={t.value}
                      checked={form.tipo === t.value}
                      onChange={onChangeTipo}
                      className="h-4 w-4 text-primary focus:ring-primary/50"
                    />
                  </label>
                ))}
              </div>
              <p className="text-xs text-muted mt-2">
                * Contas de <span className="text-text/80">Artista</span> e <span className="text-text/80">Casa de show</span> exigem aprovação do administrador.
              </p>
            </div>

            <div>
              <label htmlFor="senha" className="block text-sm font-medium text-text mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-3 text-muted" />
                <input
                  id="senha"
                  type={showPassword ? 'text' : 'password'}
                  value={form.senha}
                  onChange={onChange}
                  required
                  className="w-full pl-10 pr-12 py-3 bg-panel border border-border rounded-xl text-text placeholder-muted focus-ring transition-colors"
                  placeholder="Crie uma senha"
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

            <div>
              <label htmlFor="confirmarSenha" className="block text-sm font-medium text-text mb-2">
                Confirmar senha
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-3 text-muted" />
                <input
                  id="confirmarSenha"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={form.confirmarSenha}
                  onChange={onChange}
                  required
                  className="w-full pl-10 pr-12 py-3 bg-panel border border-border rounded-xl text-text placeholder-muted focus-ring transition-colors"
                  placeholder="Confirme sua senha"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-muted hover:text-text transition-colors focus-ring p-1"
                  aria-label={showConfirmPassword ? 'Ocultar senha' : 'Mostrar senha'}
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
              disabled={submitting}
              className="w-full btn-primary py-3 text-lg glow-primary disabled:opacity-70"
            >
              {submitting ? 'Enviando...' : 'Criar conta'}
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
