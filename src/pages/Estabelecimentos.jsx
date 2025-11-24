import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, ArrowRight } from 'lucide-react';
import usePaginatedData from '../hooks/usePaginatedData';
import Pagination from '../components/Pagination';
import { authFetch } from '../services/auth';

function getVenueAvatar(venue) {
  try {
    const userId = venue.id_usuario || venue.id;
    if (!userId) return null;
    const savedAvatar = localStorage.getItem(`avatar_${userId}`);
    return savedAvatar || null;
  } catch {
    return null;
  }
}

export default function Estabelecimentos({ onNavigate }) {
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadHouses() {
      setLoading(true);
      setError('');

      try {
        const data = await authFetch('/casaDeShow?page=1&pageSize=200', {
          method: 'GET',
        });

        const raw = Array.isArray(data) ? data : data?.casas || data?.items || [];

        const mapped = raw.map((casa) => ({
          id: casa.id || casa.id_casa || casa.idCasa,
          id_usuario: casa.id_usuario || casa.idUsuario,
          name: casa.nome_fantasia || casa.nome || 'Casa de show',
          responsible: casa.responsavel || casa.nome_responsavel || casa.nome,
          address: casa.endereco || casa.logradouro,
          city: casa.cidade,
          state: casa.estado || casa.uf,
          capacity: casa.capacidade,
          phone: casa.telefone || casa.celular,
          rating: casa.avaliacao || casa.rating || null,
        }));

        setHouses(mapped);
      } catch (e) {
        console.error('Erro ao carregar casas de show', e);
        setError(e?.message || 'Falha ao carregar casas de show.');
      } finally {
        setLoading(false);
      }
    }

    loadHouses();
  }, []);

  const { items, total, page, setPage, pageSize } = usePaginatedData({
    mode: 'local',
    localData: houses,
    pageSize: 6,
  });

  const handleSeeEvents = () => {
    if (onNavigate) {
      onNavigate('/eventos');
    }
  };

  return (
    <div className="space-y-6 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-text">Casas de show</h2>
            <p className="text-muted">
              Descubra os estabelecimentos cadastrados na plataforma e conheça
              onde seus eventos preferidos acontecem.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="glass p-6 animate-pulse flex flex-col lg:flex-row gap-6"
              >
                <div className="bg-panel/60 rounded-xl h-48 lg:h-64 w-full lg:w-80" />
                <div className="flex-1 flex flex-col justify-between gap-4">
                  <div className="space-y-3">
                    <div className="h-6 bg-panel/60 rounded-md w-2/3" />
                    <div className="h-4 bg-panel/50 rounded-md w-full" />
                    <div className="h-4 bg-panel/40 rounded-md w-5/6" />
                  </div>
                  <div className="flex justify-end">
                    <div className="h-10 w-32 bg-panel/60 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <p className="text-red-400 text-sm">{error}</p>
        ) : items.length === 0 ? (
          <p className="text-muted text-sm">
            Nenhuma casa de show cadastrada até o momento.
          </p>
        ) : (
          <div className="space-y-6">
            {items.map((establishment, index) => {
              const avatar = getVenueAvatar(establishment);

              return (
                <motion.div
                  key={establishment.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="glass p-6 hover:glow-primary transition-all duration-300"
                >
                  <div className="flex flex-col lg:flex-row gap-6">
                    <div className="relative lg:w-80 h-48 lg:h-64">
                      {avatar ? (
                        <img
                          src={avatar}
                          alt={establishment.name}
                          className="w-full h-full object-cover rounded-xl"
                        />
                      ) : (
                        <div className="w-full h-full rounded-xl bg-panel flex items-center justify-center text-4xl text-muted">
                          {String(establishment.name || '?')
                            .charAt(0)
                            .toUpperCase()}
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-xl" />

                      {establishment.rating && (
                        <div className="absolute top-4 left-4 flex items-center space-x-1 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-full">
                          <Star size={14} className="text-warning fill-warning" />
                          <span className="text-white text-sm font-medium">
                            {establishment.rating}
                          </span>
                        </div>
                      )}

                      {establishment.city && (
                        <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs text-white flex items-center space-x-1">
                          <MapPin size={14} className="text-primary-light" />
                          <span>
                            {establishment.city}
                            {establishment.state ? ` - ${establishment.state}` : ''}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          {(() => {
                            const smallAvatar = avatar;
                            return smallAvatar ? (
                              <img
                                src={smallAvatar}
                                alt={establishment.name}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-panel flex items-center justify-center text-sm text-muted">
                                {String(establishment.name || '?')
                                  .charAt(0)
                                  .toUpperCase()}
                              </div>
                            );
                          })()}

                          <button
                            onClick={() =>
                              onNavigate?.(
                                `/casa/${establishment.id_usuario || establishment.id}`
                              )
                            }
                            className="font-semibold text-primary hover:text-primary-light transition-colors cursor-pointer text-left text-lg"
                          >
                            {establishment.name || '-'}
                          </button>
                        </div>

                        {establishment.responsible && (
                          <p className="text-sm text-muted mb-2">
                            Responsável:{' '}
                            <span className="font-medium text-text">
                              {establishment.responsible}
                            </span>
                          </p>
                        )}

                        {establishment.address && (
                          <div className="flex items-center text-sm text-muted mb-3">
                            <MapPin size={16} className="mr-2" />
                            <span>
                              {establishment.address}
                              {establishment.city
                                ? `, ${establishment.city}${
                                    establishment.state
                                      ? ` - ${establishment.state}`
                                      : ''
                                  }`
                                : ''}
                            </span>
                          </div>
                        )}

                        <div className="flex flex-wrap gap-3 mt-1 text-xs text-muted">
                          {establishment.capacity && (
                            <span className="px-3 py-1 rounded-full bg-panel/60">
                              Capacidade: {establishment.capacity}
                            </span>
                          )}
                          {establishment.phone && (
                            <span className="px-3 py-1 rounded-full bg-panel/60">
                              Contato: {establishment.phone}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-end mt-4">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.98 }}
                          type="button"
                          onClick={handleSeeEvents}
                          className="flex items-center space-x-2 btn-primary px-8 py-3 glow-primary"
                        >
                          <span className="font-semibold text-sm">VER EVENTOS</span>
                          <ArrowRight size={18} />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        <div className="mt-6">
          <Pagination
            page={page}
            pageSize={pageSize}
            total={total}
            onPageChange={setPage}
          />
        </div>
      </motion.div>
    </div>
  );
}