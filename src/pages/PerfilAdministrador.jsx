import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, Briefcase, Shield, Camera, Edit } from 'lucide-react';
import { getCurrentUser, authFetch } from '../services/auth';

export default function PerfilAdministrador() {
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
      const data = await authFetch(`/adm/${currentUser.id}`);
      console.log('Admin details fetched:', data);
      setUserDetails(data);
    } catch (err) {
      console.error('Erro ao buscar detalhes do administrador:', err);
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

  const displayAvatar = avatar || 'https://images.unsplash.com/photo-1494790108755-2616b612d48b?w=150&h=150&fit=crop&crop=face&auto=format';
  const displayName = user?.name || userDetails?.usuario?.nome || 'Administrador';
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
              <span className="px-3 py-1 bg-primary/20 text-primary rounded-lg text-sm font-medium">
                Administrador
              </span>
              {userDetails?.permissao_nivel && (
                <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-lg text-sm font-medium">
                  {userDetails.permissao_nivel}
                </span>
              )}
            </div>
          </div>

          <button className="btn-primary px-6 py-3 flex items-center gap-2">
            <Edit size={20} />
            Editar Perfil
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="glass p-6"
        >
          <h2 className="text-xl font-semibold text-text mb-6">Informações do Administrador</h2>
          <div className="space-y-4">
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
              <Briefcase className="text-primary mt-1" size={20} />
              <div>
                <p className="text-sm text-muted">Cargo</p>
                <p className="text-text">{userDetails?.cargo || 'Não informado'}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Shield className="text-primary mt-1" size={20} />
              <div>
                <p className="text-sm text-muted">Nível de Permissão</p>
                <p className="text-text">{userDetails?.permissao_nivel || 'Não informado'}</p>
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
          <h2 className="text-xl font-semibold text-text mb-6">Sobre</h2>
          <p className="text-muted leading-relaxed">
            Administrador responsável pela gestão e moderação da plataforma Night Out. 
            Responsável por gerenciar usuários, aprovar cadastros e manter a qualidade do sistema.
          </p>

          <div className="mt-6 pt-6 border-t border-border">
            <h3 className="text-sm font-semibold text-text mb-3">Responsabilidades</h3>
            <ul className="space-y-2 text-muted text-sm">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                Gerenciar usuários e permissões
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                Aprovar cadastros de artistas e casas de show
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                Monitorar atividades do sistema
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                Garantir qualidade e segurança da plataforma
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
