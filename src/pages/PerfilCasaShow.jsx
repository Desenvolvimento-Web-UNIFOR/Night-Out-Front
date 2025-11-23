import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, Building, MapPin, Users, Camera, FileText } from 'lucide-react';
import { getCurrentUser, authFetch } from '../services/auth';

export default function PerfilCasaShow() {
  const [user, setUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    
    const savedAvatar = localStorage.getItem(`avatar_${currentUser.id}`);
    if (savedAvatar) {
      setAvatar(savedAvatar);
    }

    if (currentUser?.id) {
      fetchUserDetails(currentUser);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserDetails = async (currentUser) => {
    setLoading(true);
    try {
      const data = await authFetch(`/casaDeShow/${currentUser.id}`);
      console.log('Casa de Show details fetched:', data);
      setUserDetails(data);
    } catch (err) {
      console.error('Erro ao buscar detalhes da casa de show:', err);
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
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setAvatar(base64String);
        localStorage.setItem(`avatar_${user.id}`, base64String);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Erro ao fazer upload da foto:', err);
      alert('Erro ao fazer upload da foto. Tente novamente.');
    } finally {
      setUploading(false);
    }
  };

  const displayAvatar = avatar || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=150&h=150&fit=crop&auto=format';
  const displayName = userDetails?.nome_fantasia || user?.name || 'Casa de Show';
  const displayEmail = user?.email || userDetails?.usuario?.email || 'email@nightout.com';

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
                alt="Logo"
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
              <span className="px-3 py-1 bg-primary/20 text-primary rounded-lg text-sm font-medium">
                Casa de Show
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
          <h2 className="text-xl font-semibold text-text mb-6">Informações do Estabelecimento</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Building className="text-primary mt-1" size={20} />
              <div>
                <p className="text-sm text-muted">Nome Fantasia</p>
                <p className="text-text">{userDetails?.nome_fantasia || 'Não informado'}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <FileText className="text-primary mt-1" size={20} />
              <div>
                <p className="text-sm text-muted">CNPJ</p>
                <p className="text-text">{userDetails?.cnpj || 'Não informado'}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Mail className="text-primary mt-1" size={20} />
              <div>
                <p className="text-sm text-muted">Email</p>
                <p className="text-text">{displayEmail}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Phone className="text-primary mt-1" size={20} />
              <div>
                <p className="text-sm text-muted">Telefone</p>
                <p className="text-text">{userDetails?.usuario?.telefone || 'Não informado'}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <MapPin className="text-primary mt-1" size={20} />
              <div>
                <p className="text-sm text-muted">Endereço</p>
                <p className="text-text">{userDetails?.endereco || 'Não informado'}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Users className="text-primary mt-1" size={20} />
              <div>
                <p className="text-sm text-muted">Capacidade</p>
                <p className="text-text">{userDetails?.capacidade ? `${userDetails.capacidade} pessoas` : 'Não informado'}</p>
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
          <h2 className="text-xl font-semibold text-text mb-6">Sobre o Estabelecimento</h2>
          <p className="text-muted leading-relaxed mb-6">
            {userDetails?.descricao || 'Casa de show especializada em proporcionar as melhores experiências de entretenimento noturno. Espaço moderno e acolhedor para eventos musicais e apresentações artísticas.'}
          </p>

          <div className="pt-6 border-t border-border">
            <h3 className="text-sm font-semibold text-text mb-3">Estatísticas</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-light p-4 rounded-xl">
                <p className="text-2xl font-bold text-primary">24</p>
                <p className="text-sm text-muted">Eventos Realizados</p>
              </div>
              <div className="glass-light p-4 rounded-xl">
                <p className="text-2xl font-bold text-success">4.8</p>
                <p className="text-sm text-muted">Avaliação Média</p>
              </div>
              <div className="glass-light p-4 rounded-xl">
                <p className="text-2xl font-bold text-info">2.4k</p>
                <p className="text-sm text-muted">Público Total</p>
              </div>
              <div className="glass-light p-4 rounded-xl">
                <p className="text-2xl font-bold text-warning">12</p>
                <p className="text-sm text-muted">Próximos Eventos</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
