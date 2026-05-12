const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function handle(res) {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Terjadi kesalahan.');
  return data;
}

export const api = {
  get: (path) => fetch(`${BASE}${path}`).then(handle),
  post: (path, data) => fetch(`${BASE}${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(handle),
  put: (path, data) => fetch(`${BASE}${path}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(handle),
  del: (path) => fetch(`${BASE}${path}`, { method: 'DELETE' }).then(handle),
};
