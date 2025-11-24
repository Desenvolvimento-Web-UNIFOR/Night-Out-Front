import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Music2,
  DollarSign,
  CalendarDays,
  Briefcase,
  CheckCircle2,
  Clock,
  MapPin,
  XCircle,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Star,
  MessageSquare
} from 'lucide-react';
import { authFetch, getCurrentUser } from '../services/auth';

export default function DashboardArtista({ onNavigate }) {
  const [loading, setLoading] = useState(true);
  
  // --- ESTADOS ---
  const [artistProfile, setArtistProfile] = useState(null);
  const [pendingProposals, setPendingProposals] = useState([]); 
  const [confirmedEvents, setConfirmedEvents] = useState([]);
  const [recents, setRecents] = useState([]); 
  const [userId, setUserId] = useState(null);

  // --- ESTADOS DE CONTROLE ---
  const [currentProposalIndex, setCurrentProposalIndex] = useState(0);
  const [kpis, setKpis] = useState({
    saldoMes: 0,
    propostasTotal: 0,
    showsMes: 0,
    cacheMin: '0'
  });

  useEffect(() => {
    // 1. Captura o usuário usando sua função auxiliar do auth.js
    const user = getCurrentUser();
    
    if (user && user.id) {
      setUserId(user.id);
      fetchData(user.id);
    } else {
      console.error("Usuário não autenticado ou sem ID.");
      setLoading(false);
      // onNavigate('/login'); // Descomente se quiser forçar logout
    }
  }, []);

  const fetchData = async (id) => {
    setLoading(true);
    try {
      // 2. Requisições alinhadas com os Microservices (resolveBaseUrl)
      const [perfilData, propostasData, historicoData] = await Promise.all([
        // Microservice Users (Default): Busca perfil
        authFetch(`/artista/${id}`).catch(() => null), 
        
        // Microservice Events (Prefixo /propostaCasa): Busca propostas
        authFetch(`/propostaCasa/`).catch(() => []),
        
        // Microservice Reports (Prefixo /relatorios): Busca histórico
        authFetch(`/relatorios/visitas/artista/${id}`).catch(() => []) 
      ]);

      if (perfilData) setArtistProfile(perfilData);
      if (Array.isArray(historicoData)) setRecents(historicoData);

      // --- PROCESSAMENTO ---
      const todasPropostas = Array.isArray(propostasData) ? propostasData : [];
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      const pendentes = todasPropostas.filter(p => 
        ['PENDENTE', 'AGUARDANDO'].includes(String(p.status).toUpperCase())
      );
      const aceitos = todasPropostas.filter(p => 
        ['ACEITO', 'CONFIRMADO'].includes(String(p.status).toUpperCase())
      );

      let saldo = 0;
      let shows = 0;

      aceitos.forEach(evento => {
        const dataEvento = new Date(evento.data_evento);
        if (dataEvento.getMonth() === currentMonth && dataEvento.getFullYear() === currentYear) {
          shows++;
          saldo += Number(evento.valor_ofertado) || 0;
        }
      });

      aceitos.sort((a, b) => new Date(a.data_evento) - new Date(b.data_evento));

      setPendingProposals(pendentes);
      setConfirmedEvents(aceitos);
      
      setKpis({
        saldoMes: saldo,
        propostasTotal: todasPropostas.length,
        showsMes: shows,
        cacheMin: perfilData?.cache_min || '0'
      });

    } catch (error) {
      console.error("Erro ao carregar dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- AÇÕES ---
  const handleNext = () => setCurrentProposalIndex(prev => prev === pendingProposals.length - 1 ? 0 : prev + 1);
  const handlePrev = () => setCurrentProposalIndex(prev => prev === 0 ? pendingProposals.length - 1 : prev - 1);
  
  const handleRecusar = async (idProposta) => {
    const newList = pendingProposals.filter(p => p.id_proposta_casa !== idProposta);
    setPendingProposals(newList);
    setCurrentProposalIndex(0);
    
    // Microservice Events
    await authFetch(`/propostaCasa/${idProposta}/recusar`, { method: 'POST' });
  };

  const handleAceitar = async (idProposta) => {
    console.log("Aceitar proposta:", idProposta);
    // Microservice Events
    await authFetch(`/propostaCasa/${idProposta}/aceitar`, { method: 'POST' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const currentProposal = pendingProposals[currentProposalIndex];

  const KPI_CARDS = [
    { label: "Saldo (Mês)", value: `R$ ${kpis.saldoMes.toLocaleString('pt-BR')}`, icon: DollarSign, colorClass: "text-success bg-success/15" },
    { label: "Propostas", value: kpis.propostasTotal.toString(), icon: MessageSquare, colorClass: "text-primary bg-primary/15" },
    { label: "Shows (Mês)", value: kpis.showsMes.toString(), icon: Music2, colorClass: "text-accent bg-accent/15" },
    { label: "Cachê Mínimo", value: `R$ ${Number(kpis.cacheMin).toLocaleString('pt-BR')}`, icon: Briefcase, colorClass: "text-primary2 bg-primary2/15" },
  ];

  return (
    <div className="space-y-6 pb-8">
      
      {/* HEADER DO PERFIL */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-6 flex items-center gap-6"
      >
        <img
          src={localStorage.getItem(`avatar_${userId}`) || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=150&h=150&fit=crop&auto=format"}
          alt={artistProfile?.nome_artista}
          className="w-20 h-20 rounded-2xl object-cover border-2 border-accent/30 shadow-lg"
        />
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl font-bold text-text tracking-tight truncate">
            {artistProfile?.nome_artista || 'Artista'}
          </h1>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="chip bg-accent/10 text-accent border-accent/20">
              {artistProfile?.genero_musical || 'Gênero não definido'}
            </span>
          </div>
        </div>
      </motion.div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {KPI_CARDS.map((kpi, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass p-5 hover:glow-primary transition-all duration-300"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted">{kpi.label}</p>
                <h3 className="text-2xl font-bold text-text mt-2">{kpi.value}</h3>
              </div>
              <div className={`p-3 rounded-xl ${kpi.colorClass}`}>
                <kpi.icon size={20} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* CARROSSEL */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass lg:col-span-2 relative overflow-hidden min-h-[400px] flex flex-col"
        >
          {pendingProposals.length > 0 && currentProposal ? (
            <>
              <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/95 to-bg/80 z-10" />
                <img 
                  src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200&auto=format&fit=crop" 
                  alt="Background" 
                  className="w-full h-full object-cover opacity-30"
                />
              </div>

              <div className="relative z-20 p-8 flex flex-col h-full">
                <div className="flex justify-between items-start mb-6">
                  <span className="chip-warning border border-warning/20 shadow-lg shadow-warning/10">
                    Proposta Pendente #{currentProposalIndex + 1}
                  </span>
                  <span className="text-sm font-medium text-muted bg-black/30 px-3 py-1 rounded-full backdrop-blur-md">
                    Recebida: {new Date(currentProposal.data_proposta || new Date()).toLocaleDateString()}
                  </span>
                </div>

                <AnimatePresence mode='wait'>
                  <motion.div
                    key={currentProposal.id_proposta_casa || currentProposal.id_proposta_artista}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex-1"
                  >
                    <h2 className="text-3xl font-bold text-text mb-2">
                      {currentProposal.evento?.[0]?.titulo || "Evento sem Título"}
                    </h2>
                    
                    <div className="flex items-center gap-4 mb-6">
                      <div className="flex items-center gap-2 text-primary2">
                        <CalendarDays size={18} />
                        <span className="font-medium">
                          {currentProposal.data_evento ? new Date(currentProposal.data_evento).toLocaleDateString() : 'Data a definir'}
                        </span>
                      </div>
                      <div className="w-1 h-1 bg-muted rounded-full" />
                      <div className="flex items-center gap-2 text-muted">
                        <Clock size={18} />
                        <span>{currentProposal.evento?.[0]?.data_inicio ? new Date(currentProposal.evento[0].data_inicio).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '22:00'}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="glass-panel p-4 rounded-xl border-l-4 border-success">
                        <p className="text-xs text-muted uppercase tracking-wider mb-1">Cachê Ofertado</p>
                        <p className="text-2xl font-bold text-success">
                          R$ {Number(currentProposal.valor_ofertado).toLocaleString('pt-BR')}
                        </p>
                      </div>
                      <div className="glass-panel p-4 rounded-xl border-l-4 border-primary">
                        <p className="text-xs text-muted uppercase tracking-wider mb-1">Local</p>
                        <p className="text-lg font-medium text-text truncate">
                          {currentProposal.evento?.[0]?.local || "Local não informado"}
                        </p>
                      </div>
                    </div>

                    <div className="glass-panel p-4 rounded-xl mb-6">
                      <p className="text-sm text-muted leading-relaxed">
                        <span className="font-semibold text-primary2">Termos:</span> {currentProposal.termos || "Termos padrão da casa aplicáveis."}
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>

                <div className="flex gap-4 mt-auto">
                  <button 
                    onClick={() => handleAceitar(currentProposal.id_proposta_casa)}
                    className="btn-primary flex-1 flex items-center justify-center gap-2 shadow-lg shadow-primary/25"
                  >
                    <CheckCircle2 size={20} /> Aceitar Proposta
                  </button>
                  <button 
                    onClick={() => handleRecusar(currentProposal.id_proposta_casa)}
                    className="btn-secondary flex-1 flex items-center justify-center gap-2 text-danger border-danger/20 hover:bg-danger/5 hover:border-danger/40"
                  >
                    <XCircle size={20} /> Recusar
                  </button>
                </div>
              </div>

              {pendingProposals.length > 1 && (
                <>
                  <button onClick={handlePrev} className="absolute top-1/2 left-4 -translate-y-1/2 z-30 p-3 rounded-full glass hover:bg-panel/80 transition-all focus-ring group">
                    <ChevronLeft size={24} className="text-muted group-hover:text-text" />
                  </button>
                  <button onClick={handleNext} className="absolute top-1/2 right-4 -translate-y-1/2 z-30 p-3 rounded-full glass hover:bg-panel/80 transition-all focus-ring group">
                    <ChevronRight size={24} className="text-muted group-hover:text-text" />
                  </button>
                </>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted p-10">
              <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mb-4 border border-success/20">
                <CheckCircle2 size={32} className="text-success" />
              </div>
              <h3 className="text-xl font-bold text-text mb-2">Tudo em dia!</h3>
              <p>Você não tem nenhuma proposta pendente no momento.</p>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass p-6 flex flex-col"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-text flex items-center gap-2">
              <CalendarDays className="text-primary" size={20} /> Próximos Eventos
            </h2>
            <button 
              onClick={() => onNavigate('/eventos')} 
              className="text-xs font-medium text-primary hover:text-primary2 transition-colors"
            >
              Ver todos
            </button>
          </div>

          <div className="space-y-4 overflow-y-auto custom-scrollbar flex-1">
            {confirmedEvents.length > 0 ? (
              confirmedEvents.slice(0, 2).map((ev, i) => (
                <div
                  key={i}
                  className="group p-4 rounded-xl bg-panel/40 border border-border hover:bg-panel/80 hover:border-primary/30 transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="bg-bgAlt border border-border rounded-lg px-3 py-1 text-center min-w-[3.5rem]">
                      <div className="text-xs text-muted uppercase font-bold">
                        {new Date(ev.data_evento).toLocaleDateString('pt-BR', { month: 'short' })}
                      </div>
                      <div className="text-lg font-bold text-text">
                        {new Date(ev.data_evento).getDate()}
                      </div>
                    </div>
                    <button 
                      onClick={() => onNavigate(`/event/${ev.evento?.[0]?.id_evento}`)}
                      className="p-2 rounded-full hover:bg-white/5 text-muted hover:text-primary transition-colors"
                    >
                      <ArrowRight size={18} />
                    </button>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-text truncate group-hover:text-primary transition-colors">
                      {ev.evento?.[0]?.titulo || "Evento Confirmado"}
                    </h4>
                    <div className="flex items-center gap-1.5 mt-2 text-sm text-muted">
                      <MapPin size={14} />
                      <span className="truncate">{ev.evento?.[0]?.local || "Local a definir"}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-muted border border-dashed border-border rounded-xl bg-panel/20">
                <CalendarDays size={24} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">Nenhum evento agendado.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass p-6"
      >
        <h2 className="text-lg font-bold text-text mb-6 flex items-center gap-2">
          <Star className="text-warning" size={20} /> Estabelecimentos Recentes
        </h2>
        
        {recents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recents.map((r, i) => (
              <div 
                key={i} 
                className="group relative overflow-hidden rounded-xl border border-border bg-panel/40 hover:border-primary/50 transition-all duration-300"
              >
                <div className="aspect-video w-full overflow-hidden bg-bgAlt">
                  <img 
                    src={r.img || r.foto || "https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=800"} 
                    alt={r.name} 
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg to-transparent opacity-80" />
                  
                  <div className="absolute top-3 left-3 badge-dark flex items-center gap-1">
                    <Star size={12} className="text-warning fill-warning" />
                    <span>{r.rating || '4.8'}</span>
                  </div>
                </div>
                
                <div className="absolute bottom-0 left-0 w-full p-4">
                  <h4 className="text-lg font-bold text-text group-hover:text-primary transition-colors">
                    {r.name || r.nome_fantasia || "Nome do Local"}
                  </h4>
                  <p className="text-sm text-muted mt-0.5">
                    {r.tag || r.categoria || "Casa de Show"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted bg-panel/20 rounded-xl border border-dashed border-border">
            <p>Nenhum histórico de visitas encontrado.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}