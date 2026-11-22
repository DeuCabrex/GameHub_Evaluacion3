import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { leerSesion } from '../services/sesion';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081/api';

export default function Ordenes() {
  const { token } = useAuth();
  const [ordenes, setOrdenes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarOrdenes = async () => {
      const jwt = token || leerSesion()?.token;
      if (!jwt) {
        setError('Debes iniciar sesión para ver tus órdenes.');
        setCargando(false);
        return;
      }

      try {
        const res = await fetch(`${API_URL}/ordenes`, {
          headers: { Authorization: `Bearer ${jwt}` }
        });
        if (!res.ok) {
          throw new Error('No se pudieron cargar las órdenes desde el servidor');
        }
        const data = await res.json();
        setOrdenes(data);
      } catch (err) {
        console.error('Error al cargar órdenes:', err);
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };

    cargarOrdenes();
  }, [token]);

  const formatearFecha = (fechaIso) => {
    if (!fechaIso) return 'Reciente';
    return new Date(fechaIso).toLocaleString('es-CL', {
      dateStyle: 'short',
      timeStyle: 'short'
    });
  };

  return (
    <div className="container my-5">
      <h2 className="mb-4">Historial de Órdenes</h2>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="table-responsive p-3">
        {cargando ? (
          <p className="text-center my-3">Cargando órdenes...</p>
        ) : (
          <table className="table align-middle">
            <thead>
              <tr>
                <th>N° Orden</th>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Productos</th>
                <th>Total</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {ordenes.map((orden) => (
                <tr key={orden.id}>
                  <td className="fw-bold">#{orden.id}</td>
                  <td>{orden.usuario?.nombre || orden.usuario?.email || '-'}</td>
                  <td>{formatearFecha(orden.fecha)}</td>
                  <td>
                    {orden.detalles && orden.detalles.length > 0 ? (
                      <ul className="list-unstyled mb-0 small">
                        {orden.detalles.map((det) => (
                          <li key={det.id}>
                            {det.cantidad}x {det.producto?.nombre || 'Producto'} ($
                            {Number(det.precioUnitario).toLocaleString('es-CL')})
                          </li>
                        ))}
                      </ul>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="fw-bold">${Number(orden.total || 0).toLocaleString('es-CL')}</td>
                  <td>
                    <span className="badge bg-success">{orden.estado || 'COMPLETADA'}</span>
                  </td>
                </tr>
              ))}
              {ordenes.length === 0 && !error && (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    No hay órdenes registradas aún.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}