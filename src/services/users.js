import { authFetch } from './auth';

export async function registerUser({ nome, email, senha, telefone, tipo }) {
  const normTipo = String(tipo || 'CLIENTE')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .trim().toUpperCase();

  const payload = {
    nome: String(nome || '').trim(),
    email: String(email || '').trim(),
    senha,
    telefone: String(telefone || '').trim(),
    tipo: ['CLIENTE', 'ARTISTA', 'CASASHOW'].includes(normTipo) ? normTipo : 'CLIENTE',
  };

  return await authFetch('/usuarios', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}
