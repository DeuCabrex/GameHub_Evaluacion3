// src/App.jsx
import { useState } from 'react';
import Navbar from './components/Navbar';
import { Home } from './pages/Home';
import Catalogo from './pages/Catalogo';
import Carrito from './pages/Carrito';
import Checkout from './pages/Checkout';
import ResultadoPago from './pages/ResultadoPago';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Ordenes from './pages/Ordenes';
import AdminProductos from './pages/AdminProductos';
import RutaProtegida from './auth/RutaProtegida';
import Ordenes from './pages/Ordenes';
import Admin from './pages/Admin';
import { CarritoProvider } from './context/CarritoContext';
import { AuthProvider } from './context/AuthContext';

function ContenidoApp() {
  const [vistaActual, setVistaActual] = useState('home');
  const [vistaPendiente, setVistaPendiente] = useState(null);
  const [resultadoCompra, setResultadoCompra] = useState(null);

  const handleFinalizarCompra = (resultado) => {
    setResultadoCompra(resultado);
    setVistaActual('resultado');
  };

  const handleLoginExitoso = () => {
    if (vistaPendiente) {
      setVistaActual(vistaPendiente);
      setVistaPendiente(null);
    } else {
      setVistaActual('home');
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar vistaActual={vistaActual} setVistaActual={setVistaActual} />

      <main className="flex-grow-1">
        {/* Vistas públicas (Invitados, USER y ADMIN) */}
        {vistaActual === 'home' && (
          <Home
            onIrACatalogo={() => setVistaActual('catalogo')}
            onIrACarrito={() => setVistaActual('carrito')}
          />
        )}

        {vistaActual === 'catalogo' && <Catalogo />}

        {vistaActual === 'carrito' && (
          <Carrito 
            onIrACheckout={() => setVistaActual('checkout')} 
            onIrACatalogo={() => setVistaActual('catalogo')}
          />
        )}
        {vistaActual === 'login' && (
          <Login
            onExito={handleLoginExitoso}
            onIrARegistro={() => setVistaActual('registro')}
          />
        )}
        {vistaActual === 'registro' && (
          <Registro
            onExito={handleLoginExitoso}
            onIrALogin={() => setVistaActual('login')}
          />
        )}

        {/* Vistas protegidas (USER y ADMIN) */}
        {vistaActual === 'ordenes' && (
          <RutaProtegida
            setVistaActual={setVistaActual}
            vistaDestino="ordenes"
            setVistaPendiente={setVistaPendiente}
          >
            <Ordenes />
          </RutaProtegida>
        )}
        {vistaActual === 'checkout' && (
          <RutaProtegida
            setVistaActual={setVistaActual}
            vistaDestino="checkout"
            setVistaPendiente={setVistaPendiente}
          >
            <Checkout onCompraFinalizada={handleFinalizarCompra} />
          </RutaProtegida>
        )}

        {vistaActual === 'resultado' && (
          <RutaProtegida setVistaActual={setVistaActual}>
            <ResultadoPago
              resultado={resultadoCompra}
              onVolver={() => setVistaActual('catalogo')}
            />
          </RutaProtegida>
        )}

        {/* Vista exclusiva para ADMIN */}
        {vistaActual === 'admin' && (
          <RutaProtegida
            rol="ADMIN"
            setVistaActual={setVistaActual}
            vistaDestino="admin"
            setVistaPendiente={setVistaPendiente}
          >
            <AdminProductos />
          </RutaProtegida>
        )}

        {vistaActual === 'ordenes' && <Ordenes />}

        {vistaActual === 'admin' && <Admin />}
      </main>

      <footer>
        <p>© 2026 GameHub Store - Proyecto Desarrollo FullStack II</p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CarritoProvider>
        <ContenidoApp />
      </CarritoProvider>
    </AuthProvider>
  );
}