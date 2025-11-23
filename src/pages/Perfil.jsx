import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Users, Building, Camera } from 'lucide-react';
import { getCurrentUser, authFetch } from '../services/auth';

export default function Perfil() {
  const [user, setUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      setLoading(false);
      return;
    }

    setUser(currentUser);

    const savedAvatar = localStorage.getItem(`avatar_${currentUser.id}`);
    if (savedAvatar) {
      setAvatar(savedAvatar);
    }

    if (currentUser?.id && currentUser?.role) {
      fetchUserDetails(currentUser);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserDetails = async (currentUser) => {
    setLoading(true);
    try {
      let endpoint = '';
      const userType = currentUser.role?.toUpperCase();

      if (userType === 'ADMINISTRADOR' || userType === 'ADMIN' || userType === 'SUPER_ADMIN') {
        endpoint = `/adm/${currentUser.id}`;
      } else if (userType === 'ARTISTA') {
        endpoint = `/artista/${currentUser.id}`;
      } else if (userType === 'CASASHOW') {
        endpoint = `/casaDeShow/${currentUser.id}`;
      } else if (userType === 'CLIENTE') {
        endpoint = `/cliente/${currentUser.id}`;
      }

      if (endpoint) {
        const data = await authFetch(endpoint);
        console.log('User details fetched:', data);
        setUserDetails(data);
      }
    } catch (err) {
      console.error('Erro ao buscar detalhes do usuário:', err);
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
        if (user?.id) {
          localStorage.setItem(`avatar_${user.id}`, base64String);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Erro ao fazer upload da foto:', err);
      alert('Erro ao fazer upload da foto. Tente novamente.');
    } finally {
      setUploading(false);
    }
  };

  const primaryUsuario = Array.isArray(userDetails?.usuario)
    ? userDetails.usuario[0]
    : userDetails?.usuario;

  const displayName =
    userDetails?.nome_fantasia ||
    primaryUsuario?.nome ||
    user?.name ||
    user?.nome ||
    'Usuário';

  const displayEmail =
    primaryUsuario?.email ||
    user?.email ||
    'email@nightout.com';

  const displayBio = userDetails
    ? (() => {
        const partesLocal = [
          userDetails.endereco,
          userDetails.bairro,
          userDetails.estado
        ].filter(Boolean);

        const localStr = partesLocal.length ? ` localizada em ${partesLocal.join(', ')}` : '';
        const capStr = userDetails.capacidade
          ? `. Capacidade para ${userDetails.capacidade} pessoas.`
          : '';

        return `Casa de show ${userDetails.nome_fantasia || ''}${localStr}${capStr}`;
      })()
    : 'Complete os dados da sua casa de show para exibirmos mais informações aqui.';

  const displayAvatar =
    avatar ||
    'https://images.unsplash.com/photo-1494790108755-2616b612d48b?w=150&h=150&fit=crop&crop=face&auto=format';

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
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <motion.div
              whileHover={{ scale: 1.05 }}
              onClick={handleAvatarClick}
              className="relative cursor-pointer group"
            >
              <img
                src={displayAvatar}
                alt={displayName}
                className="w-32 h-32 rounded-full object-cover glow-primary"
              />
              <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera size={32} className="text-white" />
              </div>
              {uploading && (
                <div className="absolute inset-0 bg-black/70 rounded-full flex items-center justify-center">
                  <div className="spinner"></div>
                </div>
              )}
            </motion.div>
          </div>

          <div className="flex-1">
            <h1 className="text-3xl font-bold text-text mb-2">{displayName}</h1>
            <p className="text-muted mb-4">{displayEmail}</p>

            <div className="flex flex-wrap gap-6 mb-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">
                  {userDetails?.capacidade ?? '-'}
                </p>
                <p className="text-muted text-sm">Capacidade</p>
              </div>
            </div>

            <p className="text-muted leading-relaxed max-w-2xl">
              {displayBio}
            </p>
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
        <p className="text-muted">
          Aproveite para gerenciar seus eventos e criar experiências incríveis para o seu público
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="glass p-6"
      >
        <h3 className="text-lg font-semibold text-text mb-6">Informações do Perfil</h3>

        {loading ? (
          <div className="text-center py-8">
            <div className="spinner mx-auto mb-4"></div>
            <p className="text-muted">Carregando informações…</p>
          </div>
        ) : userDetails ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-3">
              <Mail size={18} className="text-muted" />
              <div>
                <p className="text-sm text-muted">Email</p>
                <p className="text-text">
                  {primaryUsuario?.email || displayEmail}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Phone size={18} className="text-muted" />
              <div>
                <p className="text-sm text-muted">Telefone</p>
                <p className="text-text">
                  {primaryUsuario?.telefone || userDetails.usuario?.telefone || '-'}
                </p>
              </div>
            </div>

            {userDetails.cargo && (
              <div className="flex items-center space-x-3">
                <Users size={18} className="text-muted" />
                <div>
                  <p className="text-sm text-muted">Cargo</p>
                  <p className="text-text">{userDetails.cargo}</p>
                </div>
              </div>
            )}

            {userDetails.permissao_nivel && (
              <div className="flex items-center space-x-3">
                <Users size={18} className="text-muted" />
                <div>
                  <p className="text-sm text-muted">Nível de Permissão</p>
                  <p className="text-text">{userDetails.permissao_nivel}</p>
                </div>
              </div>
            )}

            {userDetails.nome_artista && (
              <div className="flex items-center space-x-3">
                <Users size={18} className="text-muted" />
                <div>
                  <p className="text-sm text-muted">Nome Artístico</p>
                  <p className="text-text">{userDetails.nome_artista}</p>
                </div>
              </div>
            )}

            {userDetails.genero_musical && (
              <div className="flex items-center space-x-3">
                <Users size={18} className="text-muted" />
                <div>
                  <p className="text-sm text-muted">Gênero Musical</p>
                  <p className="text-text">{userDetails.genero_musical}</p>
                </div>
              </div>
            )}

            {userDetails.cache_min && (
              <div className="flex items-center space-x-3">
                <Users size={18} className="text-muted" />
                <div>
                  <p className="text-sm text-muted">Cachê Mínimo</p>
                  <p className="text-text">R$ {userDetails.cache_min}</p>
                </div>
              </div>
            )}

            {userDetails.nome_fantasia && (
              <div className="flex items-center space-x-3">
                <Building size={18} className="text-muted" />
                <div>
                  <p className="text-sm text-muted">Nome Fantasia</p>
                  <p className="text-text">{userDetails.nome_fantasia}</p>
                </div>
              </div>
            )}

            {userDetails.cnpj && (
              <div className="flex items-center space-x-3">
                <Building size={18} className="text-muted" />
                <div>
                  <p className="text-sm text-muted">CNPJ</p>
                  <p className="text-text">{userDetails.cnpj}</p>
                </div>
              </div>
            )}

            {userDetails.capacidade && (
              <div className="flex items-center space-x-3">
                <Users size={18} className="text-muted" />
                <div>
                  <p className="text-sm text-muted">Capacidade</p>
                  <p className="text-text">{userDetails.capacidade} pessoas</p>
                </div>
              </div>
            )}

            {userDetails.endereco && (
              <div className="flex items-center space-x-3">
                <MapPin size={18} className="text-muted" />
                <div>
                  <p className="text-sm text-muted">Endereço</p>
                  <p className="text-text">
                    {userDetails.endereco}
                    {userDetails.bairro ? `, ${userDetails.bairro}` : ''}
                  </p>
                </div>
              </div>
            )}

            {userDetails.estado && (
              <div className="flex items-center space-x-3">
                <MapPin size={18} className="text-muted" />
                <div>
                  <p className="text-sm text-muted">Estado</p>
                  <p className="text-text">{userDetails.estado}</p>
                </div>
              </div>
            )}

            {userDetails.cep && (
              <div className="flex items-center space-x-3">
                <MapPin size={18} className="text-muted" />
                <div>
                  <p className="text-sm text-muted">CEP</p>
                  <p className="text-text">{userDetails.cep}</p>
                </div>
              </div>
            )}

            {userDetails.apelido && (
              <div className="flex items-center space-x-3">
                <Users size={18} className="text-muted" />
                <div>
                  <p className="text-sm text-muted">Apelido</p>
                  <p className="text-text">{userDetails.apelido}</p>
                </div>
              </div>
            )}

            {userDetails.data_nascimento && (
              <div className="flex items-center space-x-3">
                <Users size={18} className="text-muted" />
                <div>
                  <p className="text-sm text-muted">Data de Nascimento</p>
                  <p className="text-text">
                    {new Date(userDetails.data_nascimento).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-center text-muted py-8">
            Nenhuma informação disponível.
          </p>
        )}
      </motion.div>

      {/* <motion.div
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
      </motion.div> */}
    </div>
  );
}
