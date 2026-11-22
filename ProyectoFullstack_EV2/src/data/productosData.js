const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

async function manejarRespuesta(res) {
  if (!res.ok) {
    let mensaje = `Error ${res.status}`;
    try {
      const data = await res.json();
      mensaje = data.mensaje || data.message || mensaje;
    } catch (_) {
    }
    throw new Error(mensaje);
  }
  if (res.status === 204) return null;
  return res.json();
}

export async function obtenerProductos() {
  const res = await fetch(`${API_URL}/api/productos`);
  return manejarRespuesta(res);
}

export async function crearProducto(producto) {
  const res = await fetch(`${API_URL}/api/productos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(producto),
  });
  return manejarRespuesta(res);
}

export async function actualizarProducto(id, producto) {
  const res = await fetch(`${API_URL}/api/productos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(producto),
  });
  return manejarRespuesta(res);
}

export async function eliminarProducto(id) {
  const res = await fetch(`${API_URL}/api/productos/${id}`, {
    method: "DELETE",
  });
  return manejarRespuesta(res);
}