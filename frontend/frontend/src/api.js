// frontend/src/config/api.js
export const API_URL =
  import.meta.env.VITE_API_URL || 'https://gabriel-disena-backend.onrender.com'; // fallback solo para desarrollo

export async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    credentials: 'include',
    ...options,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `Error HTTP ${res.status}`);
  }

  return res.json();
}
