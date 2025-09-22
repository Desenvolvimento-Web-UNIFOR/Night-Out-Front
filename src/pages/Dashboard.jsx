import { motion } from 'framer-motion';
import { Gauge } from 'lucide-react';
import KPICard from '../components/KPICard';
import SalesChart from '../components/SalesChart';
import OrdersFeed from '../components/OrdersFeed';
import { kpiData, salesChartData, ordersData } from '../data/mocks';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => (
          <KPICard key={index} {...kpi} index={index} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-2 glass p-6 relative overflow-hidden"
        >
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop&auto=format')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-bg/90 via-bg/70 to-transparent" />
          
          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-text mb-2">
              Noite Perfeita Começa Aqui
            </h2>
            <p className="text-muted text-lg mb-6">
              Gerencie seus estabelecimentos e eventos com estilo
            </p>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Gauge className="text-success" size={24} />
                <div>
                  <p className="text-sm text-muted">Taxa de Satisfação</p>
                  <p className="text-2xl font-bold text-success">95%</p>
                </div>
              </div>
              
              <div className="relative w-20 h-20">
                <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-border"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-success"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeDasharray="95, 100"
                    strokeLinecap="round"
                    fill="none"
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-semibold text-success">95%</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <OrdersFeed data={ordersData} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesChart data={salesChartData} />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass p-6"
        >
          <h3 className="text-lg font-semibold text-text mb-6">Performance Mensal</h3>
          <div className="space-y-4">
            {[
              { label: 'Janeiro', value: 85, color: 'bg-primary' },
              { label: 'Fevereiro', value: 72, color: 'bg-primary2' },
              { label: 'Março', value: 90, color: 'bg-accent' },
              { label: 'Abril', value: 95, color: 'bg-success' }
            ].map((item, index) => (
              <div key={item.label} className="flex items-center space-x-4">
                <span className="text-muted text-sm w-20">{item.label}</span>
                <div className="flex-1 bg-panel rounded-full h-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.value}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className={`h-3 ${item.color} rounded-full`}
                  />
                </div>
                <span className="text-text text-sm font-medium w-8">{item.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Usuários', value: '12.5K', icon: '👥' },
          { label: 'Contratados', value: '1.2K', icon: '🤝' },
          { label: 'Vendas', value: 'R$ 89K', icon: '💰' },
          { label: 'Itens', value: '450', icon: '📦' }
        ].map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="glass p-6 text-center"
          >
            <div className="text-3xl mb-2">{item.icon}</div>
            <p className="text-2xl font-bold text-text">{item.value}</p>
            <p className="text-muted text-sm">{item.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}