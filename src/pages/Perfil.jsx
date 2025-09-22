import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Users, MessageSquare, Building } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line } from 'recharts';

const profileData = {
  name: "Ana Silva",
  email: "ana@nightout.com",
  avatar: "https://images.unsplash.com/photo-1494790108755-2616b612d48b?w=150&h=150&fit=crop&crop=face&auto=format",
  bio: "Gerente de eventos especializada em noite e entretenimento. Apaixonada por criar experiências únicas.",
  phone: "(11) 99999-9999",
  location: "São Paulo, SP",
  followers: "12.5K",
  following: "892"
};

const salesData = [
  { name: 'Eventos', value: 45 },
  { name: 'Bar', value: 30 },
  { name: 'VIP', value: 25 }
];

const sparklineData = [
  { value: 10 }, { value: 25 }, { value: 15 }, { value: 35 }, 
  { value: 30 }, { value: 45 }, { value: 40 }, { value: 55 }
];

const COLORS = ['#2D6BFF', '#00B3FF', '#8B5CF6'];

export default function Perfil() {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass p-8"
      >
        <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-6 lg:space-y-0 lg:space-x-8">
          <motion.img
            whileHover={{ scale: 1.05 }}
            src={profileData.avatar}
            alt={profileData.name}
            className="w-32 h-32 rounded-full object-cover glow-primary"
          />
          
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-text mb-2">{profileData.name}</h1>
            <p className="text-muted mb-4">{profileData.email}</p>
            
            <div className="flex flex-wrap gap-6 mb-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{profileData.followers}</p>
                <p className="text-muted text-sm">Seguidores</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary2">{profileData.following}</p>
                <p className="text-muted text-sm">Seguindo</p>
              </div>
            </div>
            
            <p className="text-muted leading-relaxed max-w-2xl">{profileData.bio}</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="glass p-6 text-center"
      >
        <h2 className="text-2xl font-bold text-text mb-2">Bem vindo de volta!</h2>
        <p className="text-muted">Você tem 5 novos eventos para revisar hoje</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass p-6"
        >
          <h3 className="text-lg font-semibold text-text mb-6">Informações do Perfil</h3>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Phone size={18} className="text-muted" />
              <div>
                <p className="text-sm text-muted">Telefone</p>
                <p className="text-text">{profileData.phone}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Mail size={18} className="text-muted" />
              <div>
                <p className="text-sm text-muted">Email</p>
                <p className="text-text">{profileData.email}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <MapPin size={18} className="text-muted" />
              <div>
                <p className="text-sm text-muted">Localização</p>
                <p className="text-text">{profileData.location}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Users size={18} className="text-muted" />
              <div>
                <p className="text-sm text-muted">Conexões</p>
                <p className="text-text">250+ profissionais</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="glass p-6"
        >
          <h3 className="text-lg font-semibold text-text mb-6">Informações de Vendas</h3>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <ResponsiveContainer width="100%" height={120}>
                <PieChart>
                  <Pie
                    data={salesData}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={50}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {salesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="text-center">
                <p className="text-2xl font-bold text-text">R$ 45K</p>
                <p className="text-muted text-sm">Total de Vendas</p>
              </div>
            </div>
            
            <div>
              <ResponsiveContainer width="100%" height={60}>
                <LineChart data={sparklineData}>
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#2D6BFF" 
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
              <div className="mt-4">
                <p className="text-2xl font-bold text-success">+15%</p>
                <p className="text-muted text-sm">vs mês anterior</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="glass p-6"
      >
        <h3 className="text-lg font-semibold text-text mb-6">Estabelecimentos / Mensagens</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { 
              icon: Building, 
              title: "Bulls Beer", 
              subtitle: "3 eventos ativos",
              color: "text-primary"
            },
            { 
              icon: MessageSquare, 
              title: "12 Mensagens", 
              subtitle: "5 não lidas",
              color: "text-primary2"
            },
            { 
              icon: Users, 
              title: "Equipe", 
              subtitle: "8 membros online",
              color: "text-accent"
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02, y: -2 }}
              className="bg-panel/50 border border-border rounded-xl p-4 hover:bg-panel/70 transition-all duration-200 cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg bg-${item.color.split('-')[1]}/20`}>
                  <item.icon size={20} className={item.color} />
                </div>
                <div>
                  <p className="font-medium text-text">{item.title}</p>
                  <p className="text-muted text-sm">{item.subtitle}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}