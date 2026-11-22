import { useContext } from 'react';
import { CarritoContext } from '../context/CarritoContext';
import { useAuth } from '../context/AuthContext';
import logoImg from '../assets/gamehub.png';

export default function Navbar({ vistaActual, setVistaActual }) {
  const { carrito } = useContext(CarritoContext);
  const { autenticado, usuario, logout } = useAuth();
  const totalItems = carrito ? carrito.reduce((acc, item) => acc + item.cantidad, 0) : 0;

  const handleCerrarSesion = (e) => {
    e.preventDefault();
    logout();
    setVistaActual('home');
  };

  return (
    <header className="header">
      <div className="logo-titulo" onClick={() => setVistaActual('home')}>
        <div className="logo">
          <img src={logoImg} alt="Logo GameHub Store" />
        </div>
        <h1>GameHub Store</h1>
      </div>

      <nav className="nav">
        <ul>
          <li>
            <a
              href="#inicio"
              className={vistaActual === 'home' ? 'activo' : ''}
              onClick={(e) => { e.preventDefault(); setVistaActual('home'); }}
            >
              INICIO
            </a>
          </li>
          <li>
            <a
              href="#catalogo"
              className={vistaActual === 'catalogo' ? 'activo' : ''}
              onClick={(e) => { e.preventDefault(); setVistaActual('catalogo'); }}
            >
              CATÁLOGO
            </a>
          </li>

          {autenticado && (
            <li>
              <a
                href="#ordenes"
                className={vistaActual === 'ordenes' ? 'activo' : ''}
                onClick={(e) => { e.preventDefault(); setVistaActual('ordenes'); }}
              >
                ÓRDENES
              </a>
            </li>
          )}

          {usuario?.rol === 'ADMIN' && (
            <li>
              <a
                href="#admin"
                className={vistaActual === 'admin' ? 'activo' : ''}
                onClick={(e) => { e.preventDefault(); setVistaActual('admin'); }}
              >
                ADMIN
              </a>
            </li>
          )}

          <li>
            <a
              href="#admin"
              className={vistaActual === 'admin' ? 'activo' : ''}
              onClick={(e) => { e.preventDefault(); setVistaActual('admin'); }}
            >
              ADMIN
            </a>
          </li>
          <li>
            <a
              href="#carrito"
              className={vistaActual === 'carrito' ? 'activo' : ''}
              onClick={(e) => { e.preventDefault(); setVistaActual('carrito'); }}
            >
              🛒 <span id="contador-carrito">({totalItems})</span>
            </a>
          </li>

          {!autenticado ? (
            <>
              <li>
                <a
                  href="#login"
                  className={vistaActual === 'login' ? 'activo' : ''}
                  onClick={(e) => { e.preventDefault(); setVistaActual('login'); }}
                >
                  INICIAR SESIÓN
                </a>
              </li>
              <li>
                <a
                  href="#registro"
                  className={vistaActual === 'registro' ? 'activo' : ''}
                  onClick={(e) => { e.preventDefault(); setVistaActual('registro'); }}
                >
                  REGISTRO
                </a>
              </li>
            </>
          ) : (
            <>
              <li>
                <span className="usuario-saludo">
                  Hola, {usuario.nombre} ({usuario.rol})
                </span>
              </li>
              <li>
                <a href="#salir" onClick={handleCerrarSesion}>
                  CERRAR SESIÓN
                </a>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}