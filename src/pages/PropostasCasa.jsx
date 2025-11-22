import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, X } from 'lucide-react';
import usePaginatedData from '../hooks/usePaginatedData';
import Pagination from '../components/Pagination';
import { authFetch } from '../services/auth';

// eslint-disable-next-line react/prop-types
function CreatePropostaModal({ open, onClose, onCreated }) {
  const [form, setForm] = useState({
    id_proposta_casa: '',
    id_artista: '',
    id_evento: '',
    data_proposta: '',
    data_evento: '',
    valor_ofertado: '',
    status: 'DISPONÍVEL',
    termos: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setForm((prev) => ({
        ...prev,
        data_proposta:
          prev.data_proposta || new Date().toISOString().slice(0, 10),
      }));
    }
  }, [open]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;

    try {
      setSaving(true);

      const payload = {
        id_proposta_casa: form.id_proposta_casa || undefined,
        id_artista: form.id_artista,
        id_evento: form.id_evento,
        data_proposta: form.data_proposta || new Date().toISOString(),
        data_evento: form.data_evento || null,
        valor_ofertado: form.valor_ofertado
          ? Number(form.valor_ofertado)
          : null,
        status: form.status || 'DISPONÍVEL',
        termos: form.termos || '',
      };

      const res = await authFetch('/propostaCasa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (onCreated) {
        const created = res?.propostaCasa || res?.proposta || res || payload;
        onCreated(created);
      }

      onClose();
    } catch (err) {
      alert(err?.message || 'Não foi possível criar a proposta.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2 }}
            className="glass p-6 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-text">
                Nova Proposta para Artista
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-panel rounded-lg transition-colors"
              >
                <X size={20} className="text-muted" />
              </button>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-muted mb-1">
                    ID da Proposta (opcional)
                  </label>
                  <input
                    name="id_proposta_casa"
                    value={form.id_proposta_casa}
                    onChange={handleChange}
                    className="w-full bg-panel border border-border rounded-lg px-3 py-2 text-text focus-ring"
                    placeholder="Gerado automaticamente se vazio"
                  />
                </div>

                <div>
                  <label className="block text-sm text-muted mb-1">
                    ID do Artista
                  </label>
                  <input
                    name="id_artista"
                    value={form.id_artista}
                    onChange={handleChange}
                    className="w-full bg-panel border border-border rounded-lg px-3 py-2 text-text focus-ring"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-muted mb-1">
                    ID do Evento
                  </label>
                  <input
                    name="id_evento"
                    value={form.id_evento}
                    onChange={handleChange}
                    className="w-full bg-panel border border-border rounded-lg px-3 py-2 text-text focus-ring"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-muted mb-1">
                    Data da Proposta
                  </label>
                  <input
                    type="date"
                    name="data_proposta"
                    value={form.data_proposta}
                    onChange={handleChange}
                    className="w-full bg-panel border border-border rounded-lg px-3 py-2 text-text focus-ring"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-muted mb-1">
                    Data do Evento
                  </label>
                  <input
                    type="date"
                    name="data_evento"
                    value={form.data_evento}
                    onChange={handleChange}
                    className="w-full bg-panel border border-border rounded-lg px-3 py-2 text-text focus-ring"
                  />
                </div>

                <div>
                  <label className="block text-sm text-muted mb-1">
                    Valor Ofertado (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="valor_ofertado"
                    value={form.valor_ofertado}
                    onChange={handleChange}
                    className="w-full bg-panel border border-border rounded-lg px-3 py-2 text-text focus-ring"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-muted mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full bg-panel border border-border rounded-lg px-3 py-2 text-text focus-ring"
                  >
                    <option value="DISPONÍVEL">DISPONÍVEL</option>
                    <option value="ACEITA">ACEITA</option>
                    <option value="RECUSADA">RECUSADA</option>
                    <option value="CANCELADA">CANCELADA</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm text-muted mb-1">
                  Termos da Proposta
                </label>
                <textarea
                  name="termos"
                  value={form.termos}
                  onChange={handleChange}
                  rows={4}
                  className="w-full bg-panel border border-border rounded-lg px-3 py-2 text-text focus-ring resize-none"
                  placeholder="Descreva as condições da proposta, horários, estrutura, observações..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-secondary px-4 py-2"
                  disabled={saving}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-primary px-4 py-2 disabled:opacity-50"
                  disabled={saving}
                >
                  {saving ? 'Enviando…' : 'Enviar Proposta'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function PropostasCasa() {
  const [propostas, setPropostas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [search, setSearch] = useState('');
  const [createOpen, setCreateOpen] = useState(false);

  async function loadPropostas() {
    setLoading(true);
    setErr('');
    try {
      const res = await authFetch('/propostaCasa?page=1&pageSize=1000', {
        method: 'GET',
      });

      const list = Array.isArray(res)
        ? res
        : Array.isArray(res?.items)
        ? res.items
        : [];
      setPropostas(list);
    } catch (e) {
      setErr(e?.message || 'Falha ao carregar propostas.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPropostas();
  }, []);

  const pag = usePaginatedData({
    mode: 'local',
    localData: propostas,
    pageSize: 5,
    search,
  });

  const handleCreated = (created) => {
    setPropostas((prev) => [created, ...prev]);
    pag.setPage(1);
  };

  const formatCurrency = (v) => {
    if (v == null || v === '') return '-';
    const n = Number(v);
    if (!Number.isFinite(n)) return String(v);
    return n.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const formatDate = (d) => {
    if (!d) return '-';
    try {
      return new Date(d).toLocaleDateString('pt-BR');
    } catch {
      return String(d);
    }
  };

  return (
    <div className="space-y-6">
      <CreatePropostaModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={handleCreated}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h2 className="text-2xl font-bold text-text mb-1">
            Propostas para Artistas
          </h2>
          <p className="text-muted">
            Gerencie as propostas enviadas pela sua casa de show para os
            artistas.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="inline-flex items-center gap-2 btn-primary px-5 py-3 glow-primary"
        >
          <Plus size={18} />
          <span>Nova Proposta</span>
        </button>
      </motion.div>

      {err && (
        <div className="glass p-4 border border-red-500/40 text-red-300 text-sm rounded-xl">
          {err}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="glass"
      >
        <div className="p-6 border-b border-border flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <h3 className="text-xl font-semibold text-text">
            Lista de Propostas
          </h3>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-2.5 text-muted"
              />
              <input
                type="text"
                placeholder="Buscar por artista, evento ou status..."
                className="pl-10 pr-4 py-2 bg-panel border border-border rounded-lg text-text placeholder-muted focus-ring w-72"
                value={search}
                onChange={(e) => {
                  pag.setPage(1);
                  setSearch(e.target.value);
                }}
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-panel hover:scrollbar-thumb-primary/50">
          {loading ? (
            <p className="p-6 text-muted">Carregando propostas…</p>
          ) : pag.items.length === 0 ? (
            <p className="p-6 text-muted">
              Nenhuma proposta encontrada. Clique em &quot;Nova Proposta&quot;
              para criar a primeira.
            </p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-6 text-muted font-medium">
                    ID Proposta
                  </th>
                  <th className="text-left py-4 px-6 text-muted font-medium">
                    ID Artista
                  </th>
                  <th className="text-left py-4 px-6 text-muted font-medium">
                    ID Evento
                  </th>
                  <th className="text-left py-4 px-6 text-muted font-medium">
                    Data Proposta
                  </th>
                  <th className="text-left py-4 px-6 text-muted font-medium">
                    Data Evento
                  </th>
                  <th className="text-left py-4 px-6 text-muted font-medium">
                    Valor Ofertado
                  </th>
                  <th className="text-left py-4 px-6 text-muted font-medium">
                    Status
                  </th>
                  <th className="text-left py-4 px-6 text-muted font-medium">
                    Termos
                  </th>
                </tr>
              </thead>
              <tbody>
                {pag.items.map((p, index) => (
                  <motion.tr
                    key={
                      p.id_proposta_casa ||
                      `${p.id_evento}-${p.id_artista}-${index}`
                    }
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="border-b border-border hover:bg-panel/30 transition-colors"
                  >
                    <td className="py-4 px-6 text-text">
                      {p.id_proposta_casa || '-'}
                    </td>
                    <td className="py-4 px-6 text-muted">
                      {p.id_artista || '-'}
                    </td>
                    <td className="py-4 px-6 text-muted">
                      {p.id_evento || '-'}
                    </td>
                    <td className="py-4 px-6 text-muted">
                      {formatDate(p.data_proposta)}
                    </td>
                    <td className="py-4 px-6 text-muted">
                      {formatDate(p.data_evento)}
                    </td>
                    <td className="py-4 px-6 text-text font-medium">
                      {formatCurrency(p.valor_ofertado)}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          String(p.status || '')
                            .toUpperCase()
                            .includes('ACEITA')
                            ? 'bg-emerald-500/15 text-emerald-400'
                            : String(p.status || '')
                                .toUpperCase()
                                .includes('RECUS')
                            ? 'bg-red-500/15 text-red-400'
                            : 'bg-primary/15 text-primary'
                        }`}
                      >
                        {p.status || 'DISPONÍVEL'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-muted max-w-xs">
                      <div className="truncate" title={p.termos || ''}>
                        {p.termos || '-'}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="p-4">
          <Pagination
            page={pag.page}
            pageSize={pag.pageSize}
            total={pag.total}
            onPageChange={pag.setPage}
          />
        </div>
      </motion.div>
    </div>
  );
}