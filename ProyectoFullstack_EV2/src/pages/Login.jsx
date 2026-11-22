import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Login({ onExito, onIrARegistro }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setCargando(true);

    try {
      const correoLimpio = email.trim().toLowerCase();
      // Enviamos tanto email/password como correo/contrasena por compatibilidad con tu DTO del backend
      await login({
        email: correoLimpio,
        correo: correoLimpio,
        password: password,
        contrasena: password
      });
      onExito();
    } catch (err) {
      const msg = String(err?.message || '');
      if (msg.includes('401') || msg.includes('400') || msg.includes('403')) {
        setError('El correo electrónico o la contraseña se escribieron mal.');
      } else {
        setError(msg || 'El correo electrónico o la contraseña se escribieron mal.');
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="container my-5" style={{ maxWidth: '420px' }}>
      <h2 className="text-center mb-4">Iniciar Sesión</h2>
      <div className="card p-4">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Correo electrónico</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="alert alert-danger py-2" role="alert">
              {error}
            </div>
          )}

          <button type="submit" className="btn btn-primary w-100" disabled={cargando}>
            {cargando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="text-center mt-3 mb-0">
          ¿No tienes cuenta?{' '}
          <a
            href="#registro"
            onClick={(e) => {
              e.preventDefault();
              onIrARegistro();
            }}
          >
            Regístrate aquí
          </a>
        </p>
      </div>
    </div>
  );
}