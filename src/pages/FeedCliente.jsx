import React, { useEffect, useMemo, useState } from "react";
import { MapPin } from "lucide-react";
import { authFetch, getCurrentUser } from "../services/auth";

const EVENT_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=400&fit=crop';

function SectionTitle({ children, action, onAction }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-lg font-semibold">{children}</h3>
      {action ? (
        <button className="btn-ghost text-sm" onClick={onAction}>
          {action}
        </button>
      ) : null}
    </div>
  );
}

function Story({ name, img, label }) {
  return (
    <div className="w-[84px] shrink-0 text-center">
      <div className="story-ring p-[3px] rounded-full">
        <img
          src={img}
          alt={name}
          className="w-full h-[72px] rounded-full object-cover block"
          onError={(e) => {
            e.currentTarget.src = EVENT_FALLBACK_IMAGE;
          }}
        />
      </div>
      <div className="text-xs mt-1 opacity-90 truncate">{name}</div>
      <div className="text-[11px] opacity-60 truncate">{label}</div>
    </div>
  );
}

function EventCard({ event, onClick }) {
  return (
    <div className="feed-card overflow-hidden">
      <div className="relative">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-40 object-cover block"
          onError={(e) => {
            e.currentTarget.src = EVENT_FALLBACK_IMAGE;
          }}
        />
        <div className="absolute left-2 bottom-2 flex gap-2">
          {event.date && (
            <span className="badge-dark">
              {event.date}
              {event.time ? ` • ${event.time}` : ""}
            </span>
          )}
          {event.place && <span className="badge-dark">{event.place}</span>}
        </div>
      </div>

      <div className="p-3.5">
        <div className="flex flex-col gap-1">
          <strong className="text-base line-clamp-2">{event.title}</strong>
          {event.place && (
            <span className="opacity-80 flex items-center gap-1 text-sm">
              <MapPin className="h-3.5 w-3.5 opacity-70" /> {event.place}
            </span>
          )}
          <span className="text-sm opacity-90">
            {event.price || "A combinar"}
          </span>
        </div>
        <button
          type="button"
          className="btn-grad mt-3 w-full"
          onClick={onClick}
        >
          Ver detalhes
        </button>
      </div>
    </div>
  );
}

function formatRelativeTime(date) {
  if (!date) return "";
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffSec = Math.round(diffMs / 1000);
  const rtf = new Intl.RelativeTimeFormat("pt-BR", { numeric: "auto" });

  const divisions = [
    { amount: 60, unit: "second" },
    { amount: 60, unit: "minute" },
    { amount: 24, unit: "hour" },
    { amount: 7, unit: "day" },
    { amount: 4.34524, unit: "week" },
    { amount: 12, unit: "month" },
    { amount: Number.POSITIVE_INFINITY, unit: "year" },
  ];

  let duration = diffSec;
  for (const division of divisions) {
    if (Math.abs(duration) < division.amount) {
      return rtf.format(duration, division.unit);
    }
    duration /= division.amount;
  }
  return "";
}

function getArtistAvatar(artist) {
  if (artist.photo) return artist.photo;

  try {
    const id = artist.id;
    if (!id) return null;
    const saved = localStorage.getItem(`avatar_${id}`);
    return saved || null;
  } catch {
    return null;
  }
}

