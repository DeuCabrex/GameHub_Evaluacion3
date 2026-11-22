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

export function calcularSubtotal(items = []) {
  return items.reduce((acc, item) => acc + Number(item.precio || 0) * Number(item.cantidad || 1), 0);
}

export function aplicarCupon(subtotal, cupon) {
  if (!cupon) return 0;
  const codigo = String(cupon).trim().toUpperCase();
  if (codigo === "GAMEHUB10") return Math.round(subtotal * 0.1);
  return 0;
}

export function calcularTotal(subtotal, descuento = 0) {
  const total = Number(subtotal || 0) - Number(descuento || 0);
  return total > 0 ? total : 0;
}