const CLAVE_SESION = 'sesion';

export function leerSesion() {
  try {
    const raw = localStorage.getItem(CLAVE_SESION);
    if (!raw) return null;
    const sesion = JSON.parse(raw);
    if (!sesion?.token) return null;

    // Verificar expiración si el payload JWT trae `exp`
    const partes = sesion.token.split('.');
    if (partes.length === 3) {
      const payload = JSON.parse(atob(partes[1].replace(/-/g, '+').replace(/_/g, '/')));
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        localStorage.removeItem(CLAVE_SESION);
        return null;
      }
    }
    return sesion;
  } catch {
    return null;
  }
}

export function guardarSesion(sesion) {
  localStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));
}

export function borrarSesion() {
  localStorage.removeItem(CLAVE_SESION);
}