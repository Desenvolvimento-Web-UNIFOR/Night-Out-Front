import { motion } from "framer-motion";
import {
  Music2,
  DollarSign,
  CalendarDays,
  Users,
  CheckCircle2,
  Clock,
  MapPin,
  Star,
  MessageSquare,
  ArrowRight,
} from "lucide-react";

const ARTIST = {
  name: "Nattan Lima",
  email: "nattan@email.com",
  avatar:
    "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=200&h=200&fit=crop&crop=faces&auto=format",
  location: "Fortaleza, CE",
  followers: "128K",
  following: "412",
};

const KPIS = [
  { label: "Saldo", value: "R$ 13.900", icon: DollarSign, tone: "text-success bg-success/15" },
  { label: "Propostas", value: "6", icon: MessageSquare, tone: "text-primary bg-primary/15" },
  { label: "Shows (Mês)", value: "12", icon: Music2, tone: "text-accent bg-accent/15" },
  { label: "Seguidores", value: ARTIST.followers, icon: Users, tone: "text-primary2 bg-primary2/15" },
];

const UPCOMING = [
  {
    id: "ev1",
    title: "Sunrise Beachclub",
    date: "29 de janeiro",
    place: "Praia do Futuro",
    cover:
      "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "ev2",
    title: "Living",
    date: "02 de fevereiro",
    place: "Aldeota",
    cover:
      "https://images.unsplash.com/photo-1571266028243-d220c7e8fe28?q=80&w=1200&auto=format&fit=crop",
  },
];

const RECENTS = [
  {
    id: "st1",
    name: "Bulls Beer",
    img: "https://images.unsplash.com/photo-1543007630-9710e4a00a20?q=80&w=800&auto=format&fit=crop",
    tag: "Rock • Burgers • Chopp",
  },
  {
    id: "st2",
    name: "Living",
    img: "https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?q=80&w=800&auto=format&fit=crop",
    tag: "Eletrônica • Drinks autorais",
  },
  {
    id: "st3",
    name: "Retro Bar",
    img: "https://images.unsplash.com/photo-1559386484-97dfc0e15539?q=80&w=800&auto=format&fit=crop",
    tag: "80/90 • Clássicos",
  },
];

export default function DashboardArtista({ onNavigate }) {
  return (
    <div className="space-y-6">
      {/* Top: avatar + boas vindas + info rápida */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass p-6"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <img
            src={ARTIST.avatar}
            alt={ARTIST.name}
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-primary/30"
          />
          <div className="flex-1">
            <h1 className="text-2xl font-bold tracking-tight">{ARTIST.name}</h1>
            <div className="mt-1 text-muted">{ARTIST.email}</div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 w-full md:w-auto">
            <div className="px-4 py-3 bg-panel rounded-xl border border-border text-center">
              <div className="text-sm text-muted">Local</div>
              <div className="font-semibold flex items-center justify-center gap-2">
                <MapPin className="w-4 h-4 opacity-70" /> {ARTIST.location}
              </div>
            </div>
            <div className="px-4 py-3 bg-panel rounded-xl border border-border text-center">
              <div className="text-sm text-muted">Seguindo</div>
              <div className="font-semibold">{ARTIST.following}</div>
            </div>
            <div className="px-4 py-3 bg-panel rounded-xl border border-border text-center col-span-2 md:col-span-1">
              <div className="text-sm text-muted">Taxa de Satisfação</div>
              <div className="font-semibold text-success flex items-center justify-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> 95%
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {KPIS.map((k, i) => (
          <motion.div
            key={k.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            className="glass p-5 hover:glow-primary transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted">{k.label}</div>
                <div className="text-2xl font-bold mt-1">{k.value}</div>
              </div>
              <div className={`p-3 rounded-xl ${k.tone}`}>
                <k.icon className="w-5 h-5" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Proposta em destaque + Próximos eventos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Proposta */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass p-6 lg:col-span-2 relative overflow-hidden"
        >
          <div
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1497032205916-ac775f0649ae?q=80&w=1200&auto=format&fit=crop')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-bg/90 via-bg/70 to-transparent" />
          <div className="relative z-10">
            <div className="text-xs text-muted mb-1">Proposta #01</div>
            <h3 className="text-xl font-semibold">Sunrise Beachclub</h3>
            <p className="text-muted mt-2 max-w-2xl">
              Cachê <strong>R$ 8.000</strong> + hospedagem • Sábado, 25 de Maio • Público estimado 4.000 pessoas.
            </p>

            <ul className="mt-4 grid gap-2 text-sm text-muted">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 opacity-70" /> Praia do Futuro, 1000
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 opacity-70" /> Início: 22h
              </li>
            </ul>

            <div className="mt-6 flex gap-3">
              <button className="btn-primary px-6 py-2 glow-primary">Aceitar Proposta</button>
              <button className="btn-secondary px-6 py-2">Negociar</button>
            </div>
          </div>
        </motion.div>

        {/* Próximos eventos (lista/card) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass p-6"
        >
          <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <CalendarDays className="w-5 h-5" /> Próximos Eventos
          </h4>
          <div className="space-y-4">
            {UPCOMING.map((ev) => (
              <div
                key={ev.id}
                className="flex gap-3 p-3 rounded-xl bg-panel/50 border border-border hover:bg-panel/70 transition"
              >
                <img
                  src={ev.cover}
                  alt={ev.title}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="min-w-0">
                  <div className="font-medium truncate">{ev.title}</div>
                  <div className="text-sm text-muted flex items-center gap-1">
                    <CalendarDays className="w-3.5 h-3.5 opacity-70" /> {ev.date}
                  </div>
                  <div className="text-sm text-muted flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 opacity-70" /> {ev.place}
                  </div>
                </div>
                <div className="ml-auto self-center">
<div className="ml-auto self-center">
  <button
    onClick={() => onNavigate(`/event/${ev.id}`)}
    className="inline-flex items-center gap-1 text-sm btn-ghost"
  >
    Ver <ArrowRight className="w-4 h-4" />
  </button>
</div>

                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Estabelecimentos vistos recentemente */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="glass p-6"
      >
        <h4 className="text-lg font-semibold mb-4">Estabelecimentos visitados recentemente</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {RECENTS.map((r) => (
            <div
              key={r.id}
              className="rounded-xl overflow-hidden bg-panel border border-border hover:glow-primary transition"
            >
              <div className="relative">
                <img src={r.img} alt={r.name} className="h-36 w-full object-cover" />
                <div className="absolute left-3 top-3 bg-black/60 border border-white/10 px-2.5 py-1 rounded-full text-xs flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-warning fill-warning" />
                  4.{Math.floor(Math.random() * 5) + 5}
                </div>
              </div>
              <div className="p-4">
                <div className="font-semibold">{r.name}</div>
                <div className="text-sm text-muted">{r.tag}</div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
