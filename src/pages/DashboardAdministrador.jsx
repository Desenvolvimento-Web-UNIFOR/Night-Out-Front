import { motion } from 'framer-motion';
import { Users, UserPlus, Building, Music, TrendingUp, Activity } from 'lucide-react';
import KPICard from '../components/KPICard';

export default function DashboardAdministrador() {
  const adminKPIs = [
    {
      title: 'Total de Usuários',
      value: '1,234',
      change: '+12%',
      trend: 'up',
      icon: Users,
    },
    {
      title: 'Novos Cadastros',
      value: '48',
      change: '+8%',
      trend: 'up',
      icon: UserPlus,
    },
    {
      title: 'Casas de Show',
      value: '87',
      change: '+5%',
      trend: 'up',
      icon: Building,
    },
    {
      title: 'Artistas Ativos',
      value: '156',
      change: '+15%',
      trend: 'up',
      icon: Music,
    },
  ];

  const recentActivities = [
    { user: 'João Silva', action: 'Novo cadastro de Casa de Show', time: '5 min atrás' },
    { user: 'Maria Santos', action: 'Artista aprovado', time: '15 min atrás' },
    { user: 'Pedro Costa', action: 'Cliente cadastrado', time: '30 min atrás' },
    { user: 'Ana Lima', action: 'Casa de Show atualizada', time: '1 hora atrás' },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-text mb-2">Painel do Administrador</h1>
        <p className="text-muted">Gerencie todo o sistema Night Out</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {adminKPIs.map((kpi, index) => (
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
            <Activity className="text-primary" size={24} />
            <h2 className="text-xl font-semibold text-text">Atividades Recentes</h2>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="border-l-2 border-primary/30 pl-4 py-2">
                <p className="text-text font-medium">{activity.user}</p>
                <p className="text-muted text-sm">{activity.action}</p>
                <p className="text-muted text-xs mt-1">{activity.time}</p>
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
            <h2 className="text-xl font-semibold text-text">Estatísticas do Sistema</h2>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted">Taxa de Aprovação</span>
              <span className="text-success font-semibold">92%</span>
            </div>
            <div className="w-full bg-panel rounded-full h-2">
              <div className="bg-success h-2 rounded-full" style={{ width: '92%' }}></div>
            </div>

            <div className="flex justify-between items-center mt-4">
              <span className="text-muted">Usuários Ativos</span>
              <span className="text-primary font-semibold">87%</span>
            </div>
            <div className="w-full bg-panel rounded-full h-2">
              <div className="bg-primary h-2 rounded-full" style={{ width: '87%' }}></div>
            </div>

            <div className="flex justify-between items-center mt-4">
              <span className="text-muted">Eventos Publicados</span>
              <span className="text-info font-semibold">156</span>
            </div>
            <div className="w-full bg-panel rounded-full h-2">
              <div className="bg-info h-2 rounded-full" style={{ width: '75%' }}></div>
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
        <h2 className="text-xl font-semibold text-text mb-4">Acesso Rápido</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="glass p-4 hover:bg-primary/10 transition-colors rounded-xl text-left">
            <Users className="text-primary mb-2" size={32} />
            <h3 className="text-text font-semibold">Gerenciar Usuários</h3>
            <p className="text-muted text-sm">Visualize e edite usuários</p>
          </button>
          <button className="glass p-4 hover:bg-primary/10 transition-colors rounded-xl text-left">
            <Building className="text-primary mb-2" size={32} />
            <h3 className="text-text font-semibold">Casas de Show</h3>
            <p className="text-muted text-sm">Gerencie estabelecimentos</p>
          </button>
          <button className="glass p-4 hover:bg-primary/10 transition-colors rounded-xl text-left">
            <Music className="text-primary mb-2" size={32} />
            <h3 className="text-text font-semibold">Artistas</h3>
            <p className="text-muted text-sm">Aprovar e gerenciar artistas</p>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
