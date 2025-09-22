import { motion } from 'framer-motion';
import { DollarSign, UserPlus, Ticket, Clock } from 'lucide-react';

const iconMap = {
  payment: DollarSign,
  user: UserPlus,
  ticket: Ticket
};

export default function OrdersFeed({ data }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="glass p-6"
    >
      <h3 className="text-lg font-semibold text-text mb-6">Visão Geral dos Pedidos</h3>
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {data.map((order, index) => {
          const IconComponent = iconMap[order.type];
          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="flex items-center space-x-4 p-3 hover:bg-panel/30 rounded-xl transition-colors duration-200"
            >
              <div className={`p-2 rounded-lg ${
                order.type === 'payment' ? 'bg-success/20 text-success' :
                order.type === 'user' ? 'bg-primary/20 text-primary' :
                'bg-accent/20 text-accent'
              }`}>
                <IconComponent size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-text text-sm font-medium truncate">
                  {order.description}
                </p>
                <div className="flex items-center text-muted text-xs mt-1">
                  <Clock size={12} className="mr-1" />
                  {order.time}
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-medium ${
                  order.type === 'payment' ? 'text-success' :
                  order.type === 'user' ? 'text-primary' :
                  'text-accent'
                }`}>
                  {order.amount}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}