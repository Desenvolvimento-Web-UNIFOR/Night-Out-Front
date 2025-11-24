import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, X, Filter } from 'lucide-react';
import usePaginatedData from '../hooks/usePaginatedData';
import Pagination from '../components/Pagination';
import { authFetch, getCurrentUser } from '../services/auth';

function toIsoDateTime(dateStr) {
  if (!dateStr) return new Date().toISOString();

  if (dateStr.includes('T')) return dateStr;

  return new Date(`${dateStr}T00:00:00`).toISOString();
}

// eslint-disable-next-line react/prop-types
function CreatePropostaModal({ open, onClose, onCreated }) {
  const [form, setForm] = useState({
    id_proposta_artista: '',
    id_evento: '',
    data_proposta: '',
    data_evento: '',
    valor_ofertado: '',
    status: 'DISPONÍVEL',
    termos: '',
  });
  const [saving, setSaving] = useState(false);

  const [events, setEvents] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [optionsError, setOptionsError] = useState('');

  useEffect(() => {
    if (!open) return;

    setForm((prev) => ({
      ...prev,
      data_proposta:
        prev.data_proposta || new Date().toISOString().slice(0, 10),
    }));

    async function loadOptions() {
      setLoadingOptions(true);
      setOptionsError('');

      try {
        const currentUser = getCurrentUser();
        const idCasa = currentUser?.id;

        const eventosRes = await authFetch('/evento?page=1&pageSize=200', { 
          method: 'GET' 
        });

        const rawEvents = Array.isArray(eventosRes)
          ? eventosRes
          : eventosRes?.eventos || eventosRes?.items || [];

        // Filtrar apenas eventos da casa de show logada
        const filteredEvents = idCasa
          ? rawEvents.filter((ev) => ev.id_usuario === idCasa)
          : rawEvents;

        setEvents(
          filteredEvents.map((ev) => ({
            id: ev.id_evento || ev.id,
            title: ev.titulo || ev.nome || 'Evento sem título',
          })),
        );
      } catch (e) {
        console.error('Erro ao carregar eventos:', e);
        setOptionsError(
          e?.message ||
            'Falha ao carregar eventos. Tente novamente.',
        );
      } finally {
        setLoadingOptions(false);
      }
    }

    if (!events.length) {
      loadOptions();
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

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

      const currentUser = getCurrentUser();
      const idCasa = currentUser?.id;

      if (!idCasa) {
        throw new Error('Usuário não autenticado ou ID da casa não encontrado.');
      }

      const payload = {
        id_proposta_artista: form.id_proposta_artista || undefined,
        id_casa: idCasa,
        id_evento: form.id_evento,
        data_proposta: toIsoDateTime(form.data_proposta),
        data_evento: form.data_evento ? toIsoDateTime(form.data_evento) : null,
        valor_ofertado: String(form.valor_ofertado),
        status: form.status || 'DISPONÍVEL',
        termos: form.termos || '',
      };

      const res = await authFetch('/propostaArtista', {
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
                Nova proposta para artista
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-panel rounded-lg transition-colors"
              >
                <X size={20} className="text-muted" />
              </button>
            </div>

            {optionsError && (
              <div className="mb-3 text-xs text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
                {optionsError}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-muted mb-1">
                    ID da Proposta Artista (opcional)
                  </label>
                  <input
                    name="id_proposta_artista"
                    value={form.id_proposta_artista}
                    onChange={handleChange}
                    className="w-full bg-panel border border-border rounded-lg px-3 py-2 text-text focus-ring"
                    placeholder="Gerado automaticamente se vazio"
                  />
                </div>

                <div>
                  <label className="block text-sm text-muted mb-1">
                    Evento
                  </label>
                  <select
                    name="id_evento"
                    value={form.id_evento}
                    onChange={handleChange}
                    className="w-full bg-panel border border-border rounded-lg px-3 py-2 text-text focus-ring"
                    required
                    disabled={loadingOptions}
                  >
                    <option value="">
                      {loadingOptions
                        ? 'Carregando eventos...'
                        : 'Selecione um evento'}
                    </option>
                    {events.map((ev) => (
                      <option key={ev.id} value={ev.id}>
                        {ev.title}
                      </option>
                    ))}
                  </select>
                  {!loadingOptions && !events.length && (
                    <p className="text-[11px] text-muted mt-1">
                      Nenhum evento disponível. Crie um evento primeiro.
                    </p>
                  )}
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
                  placeholder="Descreva condições de cachê, estrutura, horários, observações..."
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
                  disabled={saving || loadingOptions}
                >
                  {saving ? 'Enviando…' : 'Enviar proposta'}
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

  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [columns, setColumns] = useState({
    dataProposta: true,
    dataEvento: true,
    valorOfertado: true,
    status: true,
  });

  async function loadPropostas() {
    setLoading(true);
    setErr('');
    try {
      const [propsRes, eventosRes, artistasRes] = await Promise.all([
        authFetch('/propostaArtista?page=1&pageSize=1000', {
          method: 'GET',
        }),
        authFetch('/evento?page=1&pageSize=1000', {
          method: 'GET',
        }),
        authFetch('/artista?tipo=ARTISTA&page=1&pageSize=1000', {
          method: 'GET',
        }),
      ]);

      const list = Array.isArray(propsRes)
        ? propsRes
        : Array.isArray(propsRes?.items)
        ? propsRes.items
        : [];

      const rawEvents = Array.isArray(eventosRes)
        ? eventosRes
        : eventosRes?.eventos || eventosRes?.items || [];

      const rawArtistas = Array.isArray(artistasRes)
        ? artistasRes
        : artistasRes?.items || artistasRes?.usuarios || [];

      // Criar mapa de eventos para lookup rápido
      const eventosMap = rawEvents.reduce((acc, ev) => {
        acc[ev.id_evento || ev.id] = ev;
        return acc;
      }, {});

      // Criar mapa de artistas para lookup rápido
      const artistasMap = rawArtistas.reduce((acc, art) => {
        acc[art.id_usuario || art.id] = art;
        return acc;
      }, {});

      const currentUser = getCurrentUser();
      const idCasa = currentUser?.id;

      // Popular os eventos e artistas nas propostas e filtrar apenas propostas da casa logada
      const propostasComEventos = list
        .map((p) => ({
          ...p,
          evento: eventosMap[p.id_evento] || null,
          artista: p.aceito ? artistasMap[p.aceito] || null : null,
        }))
        .filter((p) => !idCasa || p.id_casa === idCasa);

      console.log('Propostas da casa carregadas:', propostasComEventos.slice(0, 2));

      setPropostas(propostasComEventos);
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

  const formatCurrency = (value) => {
    if (!value) return '-';

    const number = Number(value);
    if (Number.isNaN(number)) return value;

    return number.toLocaleString('pt-BR', {
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
            Novas propostas enviadas para artistas
          </h2>
        </div>
        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="inline-flex items-center gap-2 btn-primary px-5 py-3 glow-primary"
        >
          <Plus size={18} />
          <span>Nova proposta</span>
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
            Lista de propostas
          </h3>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-2.5 text-muted"
              />
              <input
                type="text"
                placeholder="Buscar por data, valor ou status..."
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
                        checked={columns.dataProposta}
                        onChange={(e) =>
                          setColumns((prev) => ({
                            ...prev,
                            dataProposta: e.target.checked,
                          }))
                        }
                        className="w-4 h-4 rounded border-border bg-panel"
                      />
                      <span className="text-sm text-text">Data Proposta</span>
                    </label>

                    <label className="flex items-center space-x-2 cursor-pointer hover:bg-panel/50 p-2 rounded-lg">
                      <input
                        type="checkbox"
                        checked={columns.dataEvento}
                        onChange={(e) =>
                          setColumns((prev) => ({
                            ...prev,
                            dataEvento: e.target.checked,
                          }))
                        }
                        className="w-4 h-4 rounded border-border bg-panel"
                      />
                      <span className="text-sm text-text">Data Evento</span>
                    </label>

                    <label className="flex items-center space-x-2 cursor-pointer hover:bg-panel/50 p-2 rounded-lg">
                      <input
                        type="checkbox"
                        checked={columns.valorOfertado}
                        onChange={(e) =>
                          setColumns((prev) => ({
                            ...prev,
                            valorOfertado: e.target.checked,
                          }))
                        }
                        className="w-4 h-4 rounded border-border bg-panel"
                      />
                      <span className="text-sm text-text">
                        Valor Ofertado
                      </span>
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

        <div className="overflow-x-auto overflow-y-visible pb-4" style={{ scrollbarWidth: 'auto', scrollbarColor: 'rgb(var(--color-primary) / 0.5) rgb(var(--color-panel))' }}>
          {loading ? (
            <p className="p-6 text-muted">Carregando propostas…</p>
          ) : pag.items.length === 0 ? (
            <p className="p-6 text-muted">
              Nenhuma proposta encontrada.
            </p>
          ) : (
            <table className="w-full" style={{ minWidth: '1200px' }}>
              <thead>
                <tr className="border-b border-border">
                  {columns.dataProposta && (
                    <th className="text-left py-4 px-6 text-muted font-medium">
                      Data Proposta
                    </th>
                  )}
                  {columns.dataEvento && (
                    <th className="text-left py-4 px-6 text-muted font-medium">
                      Data Evento
                    </th>
                  )}
                  {columns.valorOfertado && (
                    <th className="text-left py-4 px-6 text-muted font-medium">
                      Valor Ofertado
                    </th>
                  )}
                  {columns.status && (
                    <th className="text-left py-4 px-6 text-muted font-medium">
                      Status
                    </th>
                  )}
                  <th className="text-left py-4 px-6 text-muted font-medium">
                    Evento
                  </th>
                  <th className="text-left py-4 px-6 text-muted font-medium">
                    Artista
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
                    {columns.dataProposta && (
                      <td className="py-4 px-6 text-muted">
                        {formatDate(p.data_proposta)}
                      </td>
                    )}
                    {columns.dataEvento && (
                      <td className="py-4 px-6 text-muted">
                        {formatDate(p.data_evento)}
                      </td>
                    )}
                    {columns.valorOfertado && (
                      <td className="py-4 px-6 text-text font-medium">
                        {formatCurrency(p.valor_ofertado)}
                      </td>
                    )}
                    {columns.status && (
                      <td className="py-4 px-6">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            p.aceito ||
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
                          {p.aceito ? 'ACEITA' : (p.status || 'DISPONÍVEL')}
                        </span>
                      </td>
                    )}
                    <td className="py-4 px-6">
                      <div>
                        <span className="text-xs text-muted block">
                          {p.evento?.titulo || 'Evento não especificado'}
                        </span>
                        {p.aceito && (
                          <span className="text-[10px] text-emerald-400 mt-1 inline-block">
                            ✓ Aceita por artista
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {p.artista ? (
                        <div>
                          <span className="text-sm text-text font-medium block">
                            {p.artista.nome || p.artista.name || 'Artista'}
                          </span>
                          <span className="text-[10px] text-emerald-400">
                            ✓ Confirmado
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted italic">
                          Aguardando artista
                        </span>
                      )}
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