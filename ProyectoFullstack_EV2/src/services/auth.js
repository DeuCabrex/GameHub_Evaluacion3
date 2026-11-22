import { solicitar } from './api'

export const authService = {
  login: (credenciales) =>
    solicitar('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credenciales),
    }),
  registro: (datos) =>
    solicitar('/auth/registro', {
      method: 'POST',
      body: JSON.stringify(datos),
    }),
}