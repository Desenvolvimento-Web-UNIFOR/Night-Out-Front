import { useEffect, useState } from 'react';
import { Check, X, RefreshCw, User } from 'lucide-react';
import { authFetch } from '../services/auth';

const isPrivilegedType = (t) => ['ARTISTA', 'CASASHOW'].includes(String(t || '').toUpperCase());
const isPending = (user) => {
  const s = String(user?.status || '').toUpperCase();
  if (s) return s === 'PENDENTE';
  if (typeof user?.aprovado === 'boolean') return user.aprovado === false;
  return isPrivilegedType(user?.tipo) && !user?.aprovado;
};

export default function AdminSolicitacoes() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  async function fetchSolicitacoes() {
    setErr('');
    setLoading(true);
    try {
      const list = await authFetch('/usuarios', { method: 'GET' });
      const pendentes = (Array.isArray(list) ? list : [])
        .filter((u) => isPrivilegedType(u?.tipo))
        .filter((u) => isPending(u));
      setItems(pendentes);
    } catch (e) {
      setErr(e?.message || 'Falha ao carregar solicitações.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSolicitacoes();
  }, []);

  async function aprovar(id) {
    try {
      await authFetch(`/usuarios/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'APROVADO', aprovado: true }),
      });
      setItems((prev) => prev.filter((u) => u.id !== id));
    } catch (e) {
      alert(e?.message || 'Não foi possível aprovar.');
    }
  }

  async function recusar(id) {
    try {
      await authFetch(`/usuarios/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'RECUSADO', aprovado: false }),
      });
      setItems((prev) => prev.filter((u) => u.id !== id));
    } catch (e) {
      alert(e?.message || 'Não foi possível recusar.');
    }
  }

  return (
    <div className="glass p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text">Solicitações de upgrade</h3>
        <button
          onClick={fetchSolicitacoes}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-muted hover:text-text hover:bg-panel/50 focus-ring transition-colors"
        >
          <RefreshCw size={16} /> Atualizar
        </button>
      </div>

      {err && (
        <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-red-300 text-sm">
          {err}
        </div>
      )}

      {loading ? (
        <p className="text-muted">Carregando…</p>
      ) : items.length === 0 ? (
        <p className="text-muted">Nenhuma solicitação pendente.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-muted border-b border-border">
                <th className="py-3 pr-4">Usuário</th>
                <th className="py-3 pr-4">Email</th>
                <th className="py-3 pr-4">Telefone</th>
                <th className="py-3 pr-4">Tipo solicitado</th>
                <th className="py-3 pr-4">Criado em</th>
                <th className="py-3 pr-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {items.map((u) => (
                <tr key={u.id} className="border-b border-border/60">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-panel flex items-center justify-center">
                        <User size={16} className="text-muted" />
                      </div>
                      <div className="text-text">{u.nome || u.name || '-'}</div>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-text">{u.email}</td>
                  <td className="py-3 pr-4 text-text">{u.telefone || '-'}</td>
                  <td className="py-3 pr-4">
                    <span className="px-2 py-1 text-xs rounded-lg bg-primary/15 text-primary">
                      {String(u.tipo || '').toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-muted">
                    {u.createdAt ? new Date(u.createdAt).toLocaleString() : '-'}
                  </td>
                  <td className="py-3 pr-0">
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        onClick={() => aprovar(u.id)}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-600/90 hover:bg-emerald-600 text-white focus-ring"
                        title="Aprovar"
                      >
                        <Check size={16} />
                        Aprovar
                      </button>
                      <button
                        onClick={() => recusar(u.id)}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-red-600/90 hover:bg-red-600 text-white focus-ring"
                        title="Recusar"
                      >
                        <X size={16} />
                        Recusar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
