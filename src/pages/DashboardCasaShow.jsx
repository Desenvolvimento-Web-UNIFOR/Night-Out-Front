import { motion } from 'framer-motion';
import { Calendar, Users, TrendingUp, DollarSign, Music, Star } from 'lucide-react';
import KPICard from '../components/KPICard';

export default function DashboardCasaShow() {
  const casaKPIs = [
    {
      title: 'Eventos Agendados',
      value: '12',
      change: '+3',
      trend: 'up',
      icon: Calendar,
    },
    {
      title: 'Público Esperado',
      value: '2,450',
      change: '+18%',
      trend: 'up',
      icon: Users,
    },
    {
      title: 'Receita Estimada',
      value: 'R$ 45.2k',
      change: '+22%',
      trend: 'up',
      icon: DollarSign,
    },
    {
      title: 'Avaliação Média',
      value: '4.8',
      change: '+0.2',
      trend: 'up',
      icon: Star,
    },
  ];

  const proximosEventos = [
    { artista: 'DJ Nebula', data: '25/11/2025', publico: '350', status: 'Confirmado' },
    { artista: 'Banda Horizonte', data: '28/11/2025', publico: '280', status: 'Pendente' },
    { artista: 'MC Aurora', data: '02/12/2025', publico: '420', status: 'Confirmado' },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-text mb-2">Painel da Casa de Show</h1>
        <p className="text-muted">Gerencie seus eventos e apresentações</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {casaKPIs.map((kpi, index) => (
          <KPICard key={index} {...kpi} index={index} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="glass p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="text-primary" size={24} />
            <h2 className="text-xl font-semibold text-text">Próximos Eventos</h2>
          </div>
          <div className="space-y-4">
            {proximosEventos.map((evento, index) => (
              <div key={index} className="glass-light p-4 rounded-xl">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-text font-semibold">{evento.artista}</p>
                    <p className="text-muted text-sm">{evento.data}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-lg text-xs font-medium ${
                    evento.status === 'Confirmado' 
                      ? 'bg-success/20 text-success' 
                      : 'bg-warning/20 text-warning'
                  }`}>
                    {evento.status}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted text-sm">
                  <Users size={16} />
                  <span>{evento.publico} pessoas esperadas</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="text-success" size={24} />
            <h2 className="text-xl font-semibold text-text">Performance do Mês</h2>
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-muted">Taxa de Ocupação</span>
                <span className="text-success font-semibold">85%</span>
              </div>
              <div className="w-full bg-panel rounded-full h-3">
                <div className="bg-success h-3 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-muted">Satisfação dos Clientes</span>
                <span className="text-primary font-semibold">4.8/5.0</span>
              </div>
              <div className="w-full bg-panel rounded-full h-3">
                <div className="bg-primary h-3 rounded-full" style={{ width: '96%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-muted">Eventos Realizados</span>
                <span className="text-info font-semibold">24/28</span>
              </div>
              <div className="w-full bg-panel rounded-full h-3">
                <div className="bg-info h-3 rounded-full" style={{ width: '86%' }}></div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="glass p-6"
      >
        <h2 className="text-xl font-semibold text-text mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="glass p-4 hover:bg-primary/10 transition-colors rounded-xl text-left">
            <Music className="text-primary mb-2" size={32} />
            <h3 className="text-text font-semibold">Contratar Artista</h3>
            <p className="text-muted text-sm">Buscar e contratar artistas</p>
          </button>
          <button className="glass p-4 hover:bg-primary/10 transition-colors rounded-xl text-left">
            <Calendar className="text-primary mb-2" size={32} />
            <h3 className="text-text font-semibold">Novo Evento</h3>
            <p className="text-muted text-sm">Agendar um novo evento</p>
          </button>
          <button className="glass p-4 hover:bg-primary/10 transition-colors rounded-xl text-left">
            <TrendingUp className="text-primary mb-2" size={32} />
            <h3 className="text-text font-semibold">Relatórios</h3>
            <p className="text-muted text-sm">Ver análises e métricas</p>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
