import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Ticket, ArrowRight } from 'lucide-react';
import { eventsData } from '../data/mocks';

export default function Eventos({ onNavigate }) {
  useEffect(() => {
    if (Array.isArray(eventsData)) {
      window.__EVENTS__ = eventsData;
    }
  }, []);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass p-6"
      >
        <h2 className="text-2xl font-bold text-text mb-2">Eventos</h2>
        <p className="text-muted">Os melhores eventos da cidade te esperam</p>
      </motion.div>

      <div className="space-y-6">
        {eventsData.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            whileHover={{ scale: 1.01, y: -2 }}
            className="glass p-6 hover:glow-primary transition-all duration-300"
          >
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="relative lg:w-80 h-48 lg:h-64">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover rounded-xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-xl" />
                
                <div className="absolute bottom-4 right-4 flex items-center space-x-2 bg-black/70 backdrop-blur-sm px-3 py-2 rounded-full">
                  <img
                    src={event.artist.avatar}
                    alt={event.artist.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="text-white text-sm font-medium">{event.artist.name}</span>
                </div>
                
                <div className="absolute top-4 left-4 bg-primary/90 backdrop-blur-sm px-4 py-2 rounded-full">
                  <span className="text-white text-sm font-bold">{event.date}</span>
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-text mb-3">
                    {event.title}
                  </h3>
                  
                  <p className="text-muted text-lg mb-6 leading-relaxed">
                    {event.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-4 mb-6">
                    <div className="flex items-center text-muted">
                      <Calendar size={16} className="mr-2" />
                      <span>{event.date}</span>
                    </div>
                    
                    <div className="flex items-center text-muted">
                      <Clock size={16} className="mr-2" />
                      <span>22:00</span>
                    </div>
                    
                    <div className="flex items-center text-success">
                      <Ticket size={16} className="mr-2" />
                      <span className="font-semibold">{event.price}</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onNavigate(`/event/${event.id}`)}
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
          Carregar Mais Eventos
        </button>
      </motion.div>
    </div>
  );
}
