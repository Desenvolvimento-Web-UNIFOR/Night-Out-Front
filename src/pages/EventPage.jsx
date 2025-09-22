import { motion } from "framer-motion";

export default function EventPage({ onNavigate, params }) {
  const id = params?.id;

  let event =
    Array.isArray(window.__EVENTS__)
      ? window.__EVENTS__.find((e) => String(e.id) === String(id))
      : null;

  if (!event) {
    event = {
      id,
      title: "Evento",
      date: "—",
      time: "—",
      price: "—",
      place: "",
      cover:
        "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1600&auto=format&fit=crop",
      hostAvatar:
        "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=256&auto=format&fit=crop",
      description:
        "Detalhes do evento indisponíveis no momento. Volte à lista de eventos e tente novamente.",
    };
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#0B1220] to-[#071224] text-white">
      <div className="mx-auto max-w-6xl px-4 py-6 flex items-center justify-between">
        <button
          onClick={() => onNavigate("/eventos")}
          className="inline-flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-sm hover:bg-white/10 transition"
        >
          ← Voltar
        </button>
        <div className="opacity-60 text-sm">
          Eventos #{String(event.id || "").padStart(2, "0")}
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
              src={event.cover || event.image}
              alt={event.title}
              className="h-[340px] w-full object-cover"
            />
            <img
              src={event.hostAvatar || event?.artist?.avatar}
              alt="host"
              className="absolute right-6 -bottom-8 h-16 w-16 rounded-2xl ring-4 ring-[#0B1220] object-cover"
            />
          </div>

          <div className="px-6 pt-12 pb-8 md:px-10">
            <h1 className="text-2xl md:text-[22px] font-semibold tracking-tight">
              {event.title}
            </h1>

            <p className="mt-4 max-w-3xl text-base leading-relaxed text-white/80">
              {event.description}
            </p>

            <div className="mt-6 grid gap-3 text-sm text-white/80 sm:grid-cols-3">
              <div className="flex items-center gap-2">📅 {event.date}</div>
              <div className="flex items-center gap-2">⏰ {event.time || "22:00"}</div>
              <div className="flex items-center gap-2">💵 {event.price}</div>
            </div>

            {event.place && (
              <div className="mt-3 flex items-center gap-2 text-sm text-white/70">
                📍 {event.place}
              </div>
            )}

            <div className="mt-8">
              <button className="rounded-2xl bg-[#2563eb] px-5 py-3 text-sm font-medium shadow-lg shadow-blue-500/20 hover:bg-[#1e4fd4] transition">
                Comprar Ingresso
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
