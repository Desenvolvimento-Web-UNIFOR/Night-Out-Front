import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, FileText, CheckCircle2 } from 'lucide-react';
import { authFetch, getCurrentUser } from '../services/auth';

export default function NovoEvento() {
  const currentUser = getCurrentUser();
  const [form, setForm] = useState({
    titulo: '',
    descricao: '',
    data_inicio: '',
    data_fim: '',
    local: '',
  });
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      if (!currentUser?.id) {
        throw new Error('Usuário não encontrado. Faça login novamente.');
      }

      const payload = {
        id_usuario: currentUser.id,
        titulo: form.titulo,
        descricao: form.descricao,
        data_inicio: form.data_inicio ? new Date(form.data_inicio) : null,
        data_fim: form.data_fim ? new Date(form.data_fim) : null,
        local: form.local,
        status: 'ATIVO',
      };

      await authFetch('/evento', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      setSuccessMsg('Evento criado com sucesso!');
      setForm({
        titulo: '',
        descricao: '',
        data_inicio: '',
        data_fim: '',
        local: '',
      });
    } catch (err) {
      console.error(err);
      setErrorMsg(err?.message || 'Não foi possível criar o evento.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="glass p-6 max-w-3xl mx-auto"
    >
      <h1 className="text-2xl font-bold text-text mb-2">Criar novo evento</h1>
      <p className="text-muted mb-6">
        Preencha as informações do evento da sua casa de show.
      </p>

      {successMsg && (
        <div className="mb-4 flex items-center gap-2 text-sm text-emerald-300 bg-emerald-900/30 border border-emerald-700/60 px-3 py-2 rounded-lg">
          <CheckCircle2 size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="mb-4 text-sm text-red-300 bg-red-900/30 border border-red-700/60 px-3 py-2 rounded-lg">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm text-muted mb-1">Título</label>
          <div className="flex items-center gap-2 bg-panel border border-border rounded-lg px-3">
            <FileText size={16} className="text-muted" />
            <input
              name="titulo"
              value={form.titulo}
              onChange={handleChange}
              className="w-full bg-transparent py-2 text-text outline-none"
              placeholder="Sunrise Beachclub com Nattan"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-muted mb-1">Descrição</label>
          <textarea
            name="descricao"
            value={form.descricao}
            onChange={handleChange}
            className="w-full bg-panel border border-border rounded-lg px-3 py-2 text-text focus-ring resize-none"
            rows={4}
            placeholder="Descreva o evento, atrações, regras, etc."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-muted mb-1">Data / Hora início</label>
            <div className="flex items-center gap-2 bg-panel border border-border rounded-lg px-3">
              <Calendar size={16} className="text-muted" />
              <input
                type="datetime-local"
                name="data_inicio"
                value={form.data_inicio}
                onChange={handleChange}
                className="w-full bg-transparent py-2 text-text outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-muted mb-1">Data / Hora fim</label>
            <div className="flex items-center gap-2 bg-panel border border-border rounded-lg px-3">
              <Clock size={16} className="text-muted" />
              <input
                type="datetime-local"
                name="data_fim"
                value={form.data_fim}
                onChange={handleChange}
                className="w-full bg-transparent py-2 text-text outline-none"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm text-muted mb-1">Local</label>
          <div className="flex items-center gap-2 bg-panel border border-border rounded-lg px-3">
            <MapPin size={16} className="text-muted" />
            <input
              name="local"
              value={form.local}
              onChange={handleChange}
              className="w-full bg-transparent py-2 text-text outline-none"
              placeholder="Endereço ou descrição do local"
              required
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary px-6 py-2 disabled:opacity-50"
          >
            {saving ? 'Salvando…' : 'Criar evento'}
          </button>
        </div>
      </form>
    </motion.div>
  );
}