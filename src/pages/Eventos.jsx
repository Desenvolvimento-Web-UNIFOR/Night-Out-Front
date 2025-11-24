import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Ticket, ChevronRight, Music2 } from 'lucide-react';
import usePaginatedData from '../hooks/usePaginatedData';
import Pagination from '../components/Pagination';
import { authFetch } from '../services/auth';

const EVENT_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=400&fit=crop';

export default function Eventos({ onNavigate }) {
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [errorEvents, setErrorEvents] = useState('');

  useEffect(() => {
    async function loadEvents() {
      setLoadingEvents(true);
      setErrorEvents('');

      try {
        const data = await authFetch('/evento?page=1&pageSize=200', {
          method: 'GET',
        });

        const rawEvents = Array.isArray(data) ? data : data?.eventos || [];

        const mapped = await Promise.all(rawEvents.map(async (ev, index) => {
          const start = ev.data_inicio ? new Date(ev.data_inicio) : null;

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

          // Buscar artistas vinculados
          let artistNames = [];
          try {
            const artistsData = await authFetch(`/eventoArtista?id_evento=${ev.id_evento}`, {
              method: 'GET',
            });

            const artistsList = Array.isArray(artistsData)
              ? artistsData
              : artistsData?.items || [];

            artistNames = artistsList.map(a => 
              a.artista?.nome || a.nome || 'Artista'
            );
          } catch (e) {
            console.warn(`Erro ao carregar artistas do evento ${ev.id_evento}:`, e);
          }

          // Buscar foto do evento do localStorage
          const eventoId = ev.id_evento;
          const savedImage = localStorage.getItem(`event_image_${eventoId}`);

          return {
            id: ev.id_evento,
            title: ev.titulo,
            description: ev.descricao,
            date: dateLabel,
            time: timeLabel,
            place: ev.local || 'Local a definir',
            price: 'A combinar',
            artists: artistNames,
            image: savedImage || null,
          };
        }));

        setEvents(mapped);
        window.__EVENTS__ = mapped;
      } catch (e) {
        setErrorEvents(e?.message || 'Falha ao carregar eventos.');
      } finally {
        setLoadingEvents(false);
      }
    }

    loadEvents();
  }, []);

  const {
    items,
    page,
    pageSize,
    total,
    setPage,
  } = usePaginatedData({
    mode: 'local',
    localData: events,
    pageSize: 6,
  });

  const handleViewDetails = (id) => {
    if (onNavigate) {
      onNavigate(`/event/${id}`);
    }
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
            <h1 className="text-2xl font-bold text-text">Eventos disponíveis</h1>
            <p className="text-muted">
              Veja todos os eventos publicados pelas casas de show na plataforma.
            </p>
          </div>
        </div>

        {loadingEvents ? (
          <div className="py-16 text-center text-muted">
            <div className="spinner mx-auto mb-4" />
            Carregando eventos…
          </div>
        ) : errorEvents ? (
          <div className="py-8 text-center text-red-300 text-sm">
            {errorEvents}
          </div>
        ) : items.length === 0 ? (
          <div className="py-16 text-center text-muted">
            Nenhum evento disponível no momento.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((event, index) => {
                const cover = event.image || EVENT_FALLBACK_IMAGE;

                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="glass overflow-hidden flex flex-col"
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
                        {event.description}
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
                        <div className="flex items-center gap-2 text-muted">
                          <Ticket size={14} />
                          <span>{event.price}</span>
                        </div>
                        {event.artists && event.artists.length > 0 && (
                          <div className="flex items-start gap-2 text-muted">
                            <Music2 size={14} className="mt-0.5" />
                            <div className="flex flex-wrap gap-1">
                              {event.artists.map((artist, idx) => (
                                <span 
                                  key={idx}
                                  className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full"
                                >
                                  {artist}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => handleViewDetails(event.id)}
                        className="mt-auto inline-flex items-center justify-between w-full bg-primary hover:bg-primary/90 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                      >
                        <span>Ver detalhes</span>
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <Pagination
              page={page}
              pageSize={pageSize}
              total={total}
              onPageChange={setPage}
            />
          </>
        )}
      </motion.div>
    </div>
  );
}