import { useState } from 'react';
import { motion } from 'framer-motion';
import { Music, Building, User } from 'lucide-react';
import { authFetch } from '../services/auth';

/* eslint-disable react/prop-types */
export default function Register({ onNavigate }) {
  const [selectedRole, setSelectedRole] = useState('CLIENTE');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [artistaForm, setArtistaForm] = useState({
    nome: '',
    email: '',
    telefone: '',
    senha: '',
    nome_artista: '',
    genero_musical: '',
    cache_min: '',
    descricao: '',
    portifolio: '',
  });

  const [casaForm, setCasaForm] = useState({
    nome: '',
    email: '',
    telefone: '',
    senha: '',
    nome_fantasia: '',
    cnpj: '',
    endereco: '',
    bairro: '',
    estado: '',
    cep: '',
    capacidade: '',
    geo_lat: '',
    geo_lng: '',
  });

  const [clienteForm, setClienteForm] = useState({
    nome: '',
    email: '',
    telefone: '',
    senha: '',
    apelido: '',
    preferencias: '',
    data_nascimento: '',
  });

  const handleArtistaChange = (e) => {
    setArtistaForm({ ...artistaForm, [e.target.name]: e.target.value });
  };

  const handleCasaChange = (e) => {
    setCasaForm({ ...casaForm, [e.target.name]: e.target.value });
  };

  const handleClienteChange = (e) => {
    setClienteForm({ ...clienteForm, [e.target.name]: e.target.value });
  };

  const resetForm = (role) => {
    if (role === 'ARTISTA') {
      setArtistaForm({
        nome: '',
        email: '',
        telefone: '',
        senha: '',
        nome_artista: '',
        genero_musical: '',
        cache_min: '',
        descricao: '',
        portifolio: '',
      });
    } else if (role === 'CASASHOW') {
      setCasaForm({
        nome: '',
        email: '',
        telefone: '',
        senha: '',
        nome_fantasia: '',
        cnpj: '',
        endereco: '',
        bairro: '',
        estado: '',
        cep: '',
        capacidade: '',
        geo_lat: '',
        geo_lng: '',
      });
    } else if (role === 'CLIENTE') {
      setClienteForm({
        nome: '',
        email: '',
        telefone: '',
        senha: '',
        apelido: '',
        preferencias: '',
        data_nascimento: '',
      });
    }
  };

  const handleSubmitArtista = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const body = {
        nome: artistaForm.nome || undefined,
        email: artistaForm.email || undefined,
        telefone: artistaForm.telefone || undefined,
        senha: artistaForm.senha || undefined,
        nome_artista: artistaForm.nome_artista || undefined,
        genero_musical: artistaForm.genero_musical || undefined,
        cache_min: artistaForm.cache_min || undefined,
        descricao: artistaForm.descricao || undefined,
        portifolio: artistaForm.portifolio || undefined,
      };

      Object.keys(body).forEach(key => {
        if (body[key] === undefined || body[key] === '') {
          delete body[key];
        }
      });

      await authFetch('/artista/cadastro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      setSuccessMessage('Cadastrado com sucesso! Redirecionando para login...');
      resetForm('ARTISTA');
      setTimeout(() => onNavigate('/login'), 2000);
    } catch (err) {
      setErrorMessage(err?.message || 'Erro ao cadastrar artista');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitCasa = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const body = {
        nome: casaForm.nome,
        email: casaForm.email,
        senha: casaForm.senha,
        telefone: casaForm.telefone,
        nome_fantasia: casaForm.nome_fantasia,
        cnpj: casaForm.cnpj,
        capacidade: casaForm.capacidade,
        endereco: casaForm.endereco,
        bairro: casaForm.bairro,
        estado: casaForm.estado,
        cep: casaForm.cep,
        geo_lat: casaForm.geo_lat,
        geo_lng: casaForm.geo_lng,
      };

      await authFetch('/casaDeShow/cadastro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      setSuccessMessage('Cadastrado com sucesso! Redirecionando para login...');
      resetForm('CASASHOW');
      setTimeout(() => onNavigate('/login'), 2000);
    } catch (err) {
      setErrorMessage(err?.message || 'Erro ao cadastrar casa de show');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitCliente = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const dataISO = clienteForm.data_nascimento 
        ? new Date(clienteForm.data_nascimento + 'T00:00:00.000Z').toISOString()
        : null;

      const body = {
        nome: clienteForm.nome,
        email: clienteForm.email,
        senha: clienteForm.senha,
        telefone: clienteForm.telefone,
        apelido: clienteForm.apelido,
        preferencias: clienteForm.preferencias,
        data_nascimento: dataISO,
      };

      await authFetch('/cliente/cadastro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      setSuccessMessage('Cadastrado com sucesso! Redirecionando para login...');
      resetForm('CLIENTE');
      setTimeout(() => onNavigate('/login'), 2000);
    } catch (err) {
      setErrorMessage(err?.message || 'Erro ao cadastrar cliente');
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    { value: 'CLIENTE', label: 'Cliente', icon: User, color: 'text-green-400' },
    { value: 'ARTISTA', label: 'Artista', icon: Music, color: 'text-pink-400' },
    { value: 'CASASHOW', label: 'Casa de Show', icon: Building, color: 'text-blue-400' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl"
      >
        <div className="glass p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-text">Criar conta</h2>
            <p className="text-muted mt-2">Junte-se ao Night Out hoje</p>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-semibold text-text mb-3">Selecione o tipo de conta</h3>
            <div className="grid grid-cols-3 gap-3">
              {roleOptions.map((role) => {
                const Icon = role.icon;
                return (
                  <button
                    key={role.value}
                    onClick={() => setSelectedRole(role.value)}
                    className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                      selectedRole === role.value
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <Icon className={`${role.color} mx-auto mb-1`} size={24} />
                    <p className="text-text font-medium text-sm">{role.label}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 rounded-xl border border-green-500/40 bg-green-500/10 p-3 text-green-300 text-sm"
            >
              {successMessage}
            </motion.div>
          )}

          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-red-300 text-sm"
            >
              {errorMessage}
            </motion.div>
          )}

        {selectedRole === 'ARTISTA' && (
          <motion.div
            key="artista-form"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass p-6"
          >
            <h2 className="text-xl font-semibold text-text mb-6">Cadastrar Artista</h2>
            <form onSubmit={handleSubmitArtista} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-muted mb-1">Nome Completo</label>
                  <input
                    type="text"
                    name="nome"
                    value={artistaForm.nome}
                    onChange={handleArtistaChange}
                    className="w-full bg-panel border border-border rounded-lg px-3 py-2 text-text focus-ring"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-muted mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={artistaForm.email}
                    onChange={handleArtistaChange}
                    className="w-full bg-panel border border-border rounded-lg px-3 py-2 text-text focus-ring"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-muted mb-1">Telefone</label>
                  <input
                    type="tel"
                    name="telefone"
                    value={artistaForm.telefone}
                    onChange={handleArtistaChange}
                    className="w-full bg-panel border border-border rounded-lg px-3 py-2 text-text focus-ring"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-muted mb-1">Senha</label>
                  <input
                    type="password"
                    name="senha"
                    value={artistaForm.senha}
                    onChange={handleArtistaChange}
                    className="w-full bg-panel border border-border rounded-lg px-3 py-2 text-text focus-ring"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-muted mb-1">Nome Artístico</label>
                  <input
                    type="text"
                    name="nome_artista"
                    value={artistaForm.nome_artista}
                    onChange={handleArtistaChange}
                    className="w-full bg-panel border border-border rounded-lg px-3 py-2 text-text focus-ring"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-muted mb-1">Gênero Musical</label>
                  <input
                    type="text"
                    name="genero_musical"
                    value={artistaForm.genero_musical}
                    onChange={handleArtistaChange}
                    className="w-full bg-panel border border-border rounded-lg px-3 py-2 text-text focus-ring"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-muted mb-1">Cachê Mínimo (R$)</label>
                  <input
                    type="number"
                    name="cache_min"
                    value={artistaForm.cache_min}
                    onChange={handleArtistaChange}
                    className="w-full bg-panel border border-border rounded-lg px-3 py-2 text-text focus-ring"
                    required
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm text-muted mb-1">Portfólio (URL)</label>
                  <input
                    type="url"
                    name="portifolio"
                    value={artistaForm.portifolio}
                    onChange={handleArtistaChange}
                    className="w-full bg-panel border border-border rounded-lg px-3 py-2 text-text focus-ring"
                    placeholder="https://..."
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm text-muted mb-1">Descrição</label>
                  <textarea
                    name="descricao"
                    value={artistaForm.descricao}
                    onChange={handleArtistaChange}
                    className="w-full bg-panel border border-border rounded-lg px-3 py-2 text-text focus-ring"
                    rows="3"
                  />
                </div>
              </div>

              <div className="flex justify-center pt-4">
                <button
                  type="submit"
                  className="btn-primary px-8 py-2 disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? 'Cadastrando…' : 'Criar Conta'}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {selectedRole === 'CASASHOW' && (
          <motion.div
            key="casa-form"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass p-6"
          >
            <h2 className="text-xl font-semibold text-text mb-6">Cadastrar Casa de Show</h2>
            <form onSubmit={handleSubmitCasa} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-muted mb-1">Nome do Responsável</label>
                  <input
                    type="text"
                    name="nome"
                    value={casaForm.nome}
                    onChange={handleCasaChange}
                    className="w-full bg-panel border border-border rounded-lg px-3 py-2 text-text focus-ring"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-muted mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={casaForm.email}
                    onChange={handleCasaChange}
                    className="w-full bg-panel border border-border rounded-lg px-3 py-2 text-text focus-ring"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-muted mb-1">Telefone</label>
                  <input
                    type="tel"
                    name="telefone"
                    value={casaForm.telefone}
                    onChange={handleCasaChange}
                    placeholder="+5585999999999"
                    className="w-full bg-panel border border-border rounded-lg px-3 py-2 text-text focus-ring"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-muted mb-1">Senha</label>
                  <input
                    type="password"
                    name="senha"
                    value={casaForm.senha}
                    onChange={handleCasaChange}
                    className="w-full bg-panel border border-border rounded-lg px-3 py-2 text-text focus-ring"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-muted mb-1">Nome Fantasia</label>
                  <input
                    type="text"
                    name="nome_fantasia"
                    value={casaForm.nome_fantasia}
                    onChange={handleCasaChange}
                    className="w-full bg-panel border border-border rounded-lg px-3 py-2 text-text focus-ring"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-muted mb-1">CNPJ</label>
                  <input
                    type="text"
                    name="cnpj"
                    value={casaForm.cnpj}
                    onChange={handleCasaChange}
                    placeholder="12.345.678/0001-99"
                    className="w-full bg-panel border border-border rounded-lg px-3 py-2 text-text focus-ring"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-muted mb-1">Capacidade (pessoas)</label>
                  <input
                    type="text"
                    name="capacidade"
                    value={casaForm.capacidade}
                    onChange={handleCasaChange}
                    placeholder="5000"
                    className="w-full bg-panel border border-border rounded-lg px-3 py-2 text-text focus-ring"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-muted mb-1">Endereço</label>
                  <input
                    type="text"
                    name="endereco"
                    value={casaForm.endereco}
                    onChange={handleCasaChange}
                    placeholder="Av. Beira Mar, 1200"
                    className="w-full bg-panel border border-border rounded-lg px-3 py-2 text-text focus-ring"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-muted mb-1">Bairro</label>
                  <input
                    type="text"
                    name="bairro"
                    value={casaForm.bairro}
                    onChange={handleCasaChange}
                    placeholder="Meireles"
                    className="w-full bg-panel border border-border rounded-lg px-3 py-2 text-text focus-ring"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-muted mb-1">Estado</label>
                  <input
                    type="text"
                    name="estado"
                    value={casaForm.estado}
                    onChange={handleCasaChange}
                    placeholder="CE"
                    maxLength="2"
                    className="w-full bg-panel border border-border rounded-lg px-3 py-2 text-text focus-ring"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-muted mb-1">CEP</label>
                  <input
                    type="text"
                    name="cep"
                    value={casaForm.cep}
                    onChange={handleCasaChange}
                    placeholder="60165-121"
                    className="w-full bg-panel border border-border rounded-lg px-3 py-2 text-text focus-ring"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-muted mb-1">Latitude</label>
                  <input
                    type="text"
                    name="geo_lat"
                    value={casaForm.geo_lat}
                    onChange={handleCasaChange}
                    placeholder="-3.7209"
                    className="w-full bg-panel border border-border rounded-lg px-3 py-2 text-text focus-ring"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-muted mb-1">Longitude</label>
                  <input
                    type="text"
                    name="geo_lng"
                    value={casaForm.geo_lng}
                    onChange={handleCasaChange}
                    placeholder="-38.5253"
                    className="w-full bg-panel border border-border rounded-lg px-3 py-2 text-text focus-ring"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-center pt-4">
                <button
                  type="submit"
                  className="btn-primary px-8 py-2 disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? 'Cadastrando…' : 'Criar Conta'}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {selectedRole === 'CLIENTE' && (
          <motion.div
            key="cliente-form"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass p-6"
          >
            <h2 className="text-xl font-semibold text-text mb-6">Cadastrar Cliente</h2>
            <form onSubmit={handleSubmitCliente} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-muted mb-1">Nome Completo</label>
                  <input
                    type="text"
                    name="nome"
                    value={clienteForm.nome}
                    onChange={handleClienteChange}
                    className="w-full bg-panel border border-border rounded-lg px-3 py-2 text-text focus-ring"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-muted mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={clienteForm.email}
                    onChange={handleClienteChange}
                    className="w-full bg-panel border border-border rounded-lg px-3 py-2 text-text focus-ring"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-muted mb-1">Telefone</label>
                  <input
                    type="tel"
                    name="telefone"
                    value={clienteForm.telefone}
                    onChange={handleClienteChange}
                    placeholder="+5585999999999"
                    className="w-full bg-panel border border-border rounded-lg px-3 py-2 text-text focus-ring"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-muted mb-1">Senha</label>
                  <input
                    type="password"
                    name="senha"
                    value={clienteForm.senha}
                    onChange={handleClienteChange}
                    className="w-full bg-panel border border-border rounded-lg px-3 py-2 text-text focus-ring"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-muted mb-1">Apelido</label>
                  <input
                    type="text"
                    name="apelido"
                    value={clienteForm.apelido}
                    onChange={handleClienteChange}
                    placeholder="Como prefere ser chamado"
                    className="w-full bg-panel border border-border rounded-lg px-3 py-2 text-text focus-ring"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-muted mb-1">Data de Nascimento</label>
                  <input
                    type="date"
                    name="data_nascimento"
                    value={clienteForm.data_nascimento}
                    onChange={handleClienteChange}
                    className="w-full bg-panel border border-border rounded-lg px-3 py-2 text-text focus-ring"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm text-muted mb-1">Preferências</label>
                  <textarea
                    name="preferencias"
                    value={clienteForm.preferencias}
                    onChange={handleClienteChange}
                    placeholder="Estilos musicais, tipos de eventos, etc."
                    className="w-full bg-panel border border-border rounded-lg px-3 py-2 text-text focus-ring"
                    rows="3"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-center pt-4">
                <button
                  type="submit"
                  className="btn-primary px-8 py-2 disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? 'Cadastrando…' : 'Criar Conta'}
                </button>
              </div>

              <div className="text-center pt-4">
                <button
                  type="button"
                  onClick={() => onNavigate('/login')}
                  className="text-primary hover:text-primary2 transition-colors text-sm"
                >
                </button>
              </div>
            </form>
          </motion.div>
        )}

        <p className="text-center text-muted text-sm mt-6">
          Já tem uma conta?{' '}
          <button
            onClick={() => onNavigate('/login')}
            className="text-primary hover:text-primary2 transition-colors focus-ring"
          >
            Faça login
          </button>
        </p>
        </div>
      </motion.div>
    </div>
  );
}
