import { solicitar } from "./api";

export function obtenerProductos() {
  return solicitar("/api/productos");
}

export function crearProducto(payload) {
  return solicitar("/api/productos", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function actualizarProducto(id, payload) {
  return solicitar(`/api/productos/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function eliminarProducto(id) {
  return solicitar(`/api/productos/${id}`, {
    method: "DELETE",
  });
}