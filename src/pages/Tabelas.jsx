import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Edit, MoreVertical } from 'lucide-react';
import usePaginatedData from '../hooks/usePaginatedData';
import Pagination from '../components/Pagination';
import AdminSolicitacoes from '../components/AdminSolicitacoes';
import { authFetch } from '../services/auth';
/* eslint-disable react/prop-types */

const normalizeTipo = (t) => String(t || '').toUpperCase();
const isArtist = (u) => normalizeTipo(u.tipo) === 'ARTISTA';

function EditUserModal({ open, user, onClose, onSaved }) {
  const [form, setForm] = useState({
    nome: '',
    email: '',
    telefone: '',
    tipo: '',
    status: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    setForm({
      nome: user.nome || user.name || '',
      email: user.email || '',
      telefone: user.telefone || '',
      tipo: normalizeTipo(user.tipo),
      status: normalizeTipo(user.status || (user.aprovado ? 'APROVADO' : 'PENDENTE')),
    });
  }, [user]);

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
        nome: form.nome,
        email: form.email,
        telefone: form.telefone,
        tipo: form.tipo,
        status: form.status,
      };

      const updated = await authFetch(`/usuarios/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      onSaved(updated && updated.id ? updated : { ...user, ...body });
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
              Editar {isArtist(user) ? 'artista' : 'funcionário'}
            </h2>

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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-muted mb-1">Tipo</label>
                  <select
                    name="tipo"
                    value={form.tipo}
                    onChange={handleChange}
                    className="w-full bg-panel border border-border rounded-lg px-3 py-2 text-text focus-ring"
                  >
                    <option value="">Selecione…</option>
                    <option value="ADM">ADM</option>
                    <option value="ARTISTA">ARTISTA</option>
                    <option value="CASASHOW">CASASHOW</option>
                    <option value="CLIENTE">CLIENTE</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-muted mb-1">Status</label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full bg-panel border border-border rounded-lg px-3 py-2 text-text focus-ring"
                  >
                    <option value="">Selecione…</option>
                    <option value="APROVADO">APROVADO</option>
                    <option value="PENDENTE">PENDENTE</option>
                    <option value="RECUSADO">RECUSADO</option>
                    <option value="INATIVO">INATIVO</option>
                  </select>
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
  const [menuOpen, setMenuOpen] = useState(null);

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

  const handleSaved = (updated) => {
    setEmployees((prev) => prev.map((u) => (u.id === updated.id ? { ...u, ...updated } : u)));
    setArtists((prev) => prev.map((u) => (u.id === updated.id ? { ...u, ...updated } : u)));
    setVenues((prev) => prev.map((u) => (u.id === updated.id ? { ...u, ...updated } : u)));
    setClients((prev) => prev.map((u) => (u.id === updated.id ? { ...u, ...updated } : u)));
    setSelectedUser(null);
  };

  const toggleMenu = (userId) => {
    setMenuOpen((curr) => (curr && curr.id === userId ? null : { id: userId }));
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`Tem certeza que deseja excluir ${user.nome || user.name || 'este usuário'}?`)) {
      return;
    }
    try {
      await authFetch(`/usuarios/${user.id}`, { method: 'DELETE' });
      setEmployees((prev) => prev.filter((u) => u.id !== user.id));
      setArtists((prev) => prev.filter((u) => u.id !== user.id));
      setVenues((prev) => prev.filter((u) => u.id !== user.id));
      setClients((prev) => prev.filter((u) => u.id !== user.id));
      setMenuOpen(null);
    } catch (e) {
      alert(e?.message || 'Não foi possível excluir o usuário.');
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
      <EditUserModal
        open={!!selectedUser}
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
        onSaved={handleSaved}
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
              <button className="flex items-center space-x-2 btn-secondary">
                <Filter size={16} />
                <span>Filtros</span>
              </button>
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
                  <th className="text-left py-4 px-6 text-muted font-medium">Funcionário</th>
                  <th className="text-left py-4 px-6 text-muted font-medium">Email</th>
                  <th className="text-left py-4 px-6 text-muted font-medium">Cargo</th>
                  <th className="text-left py-4 px-6 text-muted font-medium">Permissão</th>
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
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-panel flex items-center justify-center text-sm text-muted">
                            {String(employee.nome || employee.name || '?')
                              .charAt(0)
                              .toUpperCase()}
                          </div>
                          <span className="font-medium text-text">
                            {employee.nome || employee.name || '-'}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-muted">{employee.email || '-'}</td>
                      <td className="py-4 px-6 text-text">{employee.cargo || '-'}</td>
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
                                  onClick={() => handleDelete(employee)}
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
              <select className="bg-panel border border-border rounded-lg px-4 py-2 text-text focus-ring">
                <option>Todos os status</option>
                <option>APROVADO</option>
                <option>PENDENTE</option>
                <option>RECUSADO</option>
              </select>
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
                  <th className="text-left py-4 px-6 text-muted font-medium">Nome Real</th>
                  <th className="text-left py-4 px-6 text-muted font-medium">Nome Artístico</th>
                  <th className="text-left py-4 px-6 text-muted font-medium">Email</th>
                  <th className="text-left py-4 px-6 text-muted font-medium">Gênero Musical</th>
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
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-panel flex items-center justify-center text-sm text-muted">
                            {String(artist.nome || artist.name || '?')
                              .charAt(0)
                              .toUpperCase()}
                          </div>
                          <span className="font-medium text-text">
                            {artist.nome || artist.name || '-'}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-text font-semibold">
                        {artist.nome_artista || '-'}
                      </td>
                      <td className="py-4 px-6 text-muted">{artist.email || '-'}</td>
                      <td className="py-4 px-6">
                        <span className="chip-success bg-primary/15 text-primary">
                          {artist.genero_musical || '-'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <button
                            className="p-2 hover:bg-panel rounded-lg transition-colors focus-ring"
                            onClick={() => openEdit(artist)}
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
                                  onClick={() => handleDelete(artist)}
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
              <button className="flex items-center space-x-2 btn-secondary">
                <Filter size={16} />
                <span>Filtros</span>
              </button>
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
                  <th className="text-left py-4 px-6 text-muted font-medium">Nome Fantasia</th>
                  <th className="text-left py-4 px-6 text-muted font-medium">Responsável</th>
                  <th className="text-left py-4 px-6 text-muted font-medium">Endereço</th>
                  <th className="text-left py-4 px-6 text-muted font-medium">Bairro</th>
                  <th className="text-left py-4 px-6 text-muted font-medium">CNPJ</th>
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
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-panel flex items-center justify-center text-sm text-muted">
                            {String(venue.nome_fantasia || '?')
                              .charAt(0)
                              .toUpperCase()}
                          </div>
                          <span className="font-medium text-text">
                            {venue.nome_fantasia || '-'}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-muted">{venue.nome || '-'}</td>
                      <td className="py-4 px-6 text-muted">{venue.endereco || '-'}</td>
                      <td className="py-4 px-6 text-text">{venue.bairro || '-'}</td>
                      <td className="py-4 px-6 text-muted font-mono text-sm">{venue.cnpj || '-'}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <button
                            className="p-2 hover:bg-panel rounded-lg transition-colors focus-ring"
                            onClick={() => openEdit(venue)}
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
                                  onClick={() => handleDelete(venue)}
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
              <button className="flex items-center space-x-2 btn-secondary">
                <Filter size={16} />
                <span>Filtros</span>
              </button>
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
                  <th className="text-left py-4 px-6 text-muted font-medium">Cliente</th>
                  <th className="text-left py-4 px-6 text-muted font-medium">Email</th>
                  <th className="text-left py-4 px-6 text-muted font-medium">Telefone</th>
                  <th className="text-left py-4 px-6 text-muted font-medium">Data de Nascimento</th>
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
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-panel flex items-center justify-center text-sm text-muted">
                            {String(client.nome || client.name || '?')
                              .charAt(0)
                              .toUpperCase()}
                          </div>
                          <span className="font-medium text-text">
                            {client.nome || client.name || '-'}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-muted">{client.email || '-'}</td>
                      <td className="py-4 px-6 text-muted">{client.telefone || '-'}</td>
                      <td className="py-4 px-6 text-muted">{formatDate(client.data_nascimento)}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <button
                            className="p-2 hover:bg-panel rounded-lg transition-colors focus-ring"
                            onClick={() => openEdit(client)}
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
                                  onClick={() => handleDelete(client)}
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