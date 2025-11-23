import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Users,
  Music,
  Star,
  MapPin,
  Clock,
} from 'lucide-react';
import KPICard from '../components/KPICard';
import { authFetch, getCurrentUser } from '../services/auth';

export default function DashboardCasaShow() {
  const [events, setEvents] = useState([]);
  const [propostas, setPropostas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setErr('');
      try {
        const currentUser = getCurrentUser();

        const [eventRes, propsRes] = await Promise.all([
          authFetch('/evento?page=1&pageSize=1000', { method: 'GET' }),
          authFetch('/propostaCasa?page=1&pageSize=1000', { method: 'GET' }),
        ]);

        const rawEvents = Array.isArray(eventRes)
          ? eventRes
          : Array.isArray(eventRes?.items)
          ? eventRes.items
          : Array.isArray(eventRes?.eventos)
          ? eventRes.eventos
          : [];

        const filteredEvents = currentUser?.id
          ? rawEvents.filter((ev) => ev.id_usuario === currentUser.id)
          : rawEvents;

        const rawPropostas = Array.isArray(propsRes)
          ? propsRes
          : Array.isArray(propsRes?.items)
          ? propsRes.items
          : [];

        setEvents(filteredEvents);
        setPropostas(rawPropostas);
      } catch (e) {
        console.error(e);
        setErr(e?.message || 'Falha ao carregar dados do painel.');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const now = new Date();

  const parseDate = (value) => {
    if (!value) return null;
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
  };

  const formatDate = (d) => {
    const dt = parseDate(d);
    if (!dt) return '-';
    return dt.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
    });
  };

  const formatTime = (d) => {
    const dt = parseDate(d);
    if (!dt) return '';
    return dt.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
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

  const upcomingEvents = [...events]
    .filter((ev) => {
      const dt = parseDate(ev.data_inicio);
      return dt && dt >= now;
    })
    .sort((a, b) => {
      const da = parseDate(a.data_inicio);
      const db = parseDate(b.data_inicio);
      return da - db;
    })
    .slice(0, 10);

  const recentPropostas = [...propostas]
    .sort((a, b) => {
      const da = parseDate(a.data_proposta);
      const db = parseDate(b.data_proposta);
      if (!da || !db) return 0;
      return db - da;
    })
    .slice(0, 10);

  const totalEvents = events.length;
  const totalFutureEvents = upcomingEvents.length;
  const totalPropostas = propostas.length;
  const propostasAceitas = propostas.filter((p) =>
    String(p.status || '').toUpperCase().includes('ACEITA')
  ).length;

  const casaKPIs = [
    {
      title: 'Eventos da Casa',
      value: loading ? '...' : String(totalEvents),
      trend: 'up',
      icon: Calendar,
    },
    {
      title: 'Próximos Eventos',
      value: loading ? '...' : String(totalFutureEvents),
      trend: 'up',
      icon: Music,
    },
    {
      title: 'Propostas Enviadas',
      value: loading ? '...' : String(totalPropostas),
      trend: 'up',
      icon: Users,
    },
    {
      title: 'Propostas Aceitas',
      value: loading ? '...' : String(propostasAceitas),
      trend: 'up',
      icon: Star,
    },
  ];

  const year = now.getFullYear();
  const month = now.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const startingWeekday = firstDayOfMonth.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const eventsThisMonth = events.filter((ev) => {
    const dt = parseDate(ev.data_inicio);
    return (
      dt &&
      dt.getMonth() === month &&
      dt.getFullYear() === year
    );
  });

  const eventsByDay = eventsThisMonth.reduce((acc, ev) => {
    const dt = parseDate(ev.data_inicio);
    if (!dt) return acc;
    const day = dt.getDate();
    acc[day] = acc[day] || [];
    acc[day].push(ev);
    return acc;
  }, {});

  const weeks = [];
  let currentWeek = new Array(startingWeekday).fill(null);
  for (let day = 1; day <= daysInMonth; day += 1) {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(null);
    }
    weeks.push(currentWeek);
  }

  const monthLabel = now.toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-text mb-2">
          Painel da Casa de Show
        </h1>
        <p className="text-muted">
          Visão geral dos seus eventos e propostas
        </p>
      </motion.div>

      {err && (
        <div className="glass p-4 border border-red-500/40 text-red-300 text-sm rounded-xl">
          {err}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {casaKPIs.map((kpi, index) => (
          <KPICard key={index} {...kpi} index={index} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div className="glass p-6">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="text-primary" size={24} />
            <h2 className="text-xl font-semibold text-text">
              Próximos eventos da casa
            </h2>
          </div>

          {loading ? (
            <p className="text-muted text-sm">Carregando…</p>
          ) : upcomingEvents.length === 0 ? (
            <p className="text-muted text-sm">Nenhum evento futuro.</p>
          ) : (
            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2">
              {upcomingEvents.map((ev) => (
                <div
                  key={ev.id_evento || ev.id}
                  className="min-w-[260px] max-w-xs glass-light p-4 rounded-2xl snap-center shrink-0"
                >
                  <h3 className="font-semibold text-text text-lg mb-1">
                    {ev.titulo}
                  </h3>
                  <p className="text-muted text-xs mb-3">{ev.descricao}</p>
                  <div className="space-y-1 text-sm text-muted">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} />
                      <span>
                        {formatDate(ev.data_inicio)} •
                        {formatTime(ev.data_inicio)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={14} />
                      <span>{ev.local}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div className="glass p-6">
          <div className="flex items-center gap-3 mb-4">
            <Music className="text-primary" size={24} />
            <h2 className="text-xl font-semibold text-text">
              Propostas da casa
            </h2>
          </div>

          {loading ? (
            <p className="text-muted text-sm">Carregando…</p>
          ) : recentPropostas.length === 0 ? (
            <p className="text-muted text-sm">Nenhuma proposta.</p>
          ) : (
            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2">
              {recentPropostas.map((p, idx) => (
                <div
                  key={p.id_proposta_casa || idx}
                  className="min-w-[260px] max-w-xs glass-light p-4 rounded-2xl snap-center shrink-0"
                >
                  <p className="text-muted text-xs mb-1">
                    ID: {p.id_proposta_casa}
                  </p>
                  <p className="text-muted text-xs mb-3">
                    Evento: {p.id_evento} • Artista: {p.id_artista}
                  </p>

                  <div className="space-y-1 text-sm text-muted">
                    <div>
                      <span>Data da proposta: </span>
                      <span className="text-text">
                        {formatDate(p.data_proposta)}
                      </span>
                    </div>
                    <div>
                      <span>Data do evento: </span>
                      <span className="text-text">
                        {formatDate(p.data_evento)}
                      </span>
                    </div>
                    <div>
                      <span>Valor: </span>
                      <span className="text-text font-semibold">
                        {formatCurrency(p.valor_ofertado)}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`mt-3 inline-block px-2 py-1 rounded text-xs font-semibold ${
                      String(p.status || '')
                        .toUpperCase()
                        .includes('ACEITA')
                        ? 'bg-green-500/20 text-green-400'
                        : String(p.status || '')
                            .toUpperCase()
                            .includes('RECUS')
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-primary/20 text-primary'
                    }`}
                  >
                    {p.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      <motion.div className="glass p-6">
        <h2 className="text-xl font-semibold text-text mb-4">
          Calendário de eventos do mês
        </h2>

        <div className="bg-black rounded-2xl p-4 border border-zinc-800">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white capitalize">{monthLabel}</span>
            <span className="text-xs text-zinc-400">
              Dias em laranja têm eventos
            </span>
          </div>

          <div className="grid grid-cols-7 gap-2 text-[11px] text-zinc-400 mb-2">
            {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d) => (
              <div key={d} className="text-center">{d}</div>
            ))}
          </div>

          <div className="space-y-2">
            {weeks.map((week, wIdx) => (
              <div key={wIdx} className="grid grid-cols-7 gap-2">
                {week.map((day, dIdx) => {
                  if (!day) return <div key={dIdx} className="h-9" />;

                  const hasEvents = !!eventsByDay[day];
                  const isToday =
                    day === now.getDate() &&
                    month === now.getMonth() &&
                    year === now.getFullYear();

                  return (
                    <div
                      key={dIdx}
                      className={[
                        'w-9 h-9 flex items-center justify-center rounded-lg text-sm',
                        hasEvents
                          ? 'bg-orange-500 text-black font-semibold'
                          : 'bg-zinc-900 text-zinc-300 border border-zinc-700',
                        isToday ? 'ring-2 ring-white/50' : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}