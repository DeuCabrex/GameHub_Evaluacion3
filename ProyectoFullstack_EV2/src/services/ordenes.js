import { solicitar } from './api';

export const ordenesService = {
  crear: (payload) =>
    solicitar('/ordenes', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  listar: () => solicitar('/ordenes'),
  obtener: (id) => solicitar(`/ordenes/${id}`),
};