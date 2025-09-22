import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { motion } from 'framer-motion';

export default function SalesChart({ data }) {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass p-3 border border-border">
          <p className="text-text font-medium">{`${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} className={`text-sm ${entry.dataKey === 'vendas' ? 'text-primary' : 'text-primary2'}`}>
              {`${entry.dataKey === 'vendas' ? 'Vendas' : 'Receita'}: ${entry.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="glass p-6"
    >
      <h3 className="text-lg font-semibold text-text mb-6">Visão Geral de Vendas</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="vendas" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2D6BFF" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#2D6BFF" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="receita" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00B3FF" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#00B3FF" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1F2A44" strokeOpacity={0.3} />
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#AEC1D9', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#AEC1D9', fontSize: 12 }}
              tickFormatter={(value) => `${value / 1000}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="vendas"
              stroke="#2D6BFF"
              fillOpacity={1}
              fill="url(#vendas)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="receita"
              stroke="#00B3FF"
              fillOpacity={1}
              fill="url(#receita)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex justify-center space-x-6 mt-4">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-primary rounded-full mr-2"></div>
          <span className="text-muted text-sm">Vendas</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-primary2 rounded-full mr-2"></div>
          <span className="text-muted text-sm">Receita</span>
        </div>
      </div>
    </motion.div>
  );
}