import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function Login({ onExito, onIrARegistro }) {
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState(null)
  const [enviando, setEnviando] = useState(false)

  const cambiar = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  async function enviar(e) {
    e.preventDefault()
    setError(null)
    setEnviando(true)
    try {
      await login(form)
      onExito()
    } catch (err) {
      setError(err.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="container my-5" style={{ maxWidth: '450px' }}>
      <h2 className="mb-4 text-center">Iniciar Sesión</h2>
      <form onSubmit={enviar} className="card p-4 shadow-sm">
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
            placeholder="********"
            value={form.password}
            onChange={cambiar}
            required
          />
        </div>
        {error && <div className="alert alert-danger py-2">{error}</div>}
        <button type="submit" className="btn btn-primary w-100" disabled={enviando}>
          {enviando ? 'Ingresando...' : 'Entrar'}
        </button>
        <p className="mt-3 mb-0 text-center">
          ¿No tienes cuenta?{' '}
          <a href="#registro" onClick={(e) => { e.preventDefault(); onIrARegistro(); }}>
            Regístrate aquí
          </a>
        </p>
      </form>
    </div>
  )
}