import { Navigate, useLocation } from 'react-router'
import { useAuth } from '../context/AuthContext'

export default function RutaProtegida({ children, rol }) {
  const { autenticado, usuario } = useAuth()
  const ubicacion = useLocation()

  if (!autenticado) {
    return <Navigate to="/login" replace state={{ desde: ubicacion.pathname }} />
  }

  if (rol && usuario?.rol !== rol) {
    return <p>No tienes permiso para acceder a esta sección.</p>
  }

  return children
}