import { motion } from 'framer-motion';
import { Star, MapPin, ArrowRight } from 'lucide-react';
import { establishmentsData } from '../data/mocks';

export default function Estabelecimentos() {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass p-6"
      >
        <h2 className="text-2xl font-bold text-text mb-2">Estabelecimentos</h2>
        <p className="text-muted">Descubra os melhores locais para curtir a noite</p>
      </motion.div>

      <div className="space-y-6">
        {establishmentsData.map((establishment, index) => (
          <motion.div
            key={establishment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            whileHover={{ scale: 1.01, y: -2 }}
            className="glass p-6 hover:glow-primary transition-all duration-300"
          >
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="relative lg:w-80 h-48 lg:h-64">
                <img
                  src={establishment.image}
                  alt={establishment.name}
                  className="w-full h-full object-cover rounded-xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-xl" />
                
                <div className="absolute top-4 left-4 flex items-center space-x-1 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <Star size={14} className="text-warning fill-warning" />
                  <span className="text-white text-sm font-medium">{establishment.rating}</span>
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-text mb-3">
                    {establishment.name}
                  </h3>
                  
                  <p className="text-muted text-lg mb-4 leading-relaxed">
                    {establishment.description}
                  </p>
                  
                  <div className="flex items-center text-muted mb-6">
                    <MapPin size={16} className="mr-2" />
                    <span>{establishment.location}</span>
                  </div>
                </div>

                <div className="flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center space-x-2 btn-primary px-8 py-3 glow-primary"
                  >
                    <span className="font-semibold">VER TUDO</span>
                    <ArrowRight size={18} />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="text-center py-8"
      >
        <button className="btn-secondary px-8 py-3">
          Carregar Mais Estabelecimentos
        </button>
      </motion.div>
    </div>
  );
}