import { solicitar } from './api';

export const productosService = {
  listar: () => solicitar('/productos'),
  obtener: (id) => solicitar(`/productos/${id}`),
  crear: (payload) =>
    solicitar('/productos', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  actualizar: (id, payload) =>
    solicitar(`/productos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  eliminar: (id) =>
    solicitar(`/productos/${id}`, {
      method: 'DELETE',
    }),
};
