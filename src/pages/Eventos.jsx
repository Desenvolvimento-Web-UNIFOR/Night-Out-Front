import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Ticket, ChevronRight } from 'lucide-react';
import usePaginatedData from '../hooks/usePaginatedData';
import Pagination from '../components/Pagination';
import { authFetch } from '../services/auth';

const EVENT_COVERS = [
  'https://images.unsplash.com/photo-1514517521153-1be72277b32e?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1512427691650-1e0c2f9a81b3?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1518976024611-28bf4b48222e?auto=format&fit=crop&w=800&q=80',
];

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

        const mapped = rawEvents.map((ev, index) => {
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

          return {
            id: ev.id_evento,
            title: ev.titulo,
            description: ev.descricao,
            date: dateLabel,
            time: timeLabel,
            place: ev.local || 'Local a definir',
            price: 'A combinar',
            image: EVENT_COVERS[index % EVENT_COVERS.length],
          };
        });

        setEvents(mapped);
        window.__EVENTS__ = mapped;
      } catch (e) {
        console.error('Erro ao carregar eventos:', e);
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
              {items.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="glass overflow-hidden flex flex-col"
                >
                  <div className="relative h-40">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover"
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
              ))}
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