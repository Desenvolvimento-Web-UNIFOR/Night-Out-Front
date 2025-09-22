import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Users, UserPlus, DollarSign } from 'lucide-react';

const iconMap = {
  TrendingUp,
  Users,
  UserPlus,
  DollarSign
};

export default function KPICard({ title, value, change, positive, icon, index }) {
  const IconComponent = iconMap[icon] || TrendingUp;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.01, y: -2 }}
      className="glass p-6 hover:glow-primary transition-all duration-300"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-text mt-1">{value}</p>
          <div className="flex items-center mt-2">
            {positive ? (
              <TrendingUp size={16} className="text-success mr-1" />
            ) : (
              <TrendingDown size={16} className="text-danger mr-1" />
            )}
            <span className={`text-sm font-medium ${positive ? 'text-success' : 'text-danger'}`}>
              {change}
            </span>
            <span className="text-muted text-sm ml-1">vs último mês</span>
          </div>
        </div>
        <div className="p-3 bg-primary/20 rounded-xl">
          <IconComponent size={24} className="text-primary" />
        </div>
      </div>
    </motion.div>
  );
}