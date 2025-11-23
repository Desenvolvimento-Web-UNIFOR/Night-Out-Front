import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, UserPlus, Building, Music, User, BarChart3, TrendingUp, Calendar } from 'lucide-react';
import KPICard from '../components/KPICard';
import { authFetch } from '../services/auth';

export default function DashboardAdministrador() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsuarios: 0,
    administradores: 0,
    casasDeShow: 0,
    artistas: 0,
    clientes: 0,
  });
  const [monthlyData, setMonthlyData] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    fetchAllStats();
  }, []);

  const processMonthlyData = (admins, casas, artistas, clientes) => {
    const allUsersData = [
      ...admins.map(u => ({ ...u, tipo: 'ADMINISTRADOR', data: u.createdAt || u.created_at })),
      ...casas.map(u => ({ ...u, tipo: 'CASASHOW', data: u.createdAt || u.created_at })),
      ...artistas.map(u => ({ ...u, tipo: 'ARTISTA', data: u.createdAt || u.created_at })),
      ...clientes.map(u => ({ ...u, tipo: 'CLIENTE', data: u.createdAt || u.created_at })),
    ];

    setAllUsers(allUsersData);

    const months = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = date.toLocaleDateString('pt-BR', { month: 'short' });
      
      const usersInMonth = allUsersData.filter(user => {
        if (!user.data) return false;
        const userDate = new Date(user.data);
        return userDate.getFullYear() === date.getFullYear() && 
               userDate.getMonth() === date.getMonth();
      });

      const clientesCount = usersInMonth.filter(u => u.tipo === 'CLIENTE').length;
      const casasCount = usersInMonth.filter(u => u.tipo === 'CASASHOW').length;
      const artistasCount = usersInMonth.filter(u => u.tipo === 'ARTISTA').length;
      const adminsCount = usersInMonth.filter(u => u.tipo === 'ADMINISTRADOR').length;

      months.push({
        month: monthName,
        monthKey,
        total: usersInMonth.length,
        clientes: clientesCount,
        casasDeShow: casasCount,
        artistas: artistasCount,
        administradores: adminsCount,
      });
    }

    setMonthlyData(months);
  };

  const fetchAllStats = async () => {
    setLoading(true);
    try {
      const [admins, casas, artistas, clientes] = await Promise.all([
        authFetch('/adm').catch(() => []),
        authFetch('/casaDeShow').catch(() => []),
        authFetch('/artista').catch(() => []),
        authFetch('/cliente').catch(() => []),
      ]);

      const adminsCount = Array.isArray(admins) ? admins.length : 0;
      const casasCount = Array.isArray(casas) ? casas.length : 0;
      const artistasCount = Array.isArray(artistas) ? artistas.length : 0;
      const clientesCount = Array.isArray(clientes) ? clientes.length : 0;

      setStats({
        totalUsuarios: adminsCount + casasCount + artistasCount + clientesCount,
        administradores: adminsCount,
        casasDeShow: casasCount,
        artistas: artistasCount,
        clientes: clientesCount,
      });

      processMonthlyData(
        Array.isArray(admins) ? admins : [],
        Array.isArray(casas) ? casas : [],
        Array.isArray(artistas) ? artistas : [],
        Array.isArray(clientes) ? clientes : []
      );
    } catch (err) {
      console.error('Erro ao buscar estatísticas:', err);
    } finally {
      setLoading(false);
    }
  };

  const adminKPIs = [
    {
      title: 'Total de Usuários',
      value: loading ? '...' : stats.totalUsuarios.toString(),
      change: '',
      trend: 'up',
      icon: Users,
    },
    {
      title: 'Administradores',
      value: loading ? '...' : stats.administradores.toString(),
      change: '',
      trend: 'up',
      icon: UserPlus,
    },
    {
      title: 'Casas de Show',
      value: loading ? '...' : stats.casasDeShow.toString(),
      change: '',
      trend: 'up',
      icon: Building,
    },
    {
      title: 'Artistas',
      value: loading ? '...' : stats.artistas.toString(),
      change: '',
      trend: 'up',
      icon: Music,
    },
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="glass p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <BarChart3 className="text-primary" size={24} />
          <h2 className="text-xl font-semibold text-text">Distribuição de Usuários</h2>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <User size={18} className="text-info" />
                <span className="text-text">Clientes</span>
              </div>
              <span className="text-text font-semibold">
                {loading ? '...' : stats.clientes} ({loading ? '...' : stats.totalUsuarios > 0 ? Math.round((stats.clientes / stats.totalUsuarios) * 100) : 0}%)
              </span>
            </div>
            <div className="w-full bg-panel rounded-full h-3">
              <div 
                className="bg-info h-3 rounded-full transition-all duration-500" 
                style={{ width: loading ? '0%' : `${stats.totalUsuarios > 0 ? (stats.clientes / stats.totalUsuarios) * 100 : 0}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <Building size={18} className="text-primary" />
                <span className="text-text">Casas de Show</span>
              </div>
              <span className="text-text font-semibold">
                {loading ? '...' : stats.casasDeShow} ({loading ? '...' : stats.totalUsuarios > 0 ? Math.round((stats.casasDeShow / stats.totalUsuarios) * 100) : 0}%)
              </span>
            </div>
            <div className="w-full bg-panel rounded-full h-3">
              <div 
                className="bg-primary h-3 rounded-full transition-all duration-500" 
                style={{ width: loading ? '0%' : `${stats.totalUsuarios > 0 ? (stats.casasDeShow / stats.totalUsuarios) * 100 : 0}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <Music size={18} className="text-accent" />
                <span className="text-text">Artistas</span>
              </div>
              <span className="text-text font-semibold">
                {loading ? '...' : stats.artistas} ({loading ? '...' : stats.totalUsuarios > 0 ? Math.round((stats.artistas / stats.totalUsuarios) * 100) : 0}%)
              </span>
            </div>
            <div className="w-full bg-panel rounded-full h-3">
              <div 
                className="bg-accent h-3 rounded-full transition-all duration-500" 
                style={{ width: loading ? '0%' : `${stats.totalUsuarios > 0 ? (stats.artistas / stats.totalUsuarios) * 100 : 0}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <UserPlus size={18} className="text-success" />
                <span className="text-text">Administradores</span>
              </div>
              <span className="text-text font-semibold">
                {loading ? '...' : stats.administradores} ({loading ? '...' : stats.totalUsuarios > 0 ? Math.round((stats.administradores / stats.totalUsuarios) * 100) : 0}%)
              </span>
            </div>
            <div className="w-full bg-panel rounded-full h-3">
              <div 
                className="bg-success h-3 rounded-full transition-all duration-500" 
                style={{ width: loading ? '0%' : `${stats.totalUsuarios > 0 ? (stats.administradores / stats.totalUsuarios) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="glass p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="text-success" size={24} />
          <h2 className="text-xl font-semibold text-text">Evolução de Cadastros (Últimos 6 Meses)</h2>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted">Carregando dados...</p>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="relative h-80">
              <div className="absolute inset-0 flex items-end justify-between gap-4 pb-8">
                {monthlyData.map((month, index) => {
                  const maxValue = Math.max(...monthlyData.map(m => m.total), 1);
                  const height = (month.total / maxValue) * 100;
                  
                  return (
                    <div key={index} className="flex-1 flex flex-col items-center gap-2">
                      <div className="relative w-full group">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${height}%` }}
                          transition={{ duration: 0.8, delay: index * 0.1 }}
                          className="w-full bg-gradient-to-t from-primary to-primary2 rounded-t-lg hover:from-primary2 hover:to-primary transition-all cursor-pointer"
                          style={{ minHeight: month.total > 0 ? '20px' : '0px' }}
                        >
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-panel border border-border rounded-lg px-2 py-1 text-xs whitespace-nowrap z-10">
                            <p className="font-semibold text-text">{month.total} usuários</p>
                          </div>
                        </motion.div>
                        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-muted font-medium whitespace-nowrap">
                          {month.month}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="absolute left-0 bottom-0 w-full h-px bg-border"></div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-info"></div>
                <span className="text-sm text-muted">Clientes</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <span className="text-sm text-muted">Casas de Show</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-accent"></div>
                <span className="text-sm text-muted">Artistas</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-success"></div>
                <span className="text-sm text-muted">Administradores</span>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="glass p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="text-primary" size={24} />
            <h2 className="text-xl font-semibold text-text">Cadastros por Tipo (Últimos 6 Meses)</h2>
          </div>

          {loading ? (
            <p className="text-center text-muted py-8">Carregando...</p>
          ) : (
            <div className="space-y-6">
              {monthlyData.map((month, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-text capitalize">{month.month}</span>
                    <span className="text-sm text-muted">{month.total} total</span>
                  </div>
                  <div className="flex gap-1 h-6 rounded-lg overflow-hidden bg-panel">
                    {month.clientes > 0 && (
                      <div 
                        className="bg-info hover:opacity-80 transition-opacity cursor-pointer relative group"
                        style={{ width: `${(month.clientes / Math.max(month.total, 1)) * 100}%` }}
                        title={`${month.clientes} clientes`}
                      >
                        <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white opacity-0 group-hover:opacity-100">
                          {month.clientes}
                        </span>
                      </div>
                    )}
                    {month.casasDeShow > 0 && (
                      <div 
                        className="bg-primary hover:opacity-80 transition-opacity cursor-pointer relative group"
                        style={{ width: `${(month.casasDeShow / Math.max(month.total, 1)) * 100}%` }}
                        title={`${month.casasDeShow} casas`}
                      >
                        <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white opacity-0 group-hover:opacity-100">
                          {month.casasDeShow}
                        </span>
                      </div>
                    )}
                    {month.artistas > 0 && (
                      <div 
                        className="bg-accent hover:opacity-80 transition-opacity cursor-pointer relative group"
                        style={{ width: `${(month.artistas / Math.max(month.total, 1)) * 100}%` }}
                        title={`${month.artistas} artistas`}
                      >
                        <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white opacity-0 group-hover:opacity-100">
                          {month.artistas}
                        </span>
                      </div>
                    )}
                    {month.administradores > 0 && (
                      <div 
                        className="bg-success hover:opacity-80 transition-opacity cursor-pointer relative group"
                        style={{ width: `${(month.administradores / Math.max(month.total, 1)) * 100}%` }}
                        title={`${month.administradores} admins`}
                      >
                        <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white opacity-0 group-hover:opacity-100">
                          {month.administradores}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="glass p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="text-accent" size={24} />
            <h2 className="text-xl font-semibold text-text">Crescimento Mensal</h2>
          </div>

          {loading ? (
            <p className="text-center text-muted py-8">Carregando...</p>
          ) : (
            <div className="space-y-6">
              {monthlyData.map((month, index) => {
                const prevMonth = index > 0 ? monthlyData[index - 1] : null;
                const growth = prevMonth && prevMonth.total > 0 
                  ? ((month.total - prevMonth.total) / prevMonth.total) * 100 
                  : 0;
                const isPositive = growth >= 0;

                return (
                  <div key={index} className="glass-light p-4 rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-text capitalize">{month.month}</span>
                      {prevMonth && (
                        <span className={`text-sm font-semibold ${isPositive ? 'text-success' : 'text-danger'}`}>
                          {isPositive ? '+' : ''}{growth.toFixed(1)}%
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-center">
                      <div>
                        <p className="text-xs text-muted">Clientes</p>
                        <p className="text-sm font-semibold text-info">{month.clientes}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted">Casas</p>
                        <p className="text-sm font-semibold text-primary">{month.casasDeShow}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted">Artistas</p>
                        <p className="text-sm font-semibold text-accent">{month.artistas}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted">Admins</p>
                        <p className="text-sm font-semibold text-success">{month.administradores}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-info/20 rounded-xl">
              <User className="text-info" size={24} />
            </div>
            <div>
              <p className="text-sm text-muted">Clientes</p>
              <p className="text-2xl font-bold text-text">{loading ? '...' : stats.clientes}</p>
            </div>
          </div>
          <p className="text-sm text-muted">
            {loading ? '...' : stats.totalUsuarios > 0 ? Math.round((stats.clientes / stats.totalUsuarios) * 100) : 0}% do total de usuários
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="glass p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-primary/20 rounded-xl">
              <Building className="text-primary" size={24} />
            </div>
            <div>
              <p className="text-sm text-muted">Casas de Show</p>
              <p className="text-2xl font-bold text-text">{loading ? '...' : stats.casasDeShow}</p>
            </div>
          </div>
          <p className="text-sm text-muted">
            {loading ? '...' : stats.totalUsuarios > 0 ? Math.round((stats.casasDeShow / stats.totalUsuarios) * 100) : 0}% do total de usuários
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="glass p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-accent/20 rounded-xl">
              <Music className="text-accent" size={24} />
            </div>
            <div>
              <p className="text-sm text-muted">Artistas</p>
              <p className="text-2xl font-bold text-text">{loading ? '...' : stats.artistas}</p>
            </div>
          </div>
          <p className="text-sm text-muted">
            {loading ? '...' : stats.totalUsuarios > 0 ? Math.round((stats.artistas / stats.totalUsuarios) * 100) : 0}% do total de usuários
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="glass p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-success/20 rounded-xl">
              <UserPlus className="text-success" size={24} />
            </div>
            <div>
              <p className="text-sm text-muted">Administradores</p>
              <p className="text-2xl font-bold text-text">{loading ? '...' : stats.administradores}</p>
            </div>
          </div>
          <p className="text-sm text-muted">
            {loading ? '...' : stats.totalUsuarios > 0 ? Math.round((stats.administradores / stats.totalUsuarios) * 100) : 0}% do total de usuários
          </p>
        </motion.div>
      </div>
    </div>
  );
}
