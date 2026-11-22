import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function Registro({ onExito, onIrALogin }) {
  const { registro } = useAuth()
  const [form, setForm] = useState({ nombre: '', email: '', password: '' })
  const [error, setError] = useState(null)
  const [enviando, setEnviando] = useState(false)

  const cambiar = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  async function enviar(e) {
    e.preventDefault()
    setError(null)
    setEnviando(true)
    try {
      await registro(form)
      onExito()
    } catch (err) {
      setError(err.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="container my-5" style={{ maxWidth: '450px' }}>
      <h2 className="mb-4 text-center">Crear Cuenta</h2>
      <form onSubmit={enviar} className="card p-4 shadow-sm">
        <div className="mb-3">
          <label className="form-label">Nombre completo</label>
          <input
            name="nombre"
            type="text"
            className="form-control"
            placeholder="Tu nombre"
            value={form.nombre}
            onChange={cambiar}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Correo electrónico</label>
          <input
            name="email"
            type="email"
            className="form-control"
            placeholder="ejemplo@gamehub.cl"
            value={form.email}
            onChange={cambiar}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Contraseña</label>
          <input
            name="password"
            type="password"
            className="form-control"
            placeholder="Mínimo 6 caracteres"
            value={form.password}
            onChange={cambiar}
            required
          />
        </div>
        {error && <div className="alert alert-danger py-2">{error}</div>}
        <button type="submit" className="btn btn-success w-100" disabled={enviando}>
          {enviando ? 'Registrando...' : 'Registrarme'}
        </button>
        <p className="mt-3 mb-0 text-center">
          ¿Ya tienes cuenta?{' '}
          <a href="#login" onClick={(e) => { e.preventDefault(); onIrALogin(); }}>
            Inicia sesión
          </a>
        </p>
      </form>
    </div>
  )
}