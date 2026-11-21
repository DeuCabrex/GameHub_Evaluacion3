import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const ubicacion = useLocation()
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
      const destino = ubicacion.state?.desde ?? '/'
      navigate(destino, { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="auth-container">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={enviar}>
        <input name="email" type="email" placeholder="Correo electrónico" value={form.email} onChange={cambiar} required />
        <input name="password" type="password" placeholder="Contraseña" value={form.password} onChange={cambiar} required />
        <button type="submit" disabled={enviando}>
          {enviando ? 'Ingresando...' : 'Entrar'}
        </button>
        {error && <p className="error">{error}</p>}
      </form>
      <p>¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link></p>
    </div>
  )
}