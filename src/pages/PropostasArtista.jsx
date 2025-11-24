import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, CheckCircle2, XCircle } from "lucide-react";
import usePaginatedData from "../hooks/usePaginatedData";
import Pagination from "../components/Pagination";
import { authFetch, getCurrentUser } from "../services/auth";

export default function PropostasArtista() {
  const [propostas, setPropostas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null); // { type: 'success' | 'error', message: string }

  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [columns, setColumns] = useState({
    dataProposta: true,
    dataEvento: true,
    valorOfertado: true,
    status: true,
  });
  const [savingId, setSavingId] = useState(null);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  async function loadPropostas() {
    setLoading(true);
    setErr("");
    try {
      const [propsRes, eventosRes] = await Promise.all([
        authFetch("/propostaArtista?page=1&pageSize=1000", {
          method: "GET",
        }),
        authFetch("/evento?page=1&pageSize=1000", {
          method: "GET",
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

      // Criar mapa de eventos para lookup rápido
      const eventosMap = rawEvents.reduce((acc, ev) => {
        acc[ev.id_evento || ev.id] = ev;
        return acc;
      }, {});

      // Popular os eventos nas propostas
      const propostasComEventos = list.map((p) => ({
        ...p,
        evento: eventosMap[p.id_evento] || null,
      }));

      console.log('Propostas carregadas:', propostasComEventos.slice(0, 2));

      setPropostas(propostasComEventos);
    } catch (e) {
      setErr(e?.message || "Falha ao carregar propostas.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPropostas();
  }, []);

  const pag = usePaginatedData({
    mode: "local",
    localData: propostas,
    pageSize: 5,
    search,
  });

  const formatCurrency = (value) => {
    if (!value) return "-";

    const number = Number(value);
    if (Number.isNaN(number)) return value;

    return number.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const formatDate = (d) => {
    if (!d) return "-";
    try {
      return new Date(d).toLocaleDateString("pt-BR");
    } catch {
      return String(d);
    }
  };

  async function handleAccept(p) {
    if (!p?.id_proposta_artista) return;
    if (String(p.status || "").toUpperCase() !== "DISPONÍVEL") return;
    if (p.aceito) return; // Já foi aceita por algum artista

    try {
      setSavingId(p.id_proposta_artista);

      const currentUser = getCurrentUser();
      const idArtista = currentUser?.id;

      if (!idArtista) {
        throw new Error("Usuário não autenticado ou ID do artista não encontrado.");
      }

      // Atualizar o status da proposta para ACEITA e salvar o ID do artista
      const body = { 
        status: "ACEITA",
        aceito: idArtista 
      };

      console.log('Enviando atualização:', body);

      const response = await authFetch(`/propostaArtista/${p.id_proposta_artista}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      console.log('Resposta do backend:', response);

      // Vincular o artista ao evento
      if (p.id_evento) {
        try {
          await authFetch("/eventoArtista", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id_evento: p.id_evento,
              id_artista: idArtista,
            }),
          });
        } catch (e) {
          console.warn("Erro ao vincular artista ao evento:", e);
          // Continua mesmo se falhar, pois a proposta já foi aceita
        }
      }

      setPropostas((prev) =>
        prev.map((item) =>
          item.id_proposta_artista === p.id_proposta_artista
            ? { ...item, status: "ACEITA", aceito: idArtista }
            : item
        )
      );

      // Recarregar propostas para garantir dados atualizados do backend
      await loadPropostas();

      showToast('success', 'Proposta aceita com sucesso! Você foi vinculado ao evento.');
    } catch (e) {
      showToast('error', e?.message || 'Não foi possível aceitar a proposta.');
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed top-6 right-6 z-50 max-w-md"
          >
            <div
              className={`glass p-4 rounded-xl shadow-2xl border ${
                toast.type === 'success'
                  ? 'border-emerald-500/40 bg-emerald-500/10'
                  : 'border-red-500/40 bg-red-500/10'
              }`}
            >
              <div className="flex items-start gap-3">
                {toast.type === 'success' ? (
                  <CheckCircle2 className="text-emerald-400 mt-0.5" size={20} />
                ) : (
                  <XCircle className="text-red-400 mt-0.5" size={20} />
                )}
                <div className="flex-1">
                  <p
                    className={`text-sm font-medium ${
                      toast.type === 'success' ? 'text-emerald-300' : 'text-red-300'
                    }`}
                  >
                    {toast.type === 'success' ? 'Sucesso!' : 'Erro'}
                  </p>
                  <p className="text-sm text-text mt-1">{toast.message}</p>
                </div>
                <button
                  onClick={() => setToast(null)}
                  className="text-muted hover:text-text transition-colors"
                >
                  ×
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h2 className="text-2xl font-bold text-text mb-1">
            Propostas recebidas pelo artista
          </h2>
          <p className="text-muted">
            Veja e aceite as ofertas enviadas pelas casas de show.
          </p>
        </div>
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
                  <th className="text-left py-4 px-6 text-muted font-medium">
                    Evento
                  </th>
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
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {pag.items.map((p, index) => {
                  const statusUpper = String(p.status || "").toUpperCase();
                  const isDisponivel =
                    statusUpper === "DISPONÍVEL" &&
                    !p.aceito; // Só está disponível se ninguém aceitou ainda

                  const currentUser = getCurrentUser();
                  const foiAceitoPorMim = p.aceito === currentUser?.id;

                  console.log('Proposta:', {
                    id: p.id_proposta_artista,
                    status: p.status,
                    statusUpper,
                    aceito: p.aceito,
                    isDisponivel
                  });

                  return (
                    <motion.tr
                      key={
                        p.id_proposta_artista ||
                        `${p.id_evento}-${p.id_casa}-${index}`
                      }
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      className="border-b border-border hover:bg-panel/30 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="text-text font-medium">
                          {p.evento?.titulo || 'Evento não especificado'}
                        </div>
                        {p.termos && (
                          <p className="text-xs text-muted mt-1 line-clamp-2">
                            {p.termos}
                          </p>
                        )}
                      </td>
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
                              String(p.status || "")
                                .toUpperCase()
                                .includes("ACEITA")
                                ? "bg-emerald-500/15 text-emerald-400"
                                : String(p.status || "")
                                    .toUpperCase()
                                    .includes("RECUS")
                                ? "bg-red-500/15 text-red-400"
                                : "bg-primary/15 text-primary"
                            }`}
                          >
                            {p.aceito ? "ACEITA" : (p.status || "DISPONÍVEL")}
                          </span>
                        </td>
                      )}
                      <td className="py-4 px-6">
                        {isDisponivel ? (
                          <button
                            type="button"
                            onClick={() => handleAccept(p)}
                            disabled={savingId === p.id_proposta_artista}
                            className="btn-primary px-3 py-1.5 text-xs rounded-full disabled:opacity-60"
                          >
                            {savingId === p.id_proposta_artista
                              ? "Aceitando..."
                              : "Aceitar"}
                          </button>
                        ) : p.aceito ? (
                          <span className="text-xs text-muted">
                            {foiAceitoPorMim ? "✓ Você aceitou" : "Já aceita por outro artista"}
                          </span>
                        ) : (
                          <span className="text-xs text-muted">—</span>
                        )}
                      </td>
                    </motion.tr>
                  );
                })}
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