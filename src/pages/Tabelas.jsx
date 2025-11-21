import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Edit, MoreVertical, AlertTriangle, X } from 'lucide-react';
import usePaginatedData from '../hooks/usePaginatedData';
import Pagination from '../components/Pagination';
import AdminSolicitacoes from '../components/AdminSolicitacoes';
import { authFetch } from '../services/auth';
/* eslint-disable react/prop-types */

function ViewEmployeeDetailsModal({ open, employeeId, onClose }) {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && employeeId) {
      setLoading(true);
      authFetch(`/adm/${employeeId}`)
        .then((data) => {
          console.log('Employee data received:', data);
          setEmployee(data);
        })
        .catch((err) => {
          console.error('Erro ao buscar funcionário:', err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [open, employeeId]);

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2 }}
            className="glass p-6 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-text">Informações do Funcionário</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-surface-light rounded-lg transition-colors"
              >
                <X size={24} className="text-muted" />
              </button>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="spinner mx-auto mb-4"></div>
                <p className="text-muted">Carregando informações…</p>
              </div>
            ) : employee ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-muted mb-1">Nome</label>
                    <p className="text-text">{employee.usuario?.nome || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted mb-1">Email</label>
                    <p className="text-text">{employee.usuario?.email || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted mb-1">Telefone</label>
                    <p className="text-text">{employee.usuario?.telefone || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted mb-1">Cargo</label>
                    <p className="text-text">{employee.cargo || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted mb-1">Nível de Permissão</label>
                    <p className="text-text">{employee.permissao_nivel || '-'}</p>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="bg-primary hover:bg-primary/80 text-white px-6 py-2 rounded-lg transition-colors font-medium"
                  >
                    Voltar
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-center text-muted py-8">Nenhuma informação disponível.</p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ViewArtistDetailsModal({ open, artistId, onClose }) {
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && artistId) {
      setLoading(true);
      authFetch(`/artista/${artistId}`)
        .then((data) => {
          console.log('Artist data received:', data);
          setArtist(data);
        })
        .catch((err) => {
          console.error('Erro ao buscar artista:', err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [open, artistId]);

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2 }}
            className="glass p-6 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-text">Informações do Artista</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-surface-light rounded-lg transition-colors"
              >
                <X size={24} className="text-muted" />
              </button>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="spinner mx-auto mb-4"></div>
                <p className="text-muted">Carregando informações…</p>
              </div>
            ) : artist ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-muted mb-1">Nome Real</label>
                    <p className="text-text">{artist.usuario?.nome || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted mb-1">Nome Artístico</label>
                    <p className="text-text">{artist.nome_artista || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted mb-1">Email</label>
                    <p className="text-text">{artist.usuario?.email || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted mb-1">Telefone</label>
                    <p className="text-text">{artist.usuario?.telefone || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted mb-1">Gênero Musical</label>
                    <p className="text-text">{artist.genero_musical || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted mb-1">Cachê Mínimo</label>
                    <p className="text-text">{artist.cache_min ? `R$ ${artist.cache_min}` : '-'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-muted mb-1">Descrição</label>
                    <p className="text-text">{artist.descricao || '-'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-muted mb-1">Portfólio</label>
                    <p className="text-text break-all">{artist.portifolio || '-'}</p>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="bg-primary hover:bg-primary/80 text-white px-6 py-2 rounded-lg transition-colors font-medium"
                  >
                    Voltar
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-center text-muted py-8">Nenhuma informação disponível.</p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ViewVenueDetailsModal({ open, venueId, onClose }) {
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && venueId) {
      setLoading(true);
      authFetch(`/casaDeShow/${venueId}`)
        .then((data) => {
          console.log('Venue data received:', data);
          setVenue(data);
        })
        .catch((err) => {
          console.error('Erro ao buscar casa de show:', err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [open, venueId]);

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2 }}
            className="glass p-6 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-text">Informações da Casa de Show</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-surface-light rounded-lg transition-colors"
              >
                <X size={24} className="text-muted" />
              </button>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="spinner mx-auto mb-4"></div>
                <p className="text-muted">Carregando informações…</p>
              </div>
            ) : venue ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-muted mb-1">Nome Fantasia</label>
                    <p className="text-text">{venue.nome_fantasia || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted mb-1">CNPJ</label>
                    <p className="text-text">{venue.cnpj || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted mb-1">Responsável</label>
                    <p className="text-text">{venue.usuario?.nome || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted mb-1">Email</label>
                    <p className="text-text">{venue.usuario?.email || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted mb-1">Telefone</label>
                    <p className="text-text">{venue.usuario?.telefone || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted mb-1">Capacidade</label>
                    <p className="text-text">{venue.capacidade || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted mb-1">Endereço</label>
                    <p className="text-text">{venue.endereco || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted mb-1">Bairro</label>
                    <p className="text-text">{venue.bairro || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted mb-1">Estado</label>
                    <p className="text-text">{venue.estado || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted mb-1">CEP</label>
                    <p className="text-text">{venue.cep || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted mb-1">Latitude</label>
                    <p className="text-text">{venue.geo_lat || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted mb-1">Longitude</label>
                    <p className="text-text">{venue.geo_lng || '-'}</p>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="bg-primary hover:bg-primary/80 text-white px-6 py-2 rounded-lg transition-colors font-medium"
                  >
                    Voltar
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-center text-muted py-8">Nenhuma informação disponível.</p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ViewClientDetailsModal({ open, clientId, onClose }) {
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && clientId) {
      setLoading(true);
      authFetch(`/cliente/${clientId}`)
        .then((data) => {
          console.log('Client data received:', data);
          setClient(data);
        })
        .catch((err) => {
          console.error('Erro ao buscar cliente:', err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [open, clientId]);

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2 }}
            className="glass p-6 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-text">Informações do Cliente</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-surface-light rounded-lg transition-colors"
              >
                <X size={24} className="text-muted" />
              </button>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="spinner mx-auto mb-4"></div>
                <p className="text-muted">Carregando informações…</p>
              </div>
            ) : client ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-muted mb-1">Nome</label>
                    <p className="text-text">{client.usuario?.nome || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted mb-1">Apelido</label>
                    <p className="text-text">{client.apelido || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted mb-1">Email</label>
                    <p className="text-text">{client.usuario?.email || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted mb-1">Telefone</label>
                    <p className="text-text">{client.usuario?.telefone || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted mb-1">Data de Nascimento</label>
                    <p className="text-text">{client.data_nascimento ? new Date(client.data_nascimento).toLocaleDateString('pt-BR') : '-'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-muted mb-1">Preferências</label>
                    <p className="text-text">{client.preferencias || '-'}</p>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="bg-primary hover:bg-primary/80 text-white px-6 py-2 rounded-lg transition-colors font-medium"
                  >
                    Voltar
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-center text-muted py-8">Nenhuma informação disponível.</p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function DeleteConfirmModal({ open, item, itemType, onClose, onConfirm }) {
  const [deleting, setDeleting] = useState(false);

  const getItemName = () => {
    if (!item) return 'este item';
    switch (itemType) {
      case 'employee':
        return item.nome || item.name || 'este funcionário';
      case 'artist':
        return item.nome || item.name || 'este artista';
      case 'venue':
        return item.nome_fantasia || item.nome || 'esta casa de show';
      case 'client':
        return item.nome || item.name || 'este cliente';
      default:
        return 'este item';
    }
  };

  const handleConfirm = async () => {
    setDeleting(true);
    await onConfirm();
    setDeleting(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2 }}
            className="glass p-6 rounded-2xl w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-danger/20 flex items-center justify-center">
                <AlertTriangle className="text-danger" size={24} />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-text mb-2">
                  Confirmar Exclusão
                </h2>
                <p className="text-muted mb-6">
                  Tem certeza que deseja excluir <span className="text-text font-semibold">{getItemName()}</span>? 
                  Esta ação não pode ser desfeita.
                </p>
                
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="btn-secondary px-4 py-2"
                    disabled={deleting}
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirm}
                    className="bg-danger hover:bg-danger/80 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 font-medium"
                    disabled={deleting}
                  >
                    {deleting ? 'Excluindo…' : 'Sim, Excluir'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function EditUserModal({ open, user, onClose, onSaved }) {
  const [form, setForm] = useState({
    nome: '',
    email: '',
    telefone: '',
    cargo: '',
    permissao_nivel: '',
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || !open) return;

    async function fetchDetails() {
      setLoading(true);
      try {
        const details = await authFetch(`/adm/${user.id}`, { method: 'GET' });
        console.log('Detalhes recebidos:', details);
        
        const usuarioData = details.usuario || {};
        
        setForm({
          nome: usuarioData.nome || '',
          email: usuarioData.email || '',
          telefone: usuarioData.telefone || '',
          cargo: details.cargo || '',
          permissao_nivel: details.permissao_nivel || '',
        });
        console.log('Form populado:', {
          nome: usuarioData.nome,
          email: usuarioData.email,
          telefone: usuarioData.telefone,
          cargo: details.cargo,
          permissao_nivel: details.permissao_nivel,
        });
      } catch (err) {
        console.error('Erro ao buscar detalhes do administrador:', err);
        setForm({
          nome: user.nome || user.name || '',
          email: user.email || '',
          telefone: user.telefone || '',
          cargo: user.cargo || '',
          permissao_nivel: user.permissao_nivel || '',
        });
      } finally {
        setLoading(false);
      }
    }

    fetchDetails();
  }, [user, open]);

  if (!open || !user) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const body = {
        cargo: form.cargo,
        permissao_nivel: form.permissao_nivel,
        usuario: [
          {
            nome: form.nome,
            email: form.email,
            telefone: form.telefone,
          },
        ],
      };

      const updated = await authFetch(`/adm/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      onSaved(updated && updated.id ? updated : { ...user, nome: form.nome, email: form.email, telefone: form.telefone, cargo: form.cargo, permissao_nivel: form.permissao_nivel });
    } catch (err) {
      alert(err?.message || 'Não foi possível salvar as alterações.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2 }}
            className="glass p-6 rounded-2xl w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold text-text mb-4">
              Editar Funcionário
            </h2>

            {loading ? (
              <div className="py-8 text-center text-muted">
                Carregando detalhes...
              </div>
            ) : (
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm text-muted mb-1">Nome</label>
                  <input
                    name="nome"
                    value={form.nome}
                    onChange={handleChange}
                    className="w-full bg-panel border border-border rounded-lg px-3 py-2 text-text focus-ring"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-muted mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full bg-panel border border-border rounded-lg px-3 py-2 text-text focus-ring"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-muted mb-1">Telefone</label>
                  <input
                    name="telefone"
                    value={form.telefone}
                    onChange={handleChange}
                    className="w-full bg-panel border border-border rounded-lg px-3 py-2 text-text focus-ring"
                  />
                </div>

                <div>
                  <label className="block text-sm text-muted mb-1">Cargo</label>
                  <input
                    name="cargo"
                    value={form.cargo}
                    onChange={handleChange}
                    className="w-full bg-panel border border-border rounded-lg px-3 py-2 text-text focus-ring"
                    placeholder="Ex: Gerente OPS"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-muted mb-1">Nível de Permissão</label>
                  <select
                    name="permissao_nivel"
                    value={form.permissao_nivel}
                    onChange={handleChange}
                    className="w-full bg-panel border border-border rounded-lg px-3 py-2 text-text focus-ring"
                    required
                  >
                    <option value="">Selecione…</option>
                    <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                    <option value="ADMIN">ADMIN</option>
                    <option value="MODERADOR">MODERADOR</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="btn-secondary px-4 py-2"
                    disabled={saving}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn-primary px-4 py-2 disabled:opacity-50"
                    disabled={saving}
                  >
                    {saving ? 'Salvando…' : 'Salvar'}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function EditArtistModal({ open, artist, onClose, onSaved }) {
  const [form, setForm] = useState({
    nome: '',
    email: '',
    telefone: '',
    nome_artista: '',
    genero_musical: '',
    cache_min: '',
    descricao: '',
    portifolio: '',
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!artist || !open) return;

    async function fetchDetails() {
      setLoading(true);
      try {
        const details = await authFetch(`/artista/${artist.id}`, { method: 'GET' });
        console.log('Detalhes do artista recebidos:', details);
        
        const usuarioData = details.usuario || {};
        
        setForm({
          nome: usuarioData.nome || '',
          email: usuarioData.email || '',
          telefone: usuarioData.telefone || '',
          nome_artista: details.nome_artista || '',
          genero_musical: details.genero_musical || '',
          cache_min: details.cache_min || '',
          descricao: details.descricao || '',
          portifolio: details.portifolio || '',
        });
      } catch (err) {
        console.error('Erro ao buscar detalhes do artista:', err);
        setForm({
          nome: artist.nome || artist.name || '',
          email: artist.email || '',
          telefone: artist.telefone || '',
          nome_artista: artist.nome_artista || '',
          genero_musical: artist.genero_musical || '',
          cache_min: artist.cache_min || '',
          descricao: artist.descricao || '',
          portifolio: artist.portifolio || '',
        });
      } finally {
        setLoading(false);
      }
    }

    fetchDetails();
  }, [artist, open]);

  if (!open || !artist) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);

      const body = {
        nome_artista: form.nome_artista,
        genero_musical: form.genero_musical,
        cache_min: form.cache_min ? String(form.cache_min) : undefined,
        descricao: form.descricao,
        portifolio: form.portifolio,
        usuario: [
          {
            nome: form.nome,
            email: form.email,
            telefone: form.telefone,
          },
        ],
      };

      const updated = await authFetch(`/artista/${artist.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      onSaved(updated && updated.id ? updated : { ...artist, ...form });
    } catch (err) {
      alert(err?.message || 'Não foi possível salvar as alterações.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2 }}
            className="glass p-6 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold text-text mb-4">
              Editar Artista
            </h2>

            {loading ? (
              <div className="py-8 text-center text-muted">
                Carregando detalhes...
              </div>
            ) : (
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm text-muted mb-1">Nome Real</label>
                  <input
                    name="nome"
                    value={form.nome}
                    onChange={handleChange}
                    className="w-full bg-panel border border-border rounded-lg px-3 py-2 text-text focus-ring"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-muted mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full bg-panel border border-border rounded-lg px-3 py-2 text-text focus-ring"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-muted mb-1">Telefone</label>
                  <input
                    name="telefone"
                    value={form.telefone}
                    onChange={handleChange}
                    className="w-full bg-panel border border-border rounded-lg px-3 py-2 text-text focus-ring"
                  />
                </div>

                <div>
                  <label className="block text-sm text-muted mb-1">Nome Artístico</label>
                  <input
                    name="nome_artista"
                    value={form.nome_artista}
                    onChange={handleChange}
                    className="w-full bg-panel border border-border rounded-lg px-3 py-2 text-text focus-ring"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-muted mb-1">Gênero Musical</label>
                  <input
                    name="genero_musical"
                    value={form.genero_musical}
                    onChange={handleChange}
                    className="w-full bg-panel border border-border rounded-lg px-3 py-2 text-text focus-ring"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-muted mb-1">Cachê Mínimo (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="cache_min"
                    value={form.cache_min}
                    onChange={handleChange}
                    className="w-full bg-panel border border-border rounded-lg px-3 py-2 text-text focus-ring"
                  />
                </div>

                <div>
                  <label className="block text-sm text-muted mb-1">Descrição</label>
                  <textarea
                    name="descricao"
                    value={form.descricao}
                    onChange={handleChange}
                    rows="3"
                    className="w-full bg-panel border border-border rounded-lg px-3 py-2 text-text focus-ring resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm text-muted mb-1">Portfólio (URL)</label>
                  <input
                    type="url"
                    name="portifolio"
                    value={form.portifolio}
                    onChange={handleChange}
                    className="w-full bg-panel border border-border rounded-lg px-3 py-2 text-text focus-ring"
                    placeholder="https://..."
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="btn-secondary px-4 py-2"
                    disabled={saving}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn-primary px-4 py-2 disabled:opacity-50"
                    disabled={saving}
                  >
                    {saving ? 'Salvando…' : 'Salvar'}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function EditVenueModal({ open, venue, onClose, onSaved }) {
  const [form, setForm] = useState({
    nome: '',
    email: '',
    telefone: '',
    nome_fantasia: '',
    cnpj: '',
    capacidade: '',
    endereco: '',
    bairro: '',
    estado: '',
    cep: '',
    geo_lat: '',
    geo_lng: '',
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!venue || !open) return;

    async function fetchDetails() {
      setLoading(true);
      try {
        const details = await authFetch(`/casaDeShow/${venue.id}`, { method: 'GET' });
        console.log('Detalhes da casa de show recebidos:', details);
        
        const usuarioData = details.usuario || {};
        
        setForm({
          nome: usuarioData.nome || '',
          email: usuarioData.email || '',
          telefone: usuarioData.telefone || '',
          nome_fantasia: details.nome_fantasia || '',
          cnpj: details.cnpj || '',
          capacidade: details.capacidade || '',
          endereco: details.endereco || '',
          bairro: details.bairro || '',
          estado: details.estado || '',
          cep: details.cep || '',
          geo_lat: details.geo_lat || '',
          geo_lng: details.geo_lng || '',
        });
      } catch (err) {
        console.error('Erro ao buscar detalhes da casa de show:', err);
        setForm({
          nome: venue.nome || venue.name || '',
          email: venue.email || '',
          telefone: venue.telefone || '',
          nome_fantasia: venue.nome_fantasia || '',
          cnpj: venue.cnpj || '',
          capacidade: venue.capacidade || '',
          endereco: venue.endereco || '',
          bairro: venue.bairro || '',
          estado: venue.estado || '',
          cep: venue.cep || '',
          geo_lat: venue.geo_lat || '',
          geo_lng: venue.geo_lng || '',
        });
      } finally {
        setLoading(false);
      }
    }

    fetchDetails();
  }, [venue, open]);

  if (!open || !venue) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);

      const body = {
        nome_fantasia: form.nome_fantasia,
        cnpj: form.cnpj,
        capacidade: form.capacidade ? String(form.capacidade) : undefined,
        endereco: form.endereco,
        bairro: form.bairro,
        estado: form.estado,
        cep: form.cep,
        geo_lat: form.geo_lat,
        geo_lng: form.geo_lng,
        usuario: [
          {
            nome: form.nome,
            email: form.email,
            telefone: form.telefone,
          },
        ],
      };

      const updated = await authFetch(`/casaDeShow/${venue.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      onSaved(updated && updated.id ? updated : { ...venue, ...form });
    } catch (err) {
      alert(err?.message || 'Não foi possível salvar as alterações.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2 }}
            className="glass p-6 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold text-text mb-4">
              Editar Casa de Show
            </h2>

            {loading ? (
              <div className="py-8 text-center text-muted">
                Carregando detalhes...
              </div>
            ) : (
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-muted mb-1">Nome do Responsável</label>
                    <input
                      name="nome"
                      value={form.nome}
                      onChange={handleChange}
                      className="w-full bg-panel border border-border rounded-lg px-3 py-2 text-text focus-ring"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-muted mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      className="w-full bg-panel border border-border rounded-lg px-3 py-2 text-text focus-ring"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-muted mb-1">Telefone</label>
                    <input
                      name="telefone"
                      value={form.telefone}
                      onChange={handleChange}
                      className="w-full bg-panel border border-border rounded-lg px-3 py-2 text-text focus-ring"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-muted mb-1">Nome Fantasia</label>
                    <input
                      name="nome_fantasia"
                      value={form.nome_fantasia}
                      onChange={handleChange}
                      className="w-full bg-panel border border-border rounded-lg px-3 py-2 text-text focus-ring"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-muted mb-1">CNPJ</label>
                    <input
                      name="cnpj"
                      value={form.cnpj}
                      onChange={handleChange}
                      className="w-full bg-panel border border-border rounded-lg px-3 py-2 text-text focus-ring"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-muted mb-1">Capacidade</label>
                    <input
                      type="number"
                      name="capacidade"
                      value={form.capacidade}
                      onChange={handleChange}
                      className="w-full bg-panel border border-border rounded-lg px-3 py-2 text-text focus-ring"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-muted mb-1">Endereço</label>
                  <input
                    name="endereco"
                    value={form.endereco}
                    onChange={handleChange}
                    className="w-full bg-panel border border-border rounded-lg px-3 py-2 text-text focus-ring"
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-muted mb-1">Bairro</label>
                    <input
                      name="bairro"
                      value={form.bairro}
                      onChange={handleChange}
                      className="w-full bg-panel border border-border rounded-lg px-3 py-2 text-text focus-ring"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-muted mb-1">Estado</label>
                    <input
                      name="estado"
                      value={form.estado}
                      onChange={handleChange}
                      className="w-full bg-panel border border-border rounded-lg px-3 py-2 text-text focus-ring"
                      maxLength={2}
                      placeholder="CE"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-muted mb-1">CEP</label>
                    <input
                      name="cep"
                      value={form.cep}
                      onChange={handleChange}
                      className="w-full bg-panel border border-border rounded-lg px-3 py-2 text-text focus-ring"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-muted mb-1">Latitude</label>
                    <input
                      name="geo_lat"
                      value={form.geo_lat}
                      onChange={handleChange}
                      className="w-full bg-panel border border-border rounded-lg px-3 py-2 text-text focus-ring"
                      placeholder="-3.7319"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-muted mb-1">Longitude</label>
                    <input
                      name="geo_lng"
                      value={form.geo_lng}
                      onChange={handleChange}
                      className="w-full bg-panel border border-border rounded-lg px-3 py-2 text-text focus-ring"
                      placeholder="-38.5267"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="btn-secondary px-4 py-2"
                    disabled={saving}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn-primary px-4 py-2 disabled:opacity-50"
                    disabled={saving}
                  >
                    {saving ? 'Salvando…' : 'Salvar'}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function EditClientModal({ open, client, onClose, onSaved }) {
  const [form, setForm] = useState({
    nome: '',
    email: '',
    telefone: '',
    apelido: '',
    preferencias: '',
    data_nascimento: '',
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!client || !open) return;

    async function fetchDetails() {
      setLoading(true);
      try {
        const details = await authFetch(`/cliente/${client.id}`, { method: 'GET' });
        console.log('Detalhes do cliente recebidos:', details);
        
        const usuarioData = details.usuario || {};
        
        setForm({
          nome: usuarioData.nome || '',
          email: usuarioData.email || '',
          telefone: usuarioData.telefone || '',
          apelido: details.apelido || '',
          preferencias: details.preferencias || '',
          data_nascimento: details.data_nascimento || '',
        });
      } catch (err) {
        console.error('Erro ao buscar detalhes do cliente:', err);
        setForm({
          nome: client.nome || client.name || '',
          email: client.email || '',
          telefone: client.telefone || '',
          apelido: client.apelido || '',
          preferencias: client.preferencias || '',
          data_nascimento: client.data_nascimento || '',
        });
      } finally {
        setLoading(false);
      }
    }

    fetchDetails();
  }, [client, open]);

  if (!open || !client) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);

      const body = {
        apelido: form.apelido || undefined,
        preferencias: form.preferencias || undefined,
        data_nascimento: form.data_nascimento || undefined,
        usuario: [
          {
            nome: form.nome,
            email: form.email,
            telefone: form.telefone,
          },
        ],
      };

      const updated = await authFetch(`/cliente/${client.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      onSaved(updated && updated.id ? updated : { ...client, ...form });
    } catch (err) {
      alert(err?.message || 'Não foi possível salvar as alterações.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2 }}
            className="glass p-6 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold text-text mb-4">
              Editar Cliente
            </h2>

            {loading ? (
              <div className="py-8 text-center text-muted">
                Carregando detalhes...
              </div>
            ) : (
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm text-muted mb-1">Nome</label>
                  <input
                    name="nome"
                    value={form.nome}
                    onChange={handleChange}
                    className="w-full bg-panel border border-border rounded-lg px-3 py-2 text-text focus-ring"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-muted mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full bg-panel border border-border rounded-lg px-3 py-2 text-text focus-ring"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-muted mb-1">Telefone</label>
                  <input
                    name="telefone"
                    value={form.telefone}
                    onChange={handleChange}
                    className="w-full bg-panel border border-border rounded-lg px-3 py-2 text-text focus-ring"
                  />
                </div>

                <div>
                  <label className="block text-sm text-muted mb-1">Apelido</label>
                  <input
                    name="apelido"
                    value={form.apelido}
                    onChange={handleChange}
                    className="w-full bg-panel border border-border rounded-lg px-3 py-2 text-text focus-ring"
                  />
                </div>

                <div>
                  <label className="block text-sm text-muted mb-1">Preferências</label>
                  <textarea
                    name="preferencias"
                    value={form.preferencias}
                    onChange={handleChange}
                    rows="3"
                    className="w-full bg-panel border border-border rounded-lg px-3 py-2 text-text focus-ring resize-none"
                    placeholder="Rock, Sertanejo, Forró..."
                  />
                </div>

                <div>
                  <label className="block text-sm text-muted mb-1">Data de Nascimento</label>
                  <input
                    type="date"
                    name="data_nascimento"
                    value={form.data_nascimento}
                    onChange={handleChange}
                    className="w-full bg-panel border border-border rounded-lg px-3 py-2 text-text focus-ring"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="btn-secondary px-4 py-2"
                    disabled={saving}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn-primary px-4 py-2 disabled:opacity-50"
                    disabled={saving}
                  >
                    {saving ? 'Salvando…' : 'Salvar'}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Tabelas() {
  const [employees, setEmployees] = useState([]);
  const [artists, setArtists] = useState([]);
  const [venues, setVenues] = useState([]);
  const [clients, setClients] = useState([]);

  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [loadingArtists, setLoadingArtists] = useState(true);
  const [loadingVenues, setLoadingVenues] = useState(true);
  const [loadingClients, setLoadingClients] = useState(true);

  const [errEmployees, setErrEmployees] = useState('');
  const [errArtists, setErrArtists] = useState('');
  const [errVenues, setErrVenues] = useState('');
  const [errClients, setErrClients] = useState('');

  const [empSearch, setEmpSearch] = useState('');
  const [artSearch, setArtSearch] = useState('');
  const [venueSearch, setVenueSearch] = useState('');
  const [clientSearch, setClientSearch] = useState('');

  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [menuOpen, setMenuOpen] = useState(null);

  const [deleteModal, setDeleteModal] = useState({ open: false, item: null, type: null });

  const [viewEmployeeModal, setViewEmployeeModal] = useState({ open: false, id: null });
  const [viewArtistModal, setViewArtistModal] = useState({ open: false, id: null });
  const [viewVenueModal, setViewVenueModal] = useState({ open: false, id: null });
  const [viewClientModal, setViewClientModal] = useState({ open: false, id: null });

  const [filterMenuOpen, setFilterMenuOpen] = useState(null);
  const [empColumns, setEmpColumns] = useState({
    funcionario: true,
    email: true,
    cargo: true,
    permissao: true,
  });
  const [artColumns, setArtColumns] = useState({
    nomeReal: true,
    nomeArtistico: true,
    email: true,
    genero: true,
  });
  const [venueColumns, setVenueColumns] = useState({
    nomeFantasia: true,
    responsavel: true,
    endereco: true,
    bairro: true,
    cnpj: true,
  });
  const [clientColumns, setClientColumns] = useState({
    cliente: true,
    email: true,
    telefone: true,
    dataNascimento: true,
  });

  async function loadEmployees() {
    setLoadingEmployees(true);
    setErrEmployees('');
    try {
      const list = await authFetch('/adm/', { method: 'GET' });
      const arr = Array.isArray(list) ? list : [];
      setEmployees(arr);
    } catch (e) {
      setErrEmployees(e?.message || 'Falha ao carregar funcionários.');
    } finally {
      setLoadingEmployees(false);
    }
  }

  async function loadArtists() {
    setLoadingArtists(true);
    setErrArtists('');
    try {
      const list = await authFetch('/artista/', { method: 'GET' });
      const arr = Array.isArray(list) ? list : [];
      setArtists(arr);
    } catch (e) {
      setErrArtists(e?.message || 'Falha ao carregar artistas.');
    } finally {
      setLoadingArtists(false);
    }
  }

  async function loadVenues() {
    setLoadingVenues(true);
    setErrVenues('');
    try {
      const list = await authFetch('/casaDeShow/', { method: 'GET' });
      const arr = Array.isArray(list) ? list : [];
      setVenues(arr);
    } catch (e) {
      setErrVenues(e?.message || 'Falha ao carregar casas de show.');
    } finally {
      setLoadingVenues(false);
    }
  }

  async function loadClients() {
    setLoadingClients(true);
    setErrClients('');
    try {
      const list = await authFetch('/cliente/', { method: 'GET' });
      const arr = Array.isArray(list) ? list : [];
      setClients(arr);
    } catch (e) {
      setErrClients(e?.message || 'Falha ao carregar clientes.');
    } finally {
      setLoadingClients(false);
    }
  }

  useEffect(() => {
    loadEmployees();
    loadArtists();
    loadVenues();
    loadClients();
  }, []);

  const emp = usePaginatedData({
    mode: 'local',
    localData: employees,
    pageSize: 5,
    search: empSearch,
  });

  const art = usePaginatedData({
    mode: 'local',
    localData: artists,
    pageSize: 5,
    search: artSearch,
  });

  const ven = usePaginatedData({
    mode: 'local',
    localData: venues,
    pageSize: 5,
    search: venueSearch,
  });

  const cli = usePaginatedData({
    mode: 'local',
    localData: clients,
    pageSize: 5,
    search: clientSearch,
  });

  const openEdit = (user) => {
    setSelectedUser(user);
    setMenuOpen(null);
  };

  const openEditArtist = (artist) => {
    setSelectedArtist(artist);
    setMenuOpen(null);
  };

  const openEditVenue = (venue) => {
    setSelectedVenue(venue);
    setMenuOpen(null);
  };

  const openEditClient = (client) => {
    setSelectedClient(client);
    setMenuOpen(null);
  };

  const handleSaved = (updated) => {
    setEmployees((prev) => prev.map((u) => (u.id === updated.id ? { ...u, ...updated } : u)));
    setSelectedUser(null);
  };

  const handleSavedArtist = (updated) => {
    setArtists((prev) => prev.map((u) => (u.id === updated.id ? { ...u, ...updated } : u)));
    setSelectedArtist(null);
  };

  const handleSavedVenue = (updated) => {
    setVenues((prev) => prev.map((u) => (u.id === updated.id ? { ...u, ...updated } : u)));
    setSelectedVenue(null);
  };

  const handleSavedClient = (updated) => {
    setClients((prev) => prev.map((u) => (u.id === updated.id ? { ...u, ...updated } : u)));
    setSelectedClient(null);
  };

  const toggleMenu = (userId) => {
    setMenuOpen((curr) => (curr && curr.id === userId ? null : { id: userId }));
  };

  const handleDeleteEmployee = (employee) => {
    setDeleteModal({ open: true, item: employee, type: 'employee' });
    setMenuOpen(null);
  };

  const handleDeleteArtist = (artist) => {
    setDeleteModal({ open: true, item: artist, type: 'artist' });
    setMenuOpen(null);
  };

  const handleDeleteVenue = (venue) => {
    setDeleteModal({ open: true, item: venue, type: 'venue' });
    setMenuOpen(null);
  };

  const handleDeleteClient = (client) => {
    setDeleteModal({ open: true, item: client, type: 'client' });
    setMenuOpen(null);
  };

  const confirmDelete = async () => {
    const { item, type } = deleteModal;
    if (!item || !type) return;

    console.log('Deletando item:', { item, type, id: item.id, id_usuario: item.id_usuario });

    try {
      const itemId = item.id_usuario || item.id;
      
      switch (type) {
        case 'employee':
          await authFetch(`/adm/${itemId}`, { method: 'DELETE' });
          setEmployees((prev) => prev.filter((u) => (u.id_usuario || u.id) !== itemId));
          break;
        case 'artist':
          await authFetch(`/artista/${itemId}`, { method: 'DELETE' });
          setArtists((prev) => prev.filter((u) => (u.id_usuario || u.id) !== itemId));
          break;
        case 'venue':
          await authFetch(`/casaDeShow/${itemId}`, { method: 'DELETE' });
          setVenues((prev) => prev.filter((u) => (u.id_usuario || u.id) !== itemId));
          break;
        case 'client':
          await authFetch(`/cliente/${itemId}`, { method: 'DELETE' });
          setClients((prev) => prev.filter((u) => (u.id_usuario || u.id) !== itemId));
          break;
      }
      setDeleteModal({ open: false, item: null, type: null });
    } catch (e) {
      console.error('Erro ao deletar:', e);
      alert(e?.message || 'Não foi possível excluir o item.');
      setDeleteModal({ open: false, item: null, type: null });
    }
  };

  const formatDate = (d) => {
    if (!d) return '-';
    try {
      return new Date(d).toLocaleDateString();
    } catch {
      return String(d);
    }
  };

  return (
    <div className="space-y-8">
      <DeleteConfirmModal
        open={deleteModal.open}
        item={deleteModal.item}
        itemType={deleteModal.type}
        onClose={() => setDeleteModal({ open: false, item: null, type: null })}
        onConfirm={confirmDelete}
      />

      <ViewEmployeeDetailsModal
        open={viewEmployeeModal.open}
        employeeId={viewEmployeeModal.id}
        onClose={() => setViewEmployeeModal({ open: false, id: null })}
      />

      <ViewArtistDetailsModal
        open={viewArtistModal.open}
        artistId={viewArtistModal.id}
        onClose={() => setViewArtistModal({ open: false, id: null })}
      />

      <ViewVenueDetailsModal
        open={viewVenueModal.open}
        venueId={viewVenueModal.id}
        onClose={() => setViewVenueModal({ open: false, id: null })}
      />

      <ViewClientDetailsModal
        open={viewClientModal.open}
        clientId={viewClientModal.id}
        onClose={() => setViewClientModal({ open: false, id: null })}
      />

      <EditUserModal
        open={!!selectedUser}
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
        onSaved={handleSaved}
      />

      <EditArtistModal
        open={!!selectedArtist}
        artist={selectedArtist}
        onClose={() => setSelectedArtist(null)}
        onSaved={handleSavedArtist}
      />

      <EditVenueModal
        open={!!selectedVenue}
        venue={selectedVenue}
        onClose={() => setSelectedVenue(null)}
        onSaved={handleSavedVenue}
      />

      <EditClientModal
        open={!!selectedClient}
        client={selectedClient}
        onClose={() => setSelectedClient(null)}
        onSaved={handleSavedClient}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <AdminSolicitacoes />
      </motion.div>

      {(errEmployees || errArtists || errVenues || errClients) && (
        <div className="glass p-4 border border-red-500/40 text-red-300 text-sm rounded-xl">
          {errEmployees && <div>{errEmployees}</div>}
          {errArtists && <div>{errArtists}</div>}
          {errVenues && <div>{errVenues}</div>}
          {errClients && <div>{errClients}</div>}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass"
      >
        <div className="p-6 border-b border-border">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <h2 className="text-xl font-semibold text-text">Funcionários</h2>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search size={18} className="absolute left-3 top-3 text-muted" />
                <input
                  type="text"
                  placeholder="Buscar funcionários..."
                  className="pl-10 pr-4 py-2 bg-panel border border-border rounded-lg text-text placeholder-muted focus-ring w-64"
                  value={empSearch}
                  onChange={(e) => {
                    emp.setPage(1);
                    setEmpSearch(e.target.value);
                  }}
                />
              </div>
              <div className="relative">
                <button 
                  className="flex items-center space-x-2 btn-secondary"
                  onClick={() => setFilterMenuOpen(filterMenuOpen === 'emp' ? null : 'emp')}
                >
                  <Filter size={16} />
                  <span>Filtros</span>
                </button>
                {filterMenuOpen === 'emp' && (
                  <div className="absolute right-0 mt-2 w-56 glass border border-border rounded-xl shadow-lg z-30 p-3">
                    <p className="text-sm text-muted mb-2 font-medium">Exibir Colunas:</p>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2 cursor-pointer hover:bg-panel/50 p-2 rounded-lg">
                        <input 
                          type="checkbox" 
                          checked={empColumns.funcionario}
                          onChange={(e) => setEmpColumns(prev => ({ ...prev, funcionario: e.target.checked }))}
                          className="w-4 h-4 rounded border-border bg-panel"
                        />
                        <span className="text-sm text-text">Funcionário</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer hover:bg-panel/50 p-2 rounded-lg">
                        <input 
                          type="checkbox" 
                          checked={empColumns.email}
                          onChange={(e) => setEmpColumns(prev => ({ ...prev, email: e.target.checked }))}
                          className="w-4 h-4 rounded border-border bg-panel"
                        />
                        <span className="text-sm text-text">Email</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer hover:bg-panel/50 p-2 rounded-lg">
                        <input 
                          type="checkbox" 
                          checked={empColumns.cargo}
                          onChange={(e) => setEmpColumns(prev => ({ ...prev, cargo: e.target.checked }))}
                          className="w-4 h-4 rounded border-border bg-panel"
                        />
                        <span className="text-sm text-text">Cargo</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer hover:bg-panel/50 p-2 rounded-lg">
                        <input 
                          type="checkbox" 
                          checked={empColumns.permissao}
                          onChange={(e) => setEmpColumns(prev => ({ ...prev, permissao: e.target.checked }))}
                          className="w-4 h-4 rounded border-border bg-panel"
                        />
                        <span className="text-sm text-text">Permissão</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-panel hover:scrollbar-thumb-primary/50">
          {loadingEmployees ? (
            <p className="p-6 text-muted">Carregando funcionários…</p>
          ) : emp.items.length === 0 ? (
            <p className="p-6 text-muted">Nenhum funcionário encontrado.</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {empColumns.funcionario && <th className="text-left py-4 px-6 text-muted font-medium">Funcionário</th>}
                  {empColumns.email && <th className="text-left py-4 px-6 text-muted font-medium">Email</th>}
                  {empColumns.cargo && <th className="text-left py-4 px-6 text-muted font-medium">Cargo</th>}
                  {empColumns.permissao && <th className="text-left py-4 px-6 text-muted font-medium">Permissão</th>}
                  <th className="text-left py-4 px-6 text-muted font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {emp.items.map((employee, index) => {
                  return (
                    <motion.tr
                      key={employee.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      className="border-b border-border hover:bg-panel/30 transition-colors"
                    >
                      {empColumns.funcionario && (
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-3">
                            {(() => {
                              const userId = employee.id_usuario || employee.id;
                              const savedAvatar = localStorage.getItem(`avatar_${userId}`);
                              return savedAvatar ? (
                                <img
                                  src={savedAvatar}
                                  alt={employee.nome || employee.name}
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-panel flex items-center justify-center text-sm text-muted">
                                  {String(employee.nome || employee.name || '?')
                                    .charAt(0)
                                    .toUpperCase()}
                                </div>
                              );
                            })()}
                            <button
                              onClick={() => setViewEmployeeModal({ open: true, id: employee.id_usuario || employee.id })}
                              className="font-medium text-primary hover:text-primary-light transition-colors cursor-pointer text-left"
                            >
                              {employee.nome || employee.name || '-'}
                            </button>
                          </div>
                        </td>
                      )}
                      {empColumns.email && <td className="py-4 px-6 text-muted">{employee.email || '-'}</td>}
                      {empColumns.cargo && <td className="py-4 px-6 text-text">{employee.cargo || '-'}</td>}
                      {empColumns.permissao && (
                        <td className="py-4 px-6">
                          <span
                            className={
                              employee.permissao_nivel === 'SUPER_ADMIN'
                                ? 'chip-success'
                                : employee.permissao_nivel === 'ADMIN'
                                ? 'chip-warning'
                                : 'chip-offline'
                            }
                          >
                            {employee.permissao_nivel || '-'}
                          </span>
                        </td>
                      )}
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <button
                            className="p-2 hover:bg-panel rounded-lg transition-colors focus-ring"
                            onClick={() => openEdit(employee)}
                          >
                            <Edit size={16} className="text-muted hover:text-text" />
                          </button>
                          <div className="relative">
                            <button
                              className="p-2 hover:bg-panel rounded-lg transition-colors focus-ring"
                              onClick={() => toggleMenu(employee.id)}
                            >
                              <MoreVertical size={16} className="text-muted hover:text-text" />
                            </button>
                            {menuOpen && menuOpen.id === employee.id && (
                              <div className="absolute right-0 mt-2 w-32 glass border border-border rounded-xl shadow-lg z-30">
                                <button
                                  className="w-full text-left text-sm px-3 py-2 hover:bg-panel/70 text-danger"
                                  onClick={() => handleDeleteEmployee(employee)}
                                >
                                  Excluir
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        <div className="p-4">
          <Pagination
            page={emp.page}
            pageSize={emp.pageSize}
            total={emp.total}
            onPageChange={emp.setPage}
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="glass"
      >
        <div className="p-6 border-b border-border">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <h2 className="text-xl font-semibold text-text">Artistas</h2>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search size={18} className="absolute left-3 top-3 text-muted" />
                <input
                  type="text"
                  placeholder="Buscar artistas..."
                  className="pl-10 pr-4 py-2 bg-panel border border-border rounded-lg text-text placeholder-muted focus-ring w-64"
                  value={artSearch}
                  onChange={(e) => {
                    art.setPage(1);
                    setArtSearch(e.target.value);
                  }}
                />
              </div>
              <div className="relative">
                <button 
                  className="flex items-center space-x-2 btn-secondary"
                  onClick={() => setFilterMenuOpen(filterMenuOpen === 'art' ? null : 'art')}
                >
                  <Filter size={16} />
                  <span>Filtros</span>
                </button>
                {filterMenuOpen === 'art' && (
                  <div className="absolute right-0 mt-2 w-56 glass border border-border rounded-xl shadow-lg z-30 p-3">
                    <p className="text-sm text-muted mb-2 font-medium">Exibir Colunas:</p>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2 cursor-pointer hover:bg-panel/50 p-2 rounded-lg">
                        <input 
                          type="checkbox" 
                          checked={artColumns.nomeReal}
                          onChange={(e) => setArtColumns(prev => ({ ...prev, nomeReal: e.target.checked }))}
                          className="w-4 h-4 rounded border-border bg-panel"
                        />
                        <span className="text-sm text-text">Nome Real</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer hover:bg-panel/50 p-2 rounded-lg">
                        <input 
                          type="checkbox" 
                          checked={artColumns.nomeArtistico}
                          onChange={(e) => setArtColumns(prev => ({ ...prev, nomeArtistico: e.target.checked }))}
                          className="w-4 h-4 rounded border-border bg-panel"
                        />
                        <span className="text-sm text-text">Nome Artístico</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer hover:bg-panel/50 p-2 rounded-lg">
                        <input 
                          type="checkbox" 
                          checked={artColumns.email}
                          onChange={(e) => setArtColumns(prev => ({ ...prev, email: e.target.checked }))}
                          className="w-4 h-4 rounded border-border bg-panel"
                        />
                        <span className="text-sm text-text">Email</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer hover:bg-panel/50 p-2 rounded-lg">
                        <input 
                          type="checkbox" 
                          checked={artColumns.genero}
                          onChange={(e) => setArtColumns(prev => ({ ...prev, genero: e.target.checked }))}
                          className="w-4 h-4 rounded border-border bg-panel"
                        />
                        <span className="text-sm text-text">Gênero Musical</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-panel hover:scrollbar-thumb-primary/50">
          {loadingArtists ? (
            <p className="p-6 text-muted">Carregando artistas…</p>
          ) : art.items.length === 0 ? (
            <p className="p-6 text-muted">Nenhum artista encontrado.</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {artColumns.nomeReal && <th className="text-left py-4 px-6 text-muted font-medium">Nome Real</th>}
                  {artColumns.nomeArtistico && <th className="text-left py-4 px-6 text-muted font-medium">Nome Artístico</th>}
                  {artColumns.email && <th className="text-left py-4 px-6 text-muted font-medium">Email</th>}
                  {artColumns.genero && <th className="text-left py-4 px-6 text-muted font-medium">Gênero Musical</th>}
                  <th className="text-left py-4 px-6 text-muted font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {art.items.map((artist, index) => {
                  return (
                    <motion.tr
                      key={artist.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      className="border-b border-border hover:bg-panel/30 transition-colors"
                    >
                      {artColumns.nomeReal && (
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-3">
                            {(() => {
                              const userId = artist.id_usuario || artist.id;
                              const savedAvatar = localStorage.getItem(`avatar_${userId}`);
                              return savedAvatar ? (
                                <img
                                  src={savedAvatar}
                                  alt={artist.nome || artist.name}
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-panel flex items-center justify-center text-sm text-muted">
                                  {String(artist.nome || artist.name || '?')
                                    .charAt(0)
                                    .toUpperCase()}
                                </div>
                              );
                            })()}
                            <button
                              onClick={() => setViewArtistModal({ open: true, id: artist.id_usuario || artist.id })}
                              className="font-medium text-primary hover:text-primary-light transition-colors cursor-pointer text-left"
                            >
                              {artist.nome || artist.name || '-'}
                            </button>
                          </div>
                        </td>
                      )}
                      {artColumns.nomeArtistico && (
                        <td className="py-4 px-6 text-text font-semibold">
                          {artist.nome_artista || '-'}
                        </td>
                      )}
                      {artColumns.email && <td className="py-4 px-6 text-muted">{artist.email || '-'}</td>}
                      {artColumns.genero && (
                        <td className="py-4 px-6">
                          <span className="chip-success bg-primary/15 text-primary">
                            {artist.genero_musical || '-'}
                          </span>
                        </td>
                      )}
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <button
                            className="p-2 hover:bg-panel rounded-lg transition-colors focus-ring"
                            onClick={() => openEditArtist(artist)}
                          >
                            <Edit size={16} className="text-muted hover:text-text" />
                          </button>
                          <div className="relative">
                            <button
                              className="p-2 hover:bg-panel rounded-lg transition-colors focus-ring"
                              onClick={() => toggleMenu(artist.id)}
                            >
                              <MoreVertical size={16} className="text-muted hover:text-text" />
                            </button>
                            {menuOpen && menuOpen.id === artist.id && (
                              <div className="absolute right-0 mt-2 w-32 glass border border-border rounded-xl shadow-lg z-30">
                                <button
                                  className="w-full text-left text-sm px-3 py-2 hover:bg-panel/70 text-danger"
                                  onClick={() => handleDeleteArtist(artist)}
                                >
                                  Excluir
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        <div className="p-4">
          <Pagination
            page={art.page}
            pageSize={art.pageSize}
            total={art.total}
            onPageChange={art.setPage}
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="glass"
      >
        <div className="p-6 border-b border-border">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <h2 className="text-xl font-semibold text-text">Casas de Show</h2>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search size={18} className="absolute left-3 top-3 text-muted" />
                <input
                  type="text"
                  placeholder="Buscar casas de show..."
                  className="pl-10 pr-4 py-2 bg-panel border border-border rounded-lg text-text placeholder-muted focus-ring w-64"
                  value={venueSearch}
                  onChange={(e) => {
                    ven.setPage(1);
                    setVenueSearch(e.target.value);
                  }}
                />
              </div>
              <div className="relative">
                <button 
                  className="flex items-center space-x-2 btn-secondary"
                  onClick={() => setFilterMenuOpen(filterMenuOpen === 'venue' ? null : 'venue')}
                >
                  <Filter size={16} />
                  <span>Filtros</span>
                </button>
                {filterMenuOpen === 'venue' && (
                  <div className="absolute right-0 mt-2 w-56 glass border border-border rounded-xl shadow-lg z-30 p-3">
                    <p className="text-sm text-muted mb-2 font-medium">Exibir Colunas:</p>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2 cursor-pointer hover:bg-panel/50 p-2 rounded-lg">
                        <input 
                          type="checkbox" 
                          checked={venueColumns.nomeFantasia}
                          onChange={(e) => setVenueColumns(prev => ({ ...prev, nomeFantasia: e.target.checked }))}
                          className="w-4 h-4 rounded border-border bg-panel"
                        />
                        <span className="text-sm text-text">Nome Fantasia</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer hover:bg-panel/50 p-2 rounded-lg">
                        <input 
                          type="checkbox" 
                          checked={venueColumns.responsavel}
                          onChange={(e) => setVenueColumns(prev => ({ ...prev, responsavel: e.target.checked }))}
                          className="w-4 h-4 rounded border-border bg-panel"
                        />
                        <span className="text-sm text-text">Responsável</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer hover:bg-panel/50 p-2 rounded-lg">
                        <input 
                          type="checkbox" 
                          checked={venueColumns.endereco}
                          onChange={(e) => setVenueColumns(prev => ({ ...prev, endereco: e.target.checked }))}
                          className="w-4 h-4 rounded border-border bg-panel"
                        />
                        <span className="text-sm text-text">Endereço</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer hover:bg-panel/50 p-2 rounded-lg">
                        <input 
                          type="checkbox" 
                          checked={venueColumns.bairro}
                          onChange={(e) => setVenueColumns(prev => ({ ...prev, bairro: e.target.checked }))}
                          className="w-4 h-4 rounded border-border bg-panel"
                        />
                        <span className="text-sm text-text">Bairro</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer hover:bg-panel/50 p-2 rounded-lg">
                        <input 
                          type="checkbox" 
                          checked={venueColumns.cnpj}
                          onChange={(e) => setVenueColumns(prev => ({ ...prev, cnpj: e.target.checked }))}
                          className="w-4 h-4 rounded border-border bg-panel"
                        />
                        <span className="text-sm text-text">CNPJ</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-panel hover:scrollbar-thumb-primary/50">
          {loadingVenues ? (
            <p className="p-6 text-muted">Carregando casas de show…</p>
          ) : ven.items.length === 0 ? (
            <p className="p-6 text-muted">Nenhuma casa de show encontrada.</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {venueColumns.nomeFantasia && <th className="text-left py-4 px-6 text-muted font-medium">Nome Fantasia</th>}
                  {venueColumns.responsavel && <th className="text-left py-4 px-6 text-muted font-medium">Responsável</th>}
                  {venueColumns.endereco && <th className="text-left py-4 px-6 text-muted font-medium">Endereço</th>}
                  {venueColumns.bairro && <th className="text-left py-4 px-6 text-muted font-medium">Bairro</th>}
                  {venueColumns.cnpj && <th className="text-left py-4 px-6 text-muted font-medium">CNPJ</th>}
                  <th className="text-left py-4 px-6 text-muted font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {ven.items.map((venue, index) => {
                  return (
                    <motion.tr
                      key={venue.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      className="border-b border-border hover:bg-panel/30 transition-colors"
                    >
                      {venueColumns.nomeFantasia && (
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-3">
                            {(() => {
                              const userId = venue.id_usuario || venue.id;
                              const savedAvatar = localStorage.getItem(`avatar_${userId}`);
                              return savedAvatar ? (
                                <img
                                  src={savedAvatar}
                                  alt={venue.nome_fantasia}
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-panel flex items-center justify-center text-sm text-muted">
                                  {String(venue.nome_fantasia || '?')
                                    .charAt(0)
                                    .toUpperCase()}
                                </div>
                              );
                            })()}
                            <button
                              onClick={() => setViewVenueModal({ open: true, id: venue.id_usuario || venue.id })}
                              className="font-medium text-primary hover:text-primary-light transition-colors cursor-pointer text-left"
                            >
                              {venue.nome_fantasia || '-'}
                            </button>
                          </div>
                        </td>
                      )}
                      {venueColumns.responsavel && <td className="py-4 px-6 text-muted">{venue.nome || '-'}</td>}
                      {venueColumns.endereco && <td className="py-4 px-6 text-muted">{venue.endereco || '-'}</td>}
                      {venueColumns.bairro && <td className="py-4 px-6 text-text">{venue.bairro || '-'}</td>}
                      {venueColumns.cnpj && <td className="py-4 px-6 text-muted font-mono text-sm">{venue.cnpj || '-'}</td>}
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <button
                            className="p-2 hover:bg-panel rounded-lg transition-colors focus-ring"
                            onClick={() => openEditVenue(venue)}
                          >
                            <Edit size={16} className="text-muted hover:text-text" />
                          </button>
                          <div className="relative">
                            <button
                              className="p-2 hover:bg-panel rounded-lg transition-colors focus-ring"
                              onClick={() => toggleMenu(venue.id)}
                            >
                              <MoreVertical size={16} className="text-muted hover:text-text" />
                            </button>
                            {menuOpen && menuOpen.id === venue.id && (
                              <div className="absolute right-0 mt-2 w-32 glass border border-border rounded-xl shadow-lg z-30">
                                <button
                                  className="w-full text-left text-sm px-3 py-2 hover:bg-panel/70 text-danger"
                                  onClick={() => handleDeleteVenue(venue)}
                                >
                                  Excluir
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        <div className="p-4">
          <Pagination
            page={ven.page}
            pageSize={ven.pageSize}
            total={ven.total}
            onPageChange={ven.setPage}
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="glass"
      >
        <div className="p-6 border-b border-border">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <h2 className="text-xl font-semibold text-text">Clientes</h2>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search size={18} className="absolute left-3 top-3 text-muted" />
                <input
                  type="text"
                  placeholder="Buscar clientes..."
                  className="pl-10 pr-4 py-2 bg-panel border border-border rounded-lg text-text placeholder-muted focus-ring w-64"
                  value={clientSearch}
                  onChange={(e) => {
                    cli.setPage(1);
                    setClientSearch(e.target.value);
                  }}
                />
              </div>
              <div className="relative">
                <button 
                  className="flex items-center space-x-2 btn-secondary"
                  onClick={() => setFilterMenuOpen(filterMenuOpen === 'client' ? null : 'client')}
                >
                  <Filter size={16} />
                  <span>Filtros</span>
                </button>
                {filterMenuOpen === 'client' && (
                  <div className="absolute right-0 mt-2 w-56 glass border border-border rounded-xl shadow-lg z-30 p-3">
                    <p className="text-sm text-muted mb-2 font-medium">Exibir Colunas:</p>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2 cursor-pointer hover:bg-panel/50 p-2 rounded-lg">
                        <input 
                          type="checkbox" 
                          checked={clientColumns.cliente}
                          onChange={(e) => setClientColumns(prev => ({ ...prev, cliente: e.target.checked }))}
                          className="w-4 h-4 rounded border-border bg-panel"
                        />
                        <span className="text-sm text-text">Cliente</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer hover:bg-panel/50 p-2 rounded-lg">
                        <input 
                          type="checkbox" 
                          checked={clientColumns.email}
                          onChange={(e) => setClientColumns(prev => ({ ...prev, email: e.target.checked }))}
                          className="w-4 h-4 rounded border-border bg-panel"
                        />
                        <span className="text-sm text-text">Email</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer hover:bg-panel/50 p-2 rounded-lg">
                        <input 
                          type="checkbox" 
                          checked={clientColumns.telefone}
                          onChange={(e) => setClientColumns(prev => ({ ...prev, telefone: e.target.checked }))}
                          className="w-4 h-4 rounded border-border bg-panel"
                        />
                        <span className="text-sm text-text">Telefone</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer hover:bg-panel/50 p-2 rounded-lg">
                        <input 
                          type="checkbox" 
                          checked={clientColumns.dataNascimento}
                          onChange={(e) => setClientColumns(prev => ({ ...prev, dataNascimento: e.target.checked }))}
                          className="w-4 h-4 rounded border-border bg-panel"
                        />
                        <span className="text-sm text-text">Data de Nascimento</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-panel hover:scrollbar-thumb-primary/50">
          {loadingClients ? (
            <p className="p-6 text-muted">Carregando clientes…</p>
          ) : cli.items.length === 0 ? (
            <p className="p-6 text-muted">Nenhum cliente encontrado.</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {clientColumns.cliente && <th className="text-left py-4 px-6 text-muted font-medium">Cliente</th>}
                  {clientColumns.email && <th className="text-left py-4 px-6 text-muted font-medium">Email</th>}
                  {clientColumns.telefone && <th className="text-left py-4 px-6 text-muted font-medium">Telefone</th>}
                  {clientColumns.dataNascimento && <th className="text-left py-4 px-6 text-muted font-medium">Data de Nascimento</th>}
                  <th className="text-left py-4 px-6 text-muted font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {cli.items.map((client, index) => {
                  return (
                    <motion.tr
                      key={client.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      className="border-b border-border hover:bg-panel/30 transition-colors"
                    >
                      {clientColumns.cliente && (
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-3">
                            {(() => {
                              const userId = client.id_usuario || client.id;
                              const savedAvatar = localStorage.getItem(`avatar_${userId}`);
                              return savedAvatar ? (
                                <img
                                  src={savedAvatar}
                                  alt={client.nome || client.name}
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-panel flex items-center justify-center text-sm text-muted">
                                  {String(client.nome || client.name || '?')
                                    .charAt(0)
                                    .toUpperCase()}
                                </div>
                              );
                            })()}
                            <button
                              onClick={() => setViewClientModal({ open: true, id: client.id_usuario || client.id })}
                              className="font-medium text-primary hover:text-primary-light transition-colors cursor-pointer text-left"
                            >
                              {client.nome || client.name || '-'}
                            </button>
                          </div>
                        </td>
                      )}
                      {clientColumns.email && <td className="py-4 px-6 text-muted">{client.email || '-'}</td>}
                      {clientColumns.telefone && <td className="py-4 px-6 text-muted">{client.telefone || '-'}</td>}
                      {clientColumns.dataNascimento && <td className="py-4 px-6 text-muted">{formatDate(client.data_nascimento)}</td>}
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <button
                            className="p-2 hover:bg-panel rounded-lg transition-colors focus-ring"
                            onClick={() => openEditClient(client)}
                          >
                            <Edit size={16} className="text-muted hover:text-text" />
                          </button>
                          <div className="relative">
                            <button
                              className="p-2 hover:bg-panel rounded-lg transition-colors focus-ring"
                              onClick={() => toggleMenu(client.id)}
                            >
                              <MoreVertical size={16} className="text-muted hover:text-text" />
                            </button>
                            {menuOpen && menuOpen.id === client.id && (
                              <div className="absolute right-0 mt-2 w-32 glass border border-border rounded-xl shadow-lg z-30">
                                <button
                                  className="w-full text-left text-sm px-3 py-2 hover:bg-panel/70 text-danger"
                                  onClick={() => handleDeleteClient(client)}
                                >
                                  Excluir
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        <div className="p-4">
          <Pagination
            page={cli.page}
            pageSize={cli.pageSize}
            total={cli.total}
            onPageChange={cli.setPage}
          />
        </div>
      </motion.div>
    </div>
  );
}