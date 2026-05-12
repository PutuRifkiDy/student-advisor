const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('token');

async function handle(res) {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Terjadi kesalahan.');
  return data;
}

const headers = (extra = {}) => ({
  'Content-Type': 'application/json',
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
  ...extra,
});

export const api = {
  get: (path) => fetch(`${BASE}${path}`, { headers: headers() }).then(handle),
  post: (path, data) => fetch(`${BASE}${path}`, { method: 'POST', headers: headers(), body: JSON.stringify(data) }).then(handle),
  put: (path, data) => fetch(`${BASE}${path}`, { method: 'PUT', headers: headers(), body: JSON.stringify(data) }).then(handle),
  del: (path) => fetch(`${BASE}${path}`, { method: 'DELETE', headers: headers() }).then(handle),
};
