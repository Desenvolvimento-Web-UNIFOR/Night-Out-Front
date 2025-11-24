import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Music2,
  DollarSign,
  CalendarDays,
  MapPin,
  Clock,
  Star,
  Building2,
  Award
} from 'lucide-react';
import { authFetch, getCurrentUser } from '../services/auth';

export default function DashboardArtista() {
  const [loading, setLoading] = useState(true);
  const [artistProfile, setArtistProfile] = useState(null);
  const [saldoMes, setSaldoMes] = useState(0);
  const [showsMes, setShowsMes] = useState(0);
  const [totalAcumulado, setTotalAcumulado] = useState(0);
  const [proximosEventos, setProximosEventos] = useState([]);
  const [estabelecimentos, setEstabelecimentos] = useState([]);
  const [dadosGraficoSaldo, setDadosGraficoSaldo] = useState([]);
  const [dadosGraficoShows, setDadosGraficoShows] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const currentUser = getCurrentUser();
      const idArtista = currentUser?.id;

      if (!idArtista) {
        throw new Error('Usuário não autenticado');
      }

      // Buscar dados em paralelo
      const [perfilRes, propostasRes, eventosRes] = await Promise.all([
        authFetch(`/artista/${idArtista}`).catch(() => null),
        authFetch('/propostaArtista?page=1&pageSize=1000').catch(() => []),
        authFetch('/evento?page=1&pageSize=1000').catch(() => []),
      ]);

      // Processar perfil do artista
      const perfil = perfilRes?.artista || perfilRes;
      setArtistProfile(perfil);

      // Processar propostas aceitas pelo artista
      const propostas = Array.isArray(propostasRes) ? propostasRes : propostasRes?.items || [];
      const propostasAceitas = propostas.filter(p => p.aceito === idArtista);

      // Calcular saldo do mês e shows do mês
      const now = new Date();
      const mesAtual = now.getMonth();
      const anoAtual = now.getFullYear();
      
      let saldoTotal = 0;
      let showsTotal = 0;
      let acumuladoTotal = 0;
      const saldoPorMes = {};
      const showsPorMes = {};

      // Inicializar últimos 6 meses
      for (let i = 5; i >= 0; i--) {
        const data = new Date(anoAtual, mesAtual - i, 1);
        const chave = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}`;
        saldoPorMes[chave] = 0;
        showsPorMes[chave] = 0;
      }

      propostasAceitas.forEach(proposta => {
        const valorOfertado = Number(proposta.valor_ofertado) || 0;
        acumuladoTotal += valorOfertado;
        
        if (proposta.data_evento) {
          const dataEvento = new Date(proposta.data_evento);
          const chaveMes = `${dataEvento.getFullYear()}-${String(dataEvento.getMonth() + 1).padStart(2, '0')}`;
          
          // Adicionar ao gráfico
          if (Object.prototype.hasOwnProperty.call(saldoPorMes, chaveMes)) {
            saldoPorMes[chaveMes] += valorOfertado;
            showsPorMes[chaveMes] += 1;
          }

          // Contar totais do mês atual
          if (dataEvento.getMonth() === mesAtual && dataEvento.getFullYear() === anoAtual) {
            saldoTotal += valorOfertado;
            showsTotal++;
          }
        }
      });

      setSaldoMes(saldoTotal);
      setShowsMes(showsTotal);
      setTotalAcumulado(acumuladoTotal);

      // Preparar dados para gráficos
      setDadosGraficoSaldo(Object.values(saldoPorMes));
      setDadosGraficoShows(Object.values(showsPorMes));

      // Criar mapa de eventos
      const rawEvents = Array.isArray(eventosRes) ? eventosRes : eventosRes?.eventos || eventosRes?.items || [];
      const eventosMap = rawEvents.reduce((acc, ev) => {
        acc[ev.id_evento || ev.id] = ev;
        return acc;
      }, {});

      // Mapear próximos eventos (propostas aceitas)
      const eventos = propostasAceitas
        .map(p => {
          const evento = eventosMap[p.id_evento];
          if (!evento) return null;

          return {
            id: evento.id_evento,
            title: evento.titulo,
            local: evento.local,
            data_inicio: evento.data_inicio || p.data_evento,
            cache: p.valor_ofertado,
            id_casa: p.id_casa, // ID da casa de show vem da proposta
          };
        })
        .filter(e => e !== null)
        .sort((a, b) => new Date(a.data_inicio) - new Date(b.data_inicio))
        .slice(0, 3);

      setProximosEventos(eventos);

      // Buscar informações das casas de show a partir do id_casa das propostas
      const idsCasas = [...new Set(propostasAceitas.map(p => p.id_casa).filter(Boolean))];
      
      if (idsCasas.length > 0) {
        const casasPromises = idsCasas.slice(0, 3).map(idCasa =>
          authFetch(`/casaDeShow/${idCasa}`).catch(() => null)
        );

        const casasResults = await Promise.all(casasPromises);
        const casasRecentes = casasResults
          .filter(casa => casa !== null)
          .map(casa => ({
            id: casa.id_usuario || casa.id,
            nome: casa.nome || casa.name || casa.nome_fantasia || 'Casa de Show',
            email: casa.email,
            telefone: casa.telefone,
          }));

        setEstabelecimentos(casasRecentes);
      }

    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  const currentUser = getCurrentUser();
  const displayAvatar = localStorage.getItem(`avatar_${currentUser?.id}`) || 
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=150&h=150&fit=crop&auto=format';
  const displayName = artistProfile?.nome_artista || artistProfile?.nomeArtista || currentUser?.name || 'Artista';
  const displayGenero = artistProfile?.genero_musical || artistProfile?.generoMusical || 'Gênero Musical';

  return (
    <div className="space-y-6">
      {/* Header com Foto e Info do Artista */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass p-6 flex items-center gap-6"
      >
        <img
          src={displayAvatar}
          alt={displayName}
          className="w-24 h-24 rounded-2xl object-cover border-2 border-primary/30 shadow-lg"
        />
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-text mb-2">{displayName}</h1>
          <div className="flex items-center gap-2">
            <Music2 size={18} className="text-primary" />
            <span className="text-muted">{displayGenero}</span>
          </div>
        </div>
      </motion.div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="glass p-6 hover:glow-primary transition-all duration-300"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-muted mb-1">Saldo Mês</p>
              <h3 className="text-2xl font-bold text-emerald-400">
                R$ {saldoMes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </h3>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/15">
              <DollarSign size={20} className="text-emerald-400" />
            </div>
          </div>
          <p className="text-xs text-muted">Soma das propostas aceitas</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass p-6 hover:glow-primary transition-all duration-300"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-muted mb-1">Shows</p>
              <h3 className="text-2xl font-bold text-primary">
                {showsMes}
              </h3>
            </div>
            <div className="p-3 rounded-xl bg-primary/15">
              <CalendarDays size={20} className="text-primary" />
            </div>
          </div>
          <p className="text-xs text-muted">Propostas aceitas este mês</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="glass p-6 hover:glow-primary transition-all duration-300"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-muted mb-1">Próximos Eventos</p>
              <h3 className="text-2xl font-bold text-accent">
                {proximosEventos.length}
              </h3>
            </div>
            <div className="p-3 rounded-xl bg-accent/15">
              <Music2 size={20} className="text-accent" />
            </div>
          </div>
          <p className="text-xs text-muted">Eventos confirmados</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="glass p-6 hover:glow-primary transition-all duration-300"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-muted mb-1">Total Acumulado</p>
              <h3 className="text-2xl font-bold text-warning">
                R$ {totalAcumulado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </h3>
            </div>
            <div className="p-3 rounded-xl bg-warning/15">
              <Award size={20} className="text-warning" />
            </div>
          </div>
          <p className="text-xs text-muted">Soma total das propostas aceitas</p>
        </motion.div>
      </div>

      {/* Gráficos de Saldo e Shows */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Saldo por Mês */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="glass p-6"
        >
          <h2 className="text-lg font-bold text-text mb-6 flex items-center gap-2">
            <DollarSign className="text-emerald-400" size={20} />
            Saldo dos Últimos 6 Meses
          </h2>
          
          <div className="space-y-3">
            {dadosGraficoSaldo.map((valor, index) => {
              const maxValor = Math.max(...dadosGraficoSaldo, 1);
              const porcentagem = (valor / maxValor) * 100;
              const now = new Date();
              const mesData = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
              const mesLabel = mesData.toLocaleDateString('pt-BR', { month: 'short' }).toUpperCase();
              
              return (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted font-medium">{mesLabel}</span>
                    <span className="text-emerald-400 font-semibold">
                      R$ {valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="w-full h-3 bg-panel rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${porcentagem}%` }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                      className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Gráfico de Shows por Mês */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="glass p-6"
        >
          <h2 className="text-lg font-bold text-text mb-6 flex items-center gap-2">
            <CalendarDays className="text-primary" size={20} />
            Shows dos Últimos 6 Meses
          </h2>
          
          <div className="flex items-end justify-between h-48 gap-2">
            {dadosGraficoShows.map((quantidade, index) => {
              const maxQuantidade = Math.max(...dadosGraficoShows, 1);
              const altura = (quantidade / maxQuantidade) * 100;
              const now = new Date();
              const mesData = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
              const mesLabel = mesData.toLocaleDateString('pt-BR', { month: 'short' }).charAt(0).toUpperCase();
              
              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex flex-col items-center justify-end h-40">
                    <span className="text-xs font-semibold text-primary mb-1">
                      {quantidade > 0 ? quantidade : ''}
                    </span>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${altura}%` }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                      className="w-full bg-gradient-to-t from-primary to-primary/60 rounded-t-lg min-h-[4px]"
                    />
                  </div>
                  <span className="text-xs text-muted font-bold">{mesLabel}</span>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Próximos Eventos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="glass p-6"
        >
          <h2 className="text-xl font-bold text-text mb-6 flex items-center gap-2">
            <CalendarDays className="text-primary" size={22} />
            Próximos Eventos
          </h2>

          {proximosEventos.length > 0 ? (
            <div className="space-y-4">
              {proximosEventos.map((evento) => {
                const dataEvento = new Date(evento.data_inicio);
                const dia = dataEvento.getDate();
                const mes = dataEvento.toLocaleDateString('pt-BR', { month: 'short' });
                const hora = dataEvento.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

                return (
                  <div
                    key={evento.id}
                    className="group relative overflow-hidden rounded-xl border border-border bg-panel/40 hover:border-primary/50 transition-all duration-300"
                  >
                    <div className="flex gap-4 p-4">
                      {/* Data */}
                      <div className="flex-shrink-0 w-16 h-16 bg-primary/10 border border-primary/30 rounded-xl flex flex-col items-center justify-center">
                        <span className="text-xs text-primary font-bold uppercase">{mes}</span>
                        <span className="text-xl font-bold text-text">{dia}</span>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-text mb-1 truncate group-hover:text-primary transition-colors">
                          {evento.title}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-muted mb-2">
                          <MapPin size={14} />
                          <span className="truncate">{evento.local || 'Local a definir'}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1 text-xs text-muted">
                            <Clock size={12} />
                            <span>{hora}</span>
                          </div>
                          <div className="text-xs font-semibold text-emerald-400">
                            R$ {Number(evento.cache || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-muted border border-dashed border-border rounded-xl bg-panel/20">
              <CalendarDays size={32} className="mx-auto mb-3 opacity-40" />
              <p className="text-sm">Nenhum evento confirmado</p>
            </div>
          )}
        </motion.div>

        {/* Estabelecimentos Recentes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="glass p-6"
        >
          <h2 className="text-xl font-bold text-text mb-6 flex items-center gap-2">
            <Building2 className="text-accent" size={22} />
            Estabelecimentos Recentes
          </h2>

          {estabelecimentos.length > 0 ? (
            <div className="space-y-4">
              {estabelecimentos.map((casa) => (
                <div
                  key={casa.id}
                  className="group relative overflow-hidden rounded-xl border border-border bg-panel/40 hover:border-accent/50 transition-all duration-300 p-4"
                >
                  <div className="flex items-start gap-4">
                    {/* Ícone/Avatar */}
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-accent/20 to-primary/20 border border-accent/30 rounded-xl flex items-center justify-center">
                      <Building2 size={20} className="text-accent" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-text mb-1 truncate group-hover:text-accent transition-colors">
                        {casa.nome}
                      </h3>
                      {casa.email && (
                        <p className="text-xs text-muted truncate">{casa.email}</p>
                      )}
                      {casa.telefone && (
                        <p className="text-xs text-muted mt-1">{casa.telefone}</p>
                      )}
                    </div>

                    {/* Badge */}
                    <div className="flex-shrink-0">
                      <div className="flex items-center gap-1 px-2 py-1 bg-warning/10 border border-warning/30 rounded-full">
                        <Star size={12} className="text-warning fill-warning" />
                        <span className="text-xs text-warning font-semibold">4.8</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted border border-dashed border-border rounded-xl bg-panel/20">
              <Building2 size={32} className="mx-auto mb-3 opacity-40" />
              <p className="text-sm">Nenhum estabelecimento recente</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
