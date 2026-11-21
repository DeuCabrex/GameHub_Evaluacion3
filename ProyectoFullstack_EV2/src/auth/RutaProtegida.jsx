import { useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

export default function RutaProtegida({ children, rol, setVistaActual, vistaDestino, setVistaPendiente }) {
  const { autenticado, usuario } = useAuth()

  useEffect(() => {
    if (!autenticado) {
      if (setVistaPendiente && vistaDestino) {
        setVistaPendiente(vistaDestino)
      }
      setVistaActual('login')
    }
  }, [autenticado, setVistaActual, setVistaPendiente, vistaDestino])

  if (!autenticado) {
    return null
  }

  if (rol && usuario?.rol !== rol) {
    return (
      <div className="container my-5 text-center">
        <h3>Acceso denegado</h3>
        <p>No tienes permisos de {rol} para ver esta sección.</p>
        <button className="btn btn-primary" onClick={() => setVistaActual('home')}>
          Volver al inicio
        </button>
      </div>
    )
  }

  return children
}