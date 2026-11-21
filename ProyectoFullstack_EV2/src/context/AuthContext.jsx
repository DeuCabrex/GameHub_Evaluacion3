import { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/auth'
import { leerSesion, guardarSesion, borrarSesion } from '../services/sesion'

export const AuthContext = createContext(null)

export function useAuth() {
  const contexto = useContext(AuthContext)
  if (!contexto) {
    throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  }
  return contexto
}

export function AuthProvider({ children }) {
  const [sesion, setSesion] = useState(leerSesion)

  useEffect(() => {
    const alExpirar = () => setSesion(null)
    window.addEventListener('sesion-expirada', alExpirar)
    return () => window.removeEventListener('sesion-expirada', alExpirar)
  }, [])

  async function login(credenciales) {
    const datos = await authService.login(credenciales)
    guardarSesion(datos)
    setSesion(datos)
  }

  async function registro(datosUsuario) {
    const datos = await authService.registro(datosUsuario)
    guardarSesion(datos)
    setSesion(datos)
  }

  function logout() {
    borrarSesion()
    setSesion(null)
  }

  const valor = {
    login,
    registro,
    logout,
    usuario: sesion?.usuario ?? null,
    autenticado: sesion !== null,
  }

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>
}