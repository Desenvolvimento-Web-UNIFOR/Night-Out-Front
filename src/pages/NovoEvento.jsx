import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  X,
  Calendar,
  MapPin,
  Clock,
  Filter,
} from 'lucide-react';
import usePaginatedData from '../hooks/usePaginatedData';
import Pagination from '../components/Pagination';
import { authFetch, getCurrentUser } from '../services/auth';


function CreateEventModal({ open, onClose, onCreated }) {
  const currentUser = getCurrentUser();

  const [form, setForm] = useState({
    titulo: '',
    descricao: '',
    data_inicio: '',
    data_fim: '',
    local: '',
    status: 'ATIVO',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setForm((prev) => ({
        ...prev,
        data_inicio:
          prev.data_inicio ||
          new Date().toISOString().slice(0, 16),
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

      if (!currentUser?.id) {
        throw new Error('Usuário não encontrado. Faça login novamente.');
      }

      const payload = {
        id_usuario: currentUser.id,
        titulo: form.titulo,
        descricao: form.descricao,
        data_inicio: form.data_inicio
          ? new Date(form.data_inicio).toISOString()
          : null,
        data_fim: form.data_fim
          ? new Date(form.data_fim).toISOString()
          : null,
        local: form.local,
        status: form.status || 'ATIVO',
      };

      const res = await authFetch('/evento', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (onCreated) {
        const created =
          res?.evento || res?.event || res?.data || res || payload;
        onCreated(created);
      }

      onClose();
    } catch (err) {
      console.error(err);
      alert(err?.message || 'Não foi possível criar o evento.');
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
                Novo Evento da Casa
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-panel rounded-lg transition-colors"
              >
                <X size={20} className="text-muted" />
              </button>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm text-muted mb-1">
                  Título do Evento
                </label>
                <input
                  name="titulo"
                  value={form.titulo}
                  onChange={handleChange}
                  className="w-full bg-panel border border-border rounded-lg px-3 py-2 text-text focus-ring"
                  placeholder="Sunrise Beachclub com Nattan"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-muted mb-1">
                  Descrição
                </label>
                <textarea
                  name="descricao"
                  value={form.descricao}
                  onChange={handleChange}
                  rows={4}
                  className="w-full bg-panel border border-border rounded-lg px-3 py-2 text-text focus-ring resize-none"
                  placeholder="Descreva o evento, atrações, regras, etc."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-muted mb-1">
                    Data / Hora de Início
                  </label>
                  <div className="flex items-center gap-2 bg-panel border border-border rounded-lg px-3">
                    <Calendar size={16} className="text-muted" />
                    <input
                      type="datetime-local"
                      name="data_inicio"
                      value={form.data_inicio}
                      onChange={handleChange}
                      className="w-full bg-transparent py-2 text-text focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-muted mb-1">
                    Data / Hora de Fim
                  </label>
                  <div className="flex items-center gap-2 bg-panel border border-border rounded-lg px-3">
                    <Clock size={16} className="text-muted" />
                    <input
                      type="datetime-local"
                      name="data_fim"
                      value={form.data_fim}
                      onChange={handleChange}
                      className="w-full bg-transparent py-2 text-text focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm text-muted mb-1">
                  Local
                </label>
                <div className="flex items-center gap-2 bg-panel border border-border rounded-lg px-3">
                  <MapPin size={16} className="text-muted" />
                  <input
                    name="local"
                    value={form.local}
                    onChange={handleChange}
                    className="w-full bg-transparent py-2 text-text focus:outline-none"
                    placeholder="Endereço ou descrição do local"
                    required
                  />
                </div>
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
                  <option value="ATIVO">ATIVO</option>
                  <option value="RASCUNHO">RASCUNHO</option>
                  <option value="CANCELADO">CANCELADO</option>
                  <option value="ENCERRADO">ENCERRADO</option>
                </select>
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
                  {saving ? 'Salvando…' : 'Criar Evento'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function NovoEvento() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [search, setSearch] = useState('');
  const [createOpen, setCreateOpen] = useState(false);

  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [columns, setColumns] = useState({
    titulo: true,
    dataInicio: true,
    local: true,
    status: true,
  });

  async function loadEvents() {
    setLoading(true);
    setErr('');
    try {
      const currentUser = getCurrentUser();
      const res = await authFetch('/evento?page=1&pageSize=1000', {
        method: 'GET',
      });

      const list = Array.isArray(res)
        ? res
        : Array.isArray(res?.items)
        ? res.items
        : Array.isArray(res?.eventos)
        ? res.eventos
        : [];

      const filtered = currentUser?.id
        ? list.filter((ev) => ev.id_usuario === currentUser.id)
        : list;

      setEvents(filtered);
    } catch (e) {
      console.error(e);
      setErr(e?.message || 'Falha ao carregar eventos.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEvents();
  }, []);

  const pag = usePaginatedData({
    mode: 'local',
    localData: events,
    pageSize: 5,
    search,
  });

  const handleCreated = (created) => {
    setEvents((prev) => [created, ...prev]);
    pag.setPage(1);
  };

  const formatDateTime = (d) => {
    if (!d) return '-';
    try {
      const dt = new Date(d);
      return (
        dt.toLocaleDateString('pt-BR') +
        ' ' +
        dt.toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
        })
      );
    } catch {
      return String(d);
    }
  };

  return (
    <div className="space-y-6">
      <CreateEventModal
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
            Eventos da Casa de Show
          </h2>
          <p className="text-muted">
            Crie novos eventos e gerencie todos os eventos já cadastrados.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="inline-flex items-center gap-2 btn-primary px-5 py-3 glow-primary"
        >
          <Plus size={18} />
          <span>Novo Evento</span>
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
          <h3 className="text-xl font-semibold text-text">Lista de Eventos</h3>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-2.5 text-muted"
              />
              <input
                type="text"
                placeholder="Buscar por título, local ou status..."
                className="pl-10 pr-4 py-2 bg-panel border border-border rounded-lg text-text placeholder-muted focus-ring w-72"
                value={search}
                onChange={(e) => {
                  pag.setPage(1);
                  setSearch(e.target.value);
                }}
              />
            </div>

            <div className="relative">
              <button
                className="flex items-center space-x-2 btn-secondary"
                onClick={() => setFilterMenuOpen((prev) => !prev)}
              >
                <Filter size={16} />
                <span>Filtros</span>
              </button>
              {filterMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 glass border border-border rounded-xl shadow-lg z-30 p-3">
                  <p className="text-sm text-muted mb-2 font-medium">
                    Exibir colunas:
                  </p>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 cursor-pointer hover:bg-panel/50 p-2 rounded-lg">
                      <input
                        type="checkbox"
                        checked={columns.titulo}
                        onChange={(e) =>
                          setColumns((prev) => ({
                            ...prev,
                            titulo: e.target.checked,
                          }))
                        }
                        className="w-4 h-4 rounded border-border bg-panel"
                      />
                      <span className="text-sm text-text">Título</span>
                    </label>

                    <label className="flex items-center space-x-2 cursor-pointer hover:bg-panel/50 p-2 rounded-lg">
                      <input
                        type="checkbox"
                        checked={columns.dataInicio}
                        onChange={(e) =>
                          setColumns((prev) => ({
                            ...prev,
                            dataInicio: e.target.checked,
                          }))
                        }
                        className="w-4 h-4 rounded border-border bg-panel"
                      />
                      <span className="text-sm text-text">Data / Hora</span>
                    </label>

                    <label className="flex items-center space-x-2 cursor-pointer hover:bg-panel/50 p-2 rounded-lg">
                      <input
                        type="checkbox"
                        checked={columns.local}
                        onChange={(e) =>
                          setColumns((prev) => ({
                            ...prev,
                            local: e.target.checked,
                          }))
                        }
                        className="w-4 h-4 rounded border-border bg-panel"
                      />
                      <span className="text-sm text-text">Local</span>
                    </label>

                    <label className="flex items-center space-x-2 cursor-pointer hover:bg-panel/50 p-2 rounded-lg">
                      <input
                        type="checkbox"
                        checked={columns.status}
                        onChange={(e) =>
                          setColumns((prev) => ({
                            ...prev,
                            status: e.target.checked,
                          }))
                        }
                        className="w-4 h-4 rounded border-border bg-panel"
                      />
                      <span className="text-sm text-text">Status</span>
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-panel hover:scrollbar-thumb-primary/50">
          {loading ? (
            <p className="p-6 text-muted">Carregando eventos…</p>
          ) : pag.items.length === 0 ? (
            <p className="p-6 text-muted">
              Nenhum evento encontrado. Clique em &quot;Novo Evento&quot; para
              criar o primeiro.
            </p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {columns.titulo && (
                    <th className="text-left py-4 px-6 text-muted font-medium">
                      Título
                    </th>
                  )}
                  {columns.dataInicio && (
                    <th className="text-left py-4 px-6 text-muted font-medium">
                      Data / Hora Início
                    </th>
                  )}
                  {columns.local && (
                    <th className="text-left py-4 px-6 text-muted font-medium">
                      Local
                    </th>
                  )}
                  {columns.status && (
                    <th className="text-left py-4 px-6 text-muted font-medium">
                      Status
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {pag.items.map((ev, index) => (
                  <motion.tr
                    key={ev.id_evento || ev.id || index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="border-b border-border hover:bg-panel/30 transition-colors"
                  >
                    {columns.titulo && (
                      <td className="py-4 px-6 text-text font-medium">
                        {ev.titulo || '-'}
                      </td>
                    )}
                    {columns.dataInicio && (
                      <td className="py-4 px-6 text-muted">
                        {formatDateTime(ev.data_inicio)}
                      </td>
                    )}
                    {columns.local && (
                      <td className="py-4 px-6 text-muted">
                        {ev.local || '-'}
                      </td>
                    )}
                    {columns.status && (
                      <td className="py-4 px-6">
                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-primary/15 text-primary">
                          {ev.status || 'ATIVO'}
                        </span>
                      </td>
                    )}
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