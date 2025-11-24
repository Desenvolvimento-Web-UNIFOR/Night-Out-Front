import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Music2, DollarSign } from 'lucide-react';
import { authFetch, getCurrentUser } from '../services/auth';

const EVENT_FALLBACK_IMAGE = '';

export default function EventosArtista() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadEventosArtista() {
      setLoading(true);
      setError('');
      
      try {
        const currentUser = getCurrentUser();
        const idArtista = currentUser?.id;

        if (!idArtista) {
          throw new Error('Usuário não autenticado');
        }

        // Buscar propostas aceitas pelo artista
        const [propostasRes, eventosRes] = await Promise.all([
          authFetch('/propostaArtista?page=1&pageSize=1000', {
            method: 'GET',
          }),
          authFetch('/evento?page=1&pageSize=1000', {
            method: 'GET',
          }),
        ]);

        const propostas = Array.isArray(propostasRes)
          ? propostasRes
          : propostasRes?.items || [];

        const rawEvents = Array.isArray(eventosRes)
          ? eventosRes
          : eventosRes?.eventos || eventosRes?.items || [];

        // Filtrar apenas propostas aceitas pelo artista logado
        const propostasAceitas = propostas.filter(
          (p) => p.aceito === idArtista
        );

        // Criar mapa de eventos
        const eventosMap = rawEvents.reduce((acc, ev) => {
          acc[ev.id_evento || ev.id] = ev;
          return acc;
        }, {});

        // Mapear eventos aceitos com informações da proposta
        const eventosDoArtista = propostasAceitas
          .map((p) => {
            const evento = eventosMap[p.id_evento];
            if (!evento) return null;

            const start = evento.data_inicio
              ? new Date(evento.data_inicio)
              : null;

            const dateLabel = start
              ? start.toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'short',
                })
              : '';

            const timeLabel = start
              ? start.toLocaleTimeString('pt-BR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : '';

            // Buscar foto do evento do localStorage
            const eventoId = evento.id_evento;
            const savedImage = localStorage.getItem(`event_image_${eventoId}`);

            return {
              id: evento.id_evento,
              title: evento.titulo,
              description: evento.descricao,
              date: dateLabel,
              time: timeLabel,
              place: evento.local || 'Local a definir',
              cache: p.valor_ofertado || '0',
              termos: p.termos || '',
              data_evento: p.data_evento,
              data_inicio: evento.data_inicio,
              image: savedImage, // Foto salva ou null
            };
          })
          .filter((ev) => ev !== null)
          .sort((a, b) => {
            const dateA = a.data_inicio ? new Date(a.data_inicio) : new Date();
            const dateB = b.data_inicio ? new Date(b.data_inicio) : new Date();
            return dateA - dateB;
          });

        setEvents(eventosDoArtista);
      } catch (e) {
        setError(e?.message || 'Falha ao carregar eventos.');
      } finally {
        setLoading(false);
      }
    }

    loadEventosArtista();
  }, []);

  const formatCurrency = (value) => {
    if (!value) return 'R$ 0,00';
    const number = Number(value);
    if (Number.isNaN(number)) return value;
    return number.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-text flex items-center gap-2">
              <Music2 className="text-primary" size={28} />
              Meus Eventos
            </h1>
            <p className="text-muted mt-1">
              Eventos confirmados onde você irá se apresentar
            </p>
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center text-muted">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
            Carregando seus eventos…
          </div>
        ) : error ? (
          <div className="py-8 text-center text-red-300 text-sm">
            {error}
          </div>
        ) : events.length === 0 ? (
          <div className="py-16 text-center text-muted">
            <Music2 size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg">Você ainda não tem eventos confirmados.</p>
            <p className="text-sm mt-2">
              Aceite propostas na aba &quot;Propostas&quot; para ver seus eventos aqui.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event, index) => {
              const cover = event.image || EVENT_FALLBACK_IMAGE;

              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="glass overflow-hidden flex flex-col hover:border-primary/50 transition-all duration-300"
                >
                  <div className="relative h-40">
                    <img
                      src={cover}
                      alt={event.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = EVENT_FALLBACK_IMAGE;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                    <div className="absolute bottom-3 left-3 right-3">
                      <p className="text-xs text-gray-200 mb-1 flex items-center gap-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-black/40 text-[11px]">
                          {event.date || 'Em breve'}
                        </span>
                        {event.time && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-black/40 text-[11px]">
                            {event.time}
                          </span>
                        )}
                      </p>
                      <h3 className="text-white font-semibold text-lg leading-tight">
                        {event.title}
                      </h3>
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col">
                    <p className="text-muted text-sm mb-3 line-clamp-2">
                      {event.description || 'Sem descrição'}
                    </p>

                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex items-center gap-2 text-muted">
                        <MapPin size={14} />
                        <span>{event.place}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted">
                        <Clock size={14} />
                        <span>{event.time || 'Horário a definir'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-emerald-400">
                        <DollarSign size={14} />
                        <span className="font-semibold">
                          {formatCurrency(event.cache)}
                        </span>
                      </div>
                    </div>

                    {event.termos && (
                      <div className="mt-auto p-3 bg-panel/50 rounded-lg border border-border">
                        <p className="text-xs text-muted line-clamp-2">
                          <span className="font-semibold">Termos:</span>{' '}
                          {event.termos}
                        </p>
                      </div>
                    )}

                    <div className="mt-3 pt-3 border-t border-border">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
                        ✓ Confirmado
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}
