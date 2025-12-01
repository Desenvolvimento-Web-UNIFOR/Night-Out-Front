import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, Music2, DollarSign, Briefcase, Camera, Link as LinkIcon } from 'lucide-react';
import { getCurrentUser, authFetch } from '../services/auth';

export default function PerfilArtista() {
  const [user, setUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);

    if (currentUser?.id) {
      const savedAvatar = localStorage.getItem(`avatar_${currentUser.id}`);
      if (savedAvatar) {
        setAvatar(savedAvatar);
      }
      fetchUserDetails(currentUser);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserDetails = async (currentUser) => {
    setLoading(true);
    try {
      const data = await authFetch(`/artista/${currentUser.id}`);
      const artistaData = data?.artista || data;
      setUserDetails(artistaData);
    } catch {
      setUserDetails(null);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione uma imagem válida.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('A imagem deve ter no máximo 5MB.');
      return;
    }

    setUploading(true);

    try {
      const img = new Image();
      const reader = new FileReader();
      
      reader.onload = (event) => {
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Redimensionar para 400x400 (avatar)
          const size = 400;
          canvas.width = size;
          canvas.height = size;
          
          // Calcular crop centralizado
          const scale = Math.max(size / img.width, size / img.height);
          const x = (size / 2) - (img.width / 2) * scale;
          const y = (size / 2) - (img.height / 2) * scale;
          
          ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
          
          // Comprimir para JPEG com qualidade 0.8
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
          setAvatar(compressedBase64);
          localStorage.setItem(`avatar_${user.id}`, compressedBase64);
          setUploading(false);
        };
        img.src = event.target.result;
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      alert('Erro ao processar imagem. Tente novamente.');
      setUploading(false);
    }
  };

  const displayAvatar = avatar || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=150&h=150&fit=crop&auto=format';
  const displayName = userDetails?.nome_artista || userDetails?.nomeArtista || user?.name || user?.nome || 'Artista';
  const displayEmail = user?.email || userDetails?.usuario?.email || userDetails?.email || 'email@nightout.com';
  const displayPhone = userDetails?.usuario?.telefone || userDetails?.telefone || 'Não informado';
  const displayGenero = userDetails?.genero_musical || userDetails?.generoMusical || 'Não informado';
  const displayCacheMin = userDetails?.cache_min || userDetails?.cacheMin || null;
  const displayPortfolio = userDetails?.portifolio || userDetails?.portfolio || null;
  const displayDescricao = userDetails?.descricao || null;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass p-8"
      >
        <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-6 lg:space-y-0 lg:space-x-8">
          <div className="relative">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <div
              onClick={handleAvatarClick}
              className="w-32 h-32 rounded-2xl overflow-hidden cursor-pointer relative group"
            >
              <img
                src={displayAvatar}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="text-white" size={32} />
              </div>
              {uploading && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                  <p className="text-white text-sm">Enviando...</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1">
            <h1 className="text-3xl font-bold text-text mb-2">{displayName}</h1>
            <p className="text-muted mb-4">{displayEmail}</p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-accent/20 text-accent rounded-lg text-sm font-medium">
                Artista
              </span>
              <span className="px-3 py-1 bg-success/20 text-success rounded-lg text-sm font-medium">
                Ativo
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="glass p-6"
        >
          <h2 className="text-xl font-semibold text-text mb-6">Informações do Artista</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Briefcase className="text-accent mt-1" size={20} />
              <div>
                <p className="text-sm text-muted">Nome Artístico</p>
                <p className="text-text">{displayName}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Music2 className="text-accent mt-1" size={20} />
              <div>
                <p className="text-sm text-muted">Gênero Musical</p>
                <p className="text-text">{displayGenero}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <DollarSign className="text-accent mt-1" size={20} />
              <div>
                <p className="text-sm text-muted">Cachê Mínimo</p>
                <p className="text-text">
                  {displayCacheMin
                    ? `R$ ${Number(displayCacheMin).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                    : 'Não informado'}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Mail className="text-accent mt-1" size={20} />
              <div>
                <p className="text-sm text-muted">Email</p>
                <p className="text-text">{displayEmail}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Phone className="text-accent mt-1" size={20} />
              <div>
                <p className="text-sm text-muted">Telefone</p>
                <p className="text-text">{displayPhone}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <LinkIcon className="text-accent mt-1" size={20} />
              <div>
                <p className="text-sm text-muted">Portfólio</p>
                {displayPortfolio ? (
                  <a 
                    href={displayPortfolio} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-accent hover:underline break-all"
                  >
                    {displayPortfolio}
                  </a>
                ) : (
                  <p className="text-text">Não informado</p>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass p-6"
        >
          <h2 className="text-xl font-semibold text-text mb-6">Sobre o Artista</h2>
          <p className="text-muted leading-relaxed">
            {displayDescricao || 'Artista profissional com vasta experiência em apresentações ao vivo, oferecendo performances envolventes e memoráveis para diversos tipos de eventos. Com um repertório diversificado e adaptável, busco proporcionar entretenimento de alta qualidade que conecta com o público e cria momentos inesquecíveis. Disponível para shows, festas, eventos corporativos e apresentações especiais, sempre mantendo o compromisso com a excelência artística e profissionalismo.'}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
