import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  Phone,
  Mail,
  Users,
  CalendarDays,
  Music2,
  Star,
  MessageSquare,
  Edit2,
  X
} from 'lucide-react';
import { authFetch, getToken } from '../services/auth';

function getUserFromToken() {
  try {
    const token = getToken();
    if (!token) return null;
    const [, payload] = token.split('.');
    if (!payload) return null;

    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = atob(base64);
    const json = JSON.parse(decoded);
    return json;
  } catch (err) {
    console.error('Falha ao decodificar token JWT:', err);
    return null;
  }
}

export default function PerfilArtista() {
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

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

  const userPayload = useMemo(() => getUserFromToken(), []);

  useEffect(() => {
    async function fetchArtist() {
      if (!userPayload?.id) {
        setErr('Usuário não autenticado ou token inválido.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setErr('');

      try {
        const data = await authFetch(`/artista/${userPayload.id}`, {
          method: 'GET',
        });
        setArtist(data);

        setForm({
          nome: data?.usuario?.nome || '',
          email: data?.usuario?.email || '',
          telefone: data?.usuario?.telefone || '',
          nome_artista: data?.nome_artista || '',
          genero_musical: data?.genero_musical || '',
          cache_min: data?.cache_min || '',
          descricao: data?.descricao || '',
          portifolio: data?.portifolio || '',
        });
      } catch (e) {
        console.error(e);
        setErr(e?.message || 'Erro ao carregar dados do artista.');
      } finally {
        setLoading(false);
      }
    }

    fetchArtist();
  }, [userPayload]);

  const displayName =
    artist?.usuario?.nome || artist?.nome_artista || 'Artista';

  const displayEmail = artist?.usuario?.email || '';
  const displayPhone = artist?.usuario?.telefone || '';
  const displayBio = artist?.descricao || 'Adicione uma descrição no seu perfil.';
  const displayLocation = artist?.usuario?.cidade || artist?.usuario?.localizacao || 'Localização não informada';

  const avatarLetter = displayName?.charAt(0)?.toUpperCase() || 'A';

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!userPayload?.id) return;

    setSaving(true);
    setErr('');

    const payload = {
      nome_artista: form.nome_artista,
      genero_musical: form.genero_musical,
      cache_min: form.cache_min,
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

    try {
      const resp = await authFetch(`/artistas/${userPayload.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const updatedArtist = resp?.artista || resp;
      setArtist(updatedArtist);

      setForm({
        nome: updatedArtist?.usuario?.nome || '',
        email: updatedArtist?.usuario?.email || '',
        telefone: updatedArtist?.usuario?.telefone || '',
        nome_artista: updatedArtist?.nome_artista || '',
        genero_musical: updatedArtist?.genero_musical || '',
        cache_min: updatedArtist?.cache_min || '',
        descricao: updatedArtist?.descricao || '',
        portifolio: updatedArtist?.portifolio || '',
      });

      setIsEditing(false);
    } catch (e) {
      console.error(e);
      setErr(e?.message || 'Erro ao salvar alterações.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="glass p-8">
        <p className="text-muted">Carregando perfil do artista…</p>
      </div>
    );
  }

  if (err && !artist) {
    return (
      <div className="glass p-8">
        <p className="text-red-400">{err}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass p-8"
      >
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary/70 to-primary2/70 flex items-center justify-center text-3xl font-bold text-white shadow-lg">
            {avatarLetter}
          </div>

          <div className="flex-1">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold">{displayName}</h1>
                <p className="text-muted mt-1">{displayBio}</p>
              </div>

              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-panel/70 hover:bg-panel focus-ring text-sm font-medium"
              >
                <Edit2 size={16} />
                Editar perfil
              </button>
            </div>

            <div className="flex flex-wrap gap-6 mt-4">
              <div className="text-center">
                <p className="text-sm text-muted">Gênero musical</p>
                <p className="text-lg font-semibold text-primary">
                  {artist?.genero_musical || '—'}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted">Cachê mínimo</p>
                <p className="text-lg font-semibold text-primary2">
                  {artist?.cache_min ? `R$ ${artist.cache_min}` : 'Não informado'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="glass p-6"
        >
          <h3 className="text-lg font-semibold mb-4">Informações do Perfil</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Phone size={18} className="text-muted" />
              <span>{displayPhone || 'Telefone não informado'}</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail size={18} className="text-muted" />
              <span>{displayEmail || 'Email não informado'}</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin size={18} className="text-muted" />
              <span>{displayLocation}</span>
            </div>
            <div className="flex items-center gap-3">
              <Users size={18} className="text-muted" />
              <span>Equipe: -</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="glass p-6"
        >
          <h3 className="text-lg font-semibold mb-4">Atividade</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-panel/60 border border-border rounded-xl p-4">
              <div className="text-sm text-muted">Shows no mês</div>
              <div className="text-2xl font-bold flex items-center gap-2 mt-1">
                <Music2 size={18} className="text-accent" /> 0
              </div>
            </div>
            <div className="bg-panel/60 border border-border rounded-xl p-4">
              <div className="text-sm text-muted">Avaliação média</div>
              <div className="text-2xl font-bold flex items-center gap-2 mt-1">
                <Star size={18} className="text-warning fill-warning" /> —
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass p-6"
        >
          <h3 className="text-lg font-semibold mb-4">Propostas recentes</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-panel/50 border border-border">
              <MessageSquare size={18} className="text-primary" />
              <div className="flex-1">
                <div className="font-medium text-muted">
                  Nenhuma proposta recente encontrada.
                </div>
                <div className="text-sm text-muted flex items-center gap-1">
                  <CalendarDays size={14} /> —
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {err && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-red-300 text-sm">
          {err}
        </div>
      )}

      {isEditing && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass max-w-xl w-full p-6 relative"
          >
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="absolute top-3 right-3 p-1 rounded-full hover:bg-panel focus-ring"
            >
              <X size={18} />
            </button>

            <h2 className="text-xl font-semibold mb-4">Editar perfil do artista</h2>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-muted mb-1">Nome</label>
                  <input
                    type="text"
                    name="nome"
                    value={form.nome}
                    onChange={handleChange}
                    className="w-full bg-panel border border-border rounded-lg px-3 py-2 focus-ring"
                  />
                </div>
                <div>
                  <label className="block text-sm text-muted mb-1">
                    Nome artístico
                  </label>
                  <input
                    type="text"
                    name="nome_artista"
                    value={form.nome_artista}
                    onChange={handleChange}
                    className="w-full bg-panel border border-border rounded-lg px-3 py-2 focus-ring"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-muted mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full bg-panel border border-border rounded-lg px-3 py-2 focus-ring"
                  />
                </div>
                <div>
                  <label className="block text-sm text-muted mb-1">
                    Telefone
                  </label>
                  <input
                    type="text"
                    name="telefone"
                    value={form.telefone}
                    onChange={handleChange}
                    className="w-full bg-panel border border-border rounded-lg px-3 py-2 focus-ring"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-muted mb-1">
                    Gênero musical
                  </label>
                  <input
                    type="text"
                    name="genero_musical"
                    value={form.genero_musical}
                    onChange={handleChange}
                    className="w-full bg-panel border border-border rounded-lg px-3 py-2 focus-ring"
                  />
                </div>
                <div>
                  <label className="block text-sm text-muted mb-1">
                    Cachê mínimo
                  </label>
                  <input
                    type="text"
                    name="cache_min"
                    value={form.cache_min}
                    onChange={handleChange}
                    className="w-full bg-panel border border-border rounded-lg px-3 py-2 focus-ring"
                    placeholder="Ex.: 5000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-muted mb-1">
                  Descrição / Bio
                </label>
                <textarea
                  name="descricao"
                  value={form.descricao}
                  onChange={handleChange}
                  rows={3}
                  className="w-full bg-panel border border-border rounded-lg px-3 py-2 focus-ring resize-none"
                />
              </div>

              <div>
                <label className="block text-sm text-muted mb-1">
                  Portfólio (links, redes sociais, etc)
                </label>
                <textarea
                  name="portifolio"
                  value={form.portifolio}
                  onChange={handleChange}
                  rows={2}
                  className="w-full bg-panel border border-border rounded-lg px-3 py-2 focus-ring resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-lg border border-border bg-panel hover:bg-panel/70 text-sm"
                  disabled={saving}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-primary text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-60"
                  disabled={saving}
                >
                  {saving ? 'Salvando…' : 'Salvar alterações'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}