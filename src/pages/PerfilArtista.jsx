import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Users, CalendarDays, Music2, Star, MessageSquare } from 'lucide-react';

const artist = {
  name: 'Nattan Lima',
  email: 'nattan@email.com',
  phone: '(85) 98888-0000',
  location: 'Fortaleza, CE',
  followers: '128K',
  following: '412',
  avatar: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=200&h=200&fit=crop&crop=faces&auto=format',
  bio: 'Cantor e compositor. Forró eletrônico. Agenda aberta para festivais e beach clubs.',
};

const proposals = [
  { id: 'p1', title: 'Sunrise Beachclub', date: '25/05', status: 'Nova' },
  { id: 'p2', title: 'Living', date: '02/06', status: 'Negociação' },
];

export default function PerfilArtista() {
  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="glass p-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
          <img src={artist.avatar} alt={artist.name} className="w-24 h-24 rounded-2xl object-cover ring-2 ring-primary/30" />
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{artist.name}</h1>
            <p className="text-muted">{artist.bio}</p>

            <div className="flex flex-wrap gap-6 mt-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{artist.followers}</p>
                <p className="text-muted text-sm">Seguidores</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary2">{artist.following}</p>
                <p className="text-muted text-sm">Seguindo</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Blocos de info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="glass p-6">
          <h3 className="text-lg font-semibold mb-4">Informações do Perfil</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3"><Phone size={18} className="text-muted" /><span>{artist.phone}</span></div>
            <div className="flex items-center gap-3"><Mail size={18} className="text-muted" /><span>{artist.email}</span></div>
            <div className="flex items-center gap-3"><MapPin size={18} className="text-muted" /><span>{artist.location}</span></div>
            <div className="flex items-center gap-3"><Users size={18} className="text-muted" /><span>Equipe: 8 membros</span></div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05 }} className="glass p-6">
          <h3 className="text-lg font-semibold mb-4">Atividade</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-panel/60 border border-border rounded-xl p-4">
              <div className="text-sm text-muted">Shows no mês</div>
              <div className="text-2xl font-bold flex items-center gap-2 mt-1"><Music2 size={18} className="text-accent" /> 12</div>
            </div>
            <div className="bg-panel/60 border border-border rounded-xl p-4">
              <div className="text-sm text-muted">Avaliação média</div>
              <div className="text-2xl font-bold flex items-center gap-2 mt-1"><Star size={18} className="text-warning fill-warning" /> 4,8</div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="glass p-6">
          <h3 className="text-lg font-semibold mb-4">Propostas recentes</h3>
          <div className="space-y-3">
            {proposals.map((p) => (
              <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl bg-panel/50 border border-border">
                <MessageSquare size={18} className="text-primary" />
                <div className="flex-1">
                  <div className="font-medium">{p.title}</div>
                  <div className="text-sm text-muted flex items-center gap-1"><CalendarDays size={14} /> {p.date}</div>
                </div>
                <span className="chip">{p.status}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
