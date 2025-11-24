import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Clock3, Ticket, MapPin } from "lucide-react";
import { authFetch } from "../services/auth";

const EVENT_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=400&fit=crop';

export default function EventPage({ onNavigate, params }) {
  const id = params?.id;
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    async function loadEvent() {
      setLoading(true);

      try {
        const data = await authFetch(`/evento/${id}`, { method: "GET" });

        const start = data.data_inicio ? new Date(data.data_inicio) : null;

        const dateLabel = start
          ? start.toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "short",
            })
          : "";

        const timeLabel = start
          ? start.toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "";

        const savedImage = localStorage.getItem(`event_image_${data.id_evento}`);

        setEvent({
          id: data.id_evento,
          title: data.titulo,
          description:
            data.descricao ||
            "Um evento imperdível para quem curte boa música e uma noite inesquecível.",
          date: dateLabel,
          time: timeLabel,
          place: data.local || "Local a definir",
          price: "A combinar",
          cover: savedImage || EVENT_FALLBACK_IMAGE,
        });

        // Buscar artistas vinculados ao evento
        try {
          const artistsData = await authFetch(`/eventoArtista?id_evento=${id}`, { 
            method: "GET" 
          });

          const artistsList = Array.isArray(artistsData) 
            ? artistsData 
            : artistsData?.items || [];

          setArtists(artistsList);
        } catch (e) {
          console.warn("Erro ao carregar artistas do evento:", e);
          setArtists([]);
        }
      } catch (e) {
        console.error("Erro ao carregar evento:", e);
        setEvent(null);
      } finally {
        setLoading(false);
      }
    }

    loadEvent();
  }, [id]);

  if (loading || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Carregando evento...
      </div>
    );
  }

  const message = encodeURIComponent(
    `Gostaria de saber mais sobre o evento ${event.title}`
  );
  const whatsappURL = `https://wa.me/558897140476?text=${message}`;

  const dateDisplay = event.date || "Data a definir";
  const timeDisplay = event.time || "Horário a definir";
  const priceDisplay =
    event.price || "A combinar com a casa de show / artista";

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#0B1220] to-[#071224] text-white">
      <div className="mx-auto max-w-6xl px-4 py-6 flex items-center justify-between">
        <button
          onClick={() => onNavigate("/eventos")}
          className="inline-flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-sm hover:bg-white/10 transition"
        >
          ← Voltar para eventos
        </button>
        <div className="opacity-60 text-sm">
          Evento #{String(event.id).padStart(2, "0")}
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative overflow-hidden rounded-3xl bg-white/5 ring-1 ring-white/10"
        >
          <div className="relative">
            <img
              src={event.cover}
              alt={event.title}
              className="h-[340px] w-full object-cover"
              onError={(e) => (e.currentTarget.src = EVENT_FALLBACK_IMAGE)}
            />
          </div>

          <div className="px-6 pt-8 pb-8 md:px-10">
            <h1 className="text-2xl md:text-[24px] font-semibold tracking-tight">
              {event.title}
            </h1>

            <p className="mt-4 max-w-3xl text-base leading-relaxed text-white/80">
              {event.description}
            </p>

            <div className="mt-7">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-white/60 mb-3">
                Informações do evento
              </h2>

              <div className="grid gap-4 text-sm sm:grid-cols-3">
                <div className="flex items-start gap-3 rounded-2xl bg-white/5 px-3 py-3">
                  <div className="mt-0.5">
                    <CalendarDays className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-wide text-white/60">
                      Data
                    </div>
                    <div className="text-sm font-medium text-white">
                      {dateDisplay}
                    </div>
                    <p className="text-xs text-white/60 mt-0.5">
                      Programe-se para não perder esse dia.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl bg-white/5 px-3 py-3">
                  <div className="mt-0.5">
                    <Clock3 className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-wide text-white/60">
                      Horário de início
                    </div>
                    <div className="text-sm font-medium text-white">
                      {timeDisplay}
                    </div>
                    <p className="text-xs text-white/60 mt-0.5">
                      Chegue com antecedência para curtir tudo com calma.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl bg-white/5 px-3 py-3">
                  <div className="mt-0.5">
                    <Ticket className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-wide text-white/60">
                      Ingressos / valor
                    </div>
                    <div className="text-sm font-medium text-white">
                      {priceDisplay}
                    </div>
                    <p className="text-xs text-white/60 mt-0.5">
                      Consulte detalhes com a produção pelo WhatsApp.
                    </p>
                  </div>
                </div>
              </div>

              {event.place && (
                <div className="mt-4 flex items-start gap-2 text-sm text-white/80">
                  <MapPin className="h-4 w-4 mt-[3px] text-blue-400" />
                  <div>
                    <span className="font-medium">Local: </span>
                    <span>{event.place}</span>
                  </div>
                </div>
              )}
            </div>

            {artists.length > 0 && (
              <div className="mt-7">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-white/60 mb-3">
                  Artistas confirmados
                </h2>
                <div className="flex flex-wrap gap-2">
                  {artists.map((artist, idx) => (
                    <span
                      key={artist.id_artista || idx}
                      className="inline-flex items-center px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-sm font-medium"
                    >
                      {artist.artista?.nome || artist.nome || `Artista ${idx + 1}`}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8">
              <a
                href={whatsappURL}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-2xl bg-[#2563eb] px-5 py-3 text-sm font-medium shadow-lg shadow-blue-500/20 hover:bg-[#1e4fd4] transition"
              >
                <span>Entre em contato</span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}