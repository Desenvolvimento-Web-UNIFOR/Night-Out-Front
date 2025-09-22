import React from "react";
import { CalendarHeart, Heart, HeartOff, MapPin } from "lucide-react";
import { eventsData } from "../data/mocks";

const USER = {
  name: "Rafael",
  city: "São Paulo",
  interests: ["Eletrônica", "Funk", "Sertanejo", "Pop"],
};

const STORIES = [
  { id: 1, name: "Ana", img: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=400", label: "Comprou 🎟️" },
  { id: 2, name: "Caio", img: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=400", label: "Noite 🎧" },
  { id: 3, name: "Luna", img: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=400", label: "Vai 📍" },
  { id: 4, name: "Diego", img: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?q=80&w=400", label: "Curtindo 🔥" },
  { id: 5, name: "Você", img: "https://images.unsplash.com/photo-1517816743773-6e0fd518b4a6?q=80&w=400", label: "Adicionar +" },
];

const ACTIVITY = [
  { id: "a1", text: "Ana Costa comprou 2 ingressos para Noite Techno.", time: "há 5 min" },
  { id: "a2", text: "Diego começou a seguir Galpão 011.", time: "há 21 min" },
  { id: "a3", text: "Luna avaliou 'Sunset Sertanejo' com 5 ⭐.", time: "há 1 h" },
];

const TOP_ARTISTS = [
  { id: "ar1", name: "DJ Nebula", img: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=400" },
  { id: "ar2", name: "MC Aurora", img: "https://images.unsplash.com/photo-1445053023192-8d45cb66099d?q=80&w=400" },
  { id: "ar3", name: "Banda Horizonte", img: "https://images.unsplash.com/photo-1520975932165-5fdf59f6c67f?q=80&w=400" },
];

function SectionTitle({ children, action }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-lg font-semibold">{children}</h3>
      {action ? <button className="btn-ghost">{action}</button> : null}
    </div>
  );
}

function Story({ name, img, label }) {
  return (
    <div className="w-[84px] shrink-0 text-center">
      <div className="story-ring p-[3px] rounded-full">
        <img src={img} alt={name} className="w-full h-[72px] rounded-full object-cover block" />
      </div>
      <div className="text-xs mt-1 opacity-90">{name}</div>
      <div className="text-[11px] opacity-60">{label}</div>
    </div>
  );
}

function EventCard({ event }) {
  const liked = Math.random() > 0.5;
  return (
    <div className="feed-card overflow-hidden">
      <div className="relative">
        <img src={event.image} alt={event.title} className="w-full h-40 object-cover block" />
        <div className="absolute left-2 bottom-2 flex gap-2">
          <span className="badge-dark">{event.artist?.name || "Artista"}</span>
          <span className="badge-dark">Hoje à noite</span>
        </div>
        <button className="like-btn" title="Curtir" aria-label="Curtir">
          {liked ? <Heart className="h-4 w-4" /> : <HeartOff className="h-4 w-4" />}
        </button>
      </div>

      <div className="p-3.5">
        <div className="flex flex-col gap-1">
          <strong className="text-base">{event.title}</strong>
          <span className="opacity-80 flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 opacity-70" /> {event.place || "Local surpresa"} • 22:00
          </span>
          <span className="text-sm opacity-90">{event.price || "A partir de R$ 50"}</span>
        </div>
        <button className="btn-grad mt-3 w-full">Ver detalhes</button>
      </div>
    </div>
  );
}

export default function FeedCliente() {
  return (
    <div className="grid gap-5 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Olá, {USER.name} 👋</h2>
          <div className="opacity-80">Descubra o que está bombando em {USER.city}</div>
        </div>
        <div className="flex gap-2">
          <button className="btn-ghost">Explorar</button>
          <button className="btn-ghost">Seguindo</button>
          <button className="btn-ghost">Próximos</button>
        </div>
      </div>

      <div className="mt-1">
        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
          {STORIES.map((s) => (
            <Story key={s.id} {...s} />
          ))}
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="grid gap-6">
          <div>
            <SectionTitle action="Ver todos">Eventos perto de você</SectionTitle>
            <div className="grid grid-cols-12 gap-4">
              {eventsData.slice(0, 6).map((ev) => (
                <div key={ev.id} className="col-span-12 sm:col-span-6 xl:col-span-4">
                  <EventCard event={ev} />
                </div>
              ))}
            </div>
          </div>

          <div>
            <SectionTitle action="Ajustar">Recomendações para você</SectionTitle>
            <div className="flex flex-wrap gap-2">
              {USER.interests.map((i) => (
                <span key={i} className="chip">{i}</span>
              ))}
              <span className="chip">Bebidas em promoção</span>
              <span className="chip">Open Bar</span>
              <span className="chip">Hoje à noite</span>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          <div className="feed-card">
            <div className="px-4 pt-3">
              <SectionTitle action="Ver mais">Atividade dos amigos</SectionTitle>
            </div>
            <ul className="list-none m-0 px-4 pb-4">
              {ACTIVITY.map((a) => (
                <li key={a.id} className="grid grid-cols-[1fr_auto] gap-1 py-2 border-b border-border/60 last:border-0">
                  <span>{a.text}</span>
                  <time className="opacity-60 text-xs">{a.time}</time>
                </li>
              ))}
            </ul>
          </div>

          <div className="feed-card">
            <div className="px-4 pt-3">
              <SectionTitle action="Ranking">Top Artistas da Semana</SectionTitle>
            </div>
            <div className="grid gap-2 px-4 pb-4">
              {TOP_ARTISTS.map((a) => (
                <div key={a.id} className="flex items-center gap-3">
                  <img src={a.img} alt={a.name} className="w-10 h-10 rounded-xl object-cover" />
                  <div className="flex flex-col">
                    <strong>{a.name}</strong>
                    <span className="text-xs opacity-70">Sugerido para você</span>
                  </div>
                  <div className="ml-auto">
                    <button className="btn-ghost">Seguir</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
