import { leerSesion, borrarSesion } from './sesion';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export async function solicitar(ruta, opciones = {}) {
  const sesion = leerSesion();
  const token = sesion?.token;

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(opciones.headers || {}),
  };

  const res = await fetch(`${API_URL}${ruta}`, {
    ...opciones,
    headers,
  });

  if (res.status === 401 && token) {
    borrarSesion();
    window.dispatchEvent(new Event('sesion-expirada'));
  }

  if (!res.ok) {
    const cuerpo = await res.json().catch(() => ({}));
    throw new Error(cuerpo.mensaje || `Error HTTP ${res.status}`);
  }

  return res.status === 204 ? null : res.json();
}