export default function FeedCliente({ onNavigate }) {
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [errorEvents, setErrorEvents] = useState("");

  const [artists, setArtists] = useState([]);
  const [loadingArtists, setLoadingArtists] = useState(true);
  const [errorArtists, setErrorArtists] = useState("");

  const user = useMemo(() => {
    const stored = getCurrentUser() || {};
    return {
      name: stored.nome || stored.name || "Convidado",
      city: stored.cidade || stored.city || "",
      interests: [],
    };
  }, []);

  useEffect(() => {
    async function loadEvents() {
      setLoadingEvents(true);
      setErrorEvents("");

      try {
        const data = await authFetch("/evento?page=1&pageSize=50", {
          method: "GET",
        });

        const rawEvents = Array.isArray(data) ? data : data?.eventos || [];

        const mapped = rawEvents.map((ev, index) => {
          const start = ev.data_inicio ? new Date(ev.data_inicio) : null;
          const created =
            ev.createdAt || ev.created_at
              ? new Date(ev.createdAt || ev.created_at)
              : start;

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

          const eventoId = ev.id_evento || ev.id;
          const savedImage = localStorage.getItem(`event_image_${eventoId}`);

          return {
            id: eventoId,
            title: ev.titulo,
            description: ev.descricao,
            date: dateLabel,
            time: timeLabel,
            place: ev.local || "Local a definir",
            price: "A combinar",
            image: savedImage || null,
            createdAt: created,
          };
        });

        setEvents(mapped);
        window.__EVENTS__ = mapped;
      } catch (e) {
        setErrorEvents(e?.message || "Falha ao carregar eventos.");
      } finally {
        setLoadingEvents(false);
      }
    }

    loadEvents();
  }, []);

  useEffect(() => {
    async function loadArtists() {
      setLoadingArtists(true);
      setErrorArtists("");

      try {
        const data = await authFetch("/artista?page=1&pageSize=10", {
          method: "GET",
        });

        const raw = Array.isArray(data) ? data : data?.artistas || data?.items || [];

        const mapped = raw.map((a) => ({
          id: a.id,
          name: a.nome_artista || a.nome,
          realName: a.nome,
          email: a.email,
          genre: a.genero_musical,
          photo: a.foto || a.avatar || null,
        }));

        setArtists(mapped);
      } catch (e) {
        setErrorArtists(e?.message || "Falha ao carregar artistas.");
      } finally {
        setLoadingArtists(false);
      }
    }

    loadArtists();
  }, []);

  const mainEvents = useMemo(() => events.slice(0, 6), [events]);

  const stories = useMemo(
    () =>
      events.slice(0, 10).map((ev, index) => ({
        id: ev.id || index,
        name: ev.title,
        img: ev.image,
        label: ev.date || ev.place || "",
      })),
    [events]
  );

  const activity = useMemo(
    () =>
      events
        .slice()
        .sort((a, b) => {
          const da = a.createdAt ? a.createdAt.getTime() : 0;
          const db = b.createdAt ? b.createdAt.getTime() : 0;
          return db - da;
        })
        .slice(0, 5)
        .map((ev) => ({
          id: ev.id,
          text: `Novo evento: ${ev.title}`,
          time: ev.createdAt ? formatRelativeTime(ev.createdAt) : "",
        })),
    [events]
  );

  const highlightEvents = useMemo(() => events.slice(0, 3), [events]);

  const handleViewEvent = (id) => {
    if (onNavigate) {
      onNavigate(`/event/${id}`);
    }
  };

  const handleSeeAllEvents = () => {
    if (onNavigate) {
      onNavigate("/eventos");
    }
  };

  const handleSeeAllArtists = () => {
    if (onNavigate) {
      onNavigate("/artistas");
    }
  };

  return (
    <div className="grid gap-5 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">
            Olá, {user.name}
            {user.city ? ` 👋` : " 👋"}
          </h2>
          <div className="opacity-80">
            {user.city
              ? `Descubra o que está bombando em ${user.city}`
              : "Descubra os melhores eventos para você"}
          </div>
        </div>
      </div>

      <div className="mt-1">
        {loadingEvents ? (
          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="w-[84px] h-[96px] rounded-full bg-panel/40 animate-pulse"
              />
            ))}
          </div>
        ) : stories.length === 0 ? (
          <div className="text-sm text-muted">
            Quando novos eventos forem publicados, eles aparecerão aqui.
          </div>
        ) : (
          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
            {stories.map((s) => (
              <Story key={s.id} {...s} />
            ))}
          </div>
        )}
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="grid gap-6">
          <div>
            <SectionTitle
              action={!loadingEvents && events.length > 0 ? "Ver todos" : null}
              onAction={handleSeeAllEvents}
            >
              Eventos perto de você
            </SectionTitle>

            {loadingEvents ? (
              <div className="grid grid-cols-12 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="col-span-12 sm:col-span-6 xl:col-span-4"
                  >
                    <div className="feed-card h-56 animate-pulse bg-panel/40" />
                  </div>
                ))}
              </div>
            ) : errorEvents ? (
              <div className="text-sm text-red-300">{errorEvents}</div>
            ) : mainEvents.length === 0 ? (
              <div className="text-sm text-muted">
                Nenhum evento disponível no momento.
              </div>
            ) : (
              <div className="grid grid-cols-12 gap-4">
                {mainEvents.map((ev) => (
                  <div
                    key={ev.id}
                    className="col-span-12 sm:col-span-6 xl:col-span-4"
                  >
                    <EventCard
                      event={ev}
                      onClick={() => handleViewEvent(ev.id)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        <div className="grid gap-6">
          <div className="feed-card">
            <div className="px-4 pt-3">
              <SectionTitle action={activity.length > 0 ? "Ver mais" : null}>
                Atividade recente
              </SectionTitle>
            </div>
            <div className="px-4 pb-4">
              {loadingEvents ? (
                <ul className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <li
                      key={i}
                      className="h-4 rounded bg-panel/40 animate-pulse"
                    />
                  ))}
                </ul>
              ) : activity.length === 0 ? (
                <p className="text-sm text-muted">
                  Ainda não há atividade recente. Explore os eventos disponíveis!
                </p>
              ) : (
                <ul className="list-none m-0">
                  {activity.map((a) => (
                    <li
                      key={a.id}
                      className="grid grid-cols-[1fr_auto] gap-1 py-2 border-b border-border/60 last:border-0"
                    >
                      <span className="text-sm">{a.text}</span>
                      <time className="opacity-60 text-[11px]">{a.time}</time>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="feed-card">
            <div className="px-4 pt-3">
              <SectionTitle
                action={!loadingArtists && artists.length > 0 ? "Ver todos" : null}
                onAction={handleSeeAllArtists}
              >
                Top artistas da semana
              </SectionTitle>
            </div>
            <div className="px-4 pb-4">
              {loadingArtists ? (
                <ul className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-3 h-10 bg-panel/40 rounded-xl animate-pulse"
                    />
                  ))}
                </ul>
              ) : errorArtists ? (
                <p className="text-sm text-red-300">{errorArtists}</p>
              ) : artists.length === 0 ? (
                <p className="text-sm text-muted">
                  Assim que artistas começarem a se cadastrar, eles aparecerão
                  aqui.
                </p>
              ) : (
                <ul className="list-none m-0 space-y-2">
                  {artists.map((artist) => {
                    const avatar = getArtistAvatar(artist);
                    return (
                      <li key={artist.id}>
                        <button
                          type="button"
                          onClick={() =>
                            onNavigate?.(`/artista/${artist.id}`)
                          }
                          className="flex items-center gap-3 w-full text-left hover:bg-panel/60 rounded-xl px-2 py-2 transition-colors"
                        >
                          {avatar ? (
                            <img
                              src={avatar}
                              alt={artist.name}
                              className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-panel flex items-center justify-center text-xs text-muted flex-shrink-0">
                              {String(artist.name || "?")
                                .charAt(0)
                                .toUpperCase()}
                            </div>
                          )}
                          <div className="flex flex-col">
                            <strong className="text-sm line-clamp-1">
                              {artist.name}
                            </strong>
                            <span className="text-xs opacity-70 line-clamp-1">
                              {artist.genre || artist.realName}
                            </span>
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}