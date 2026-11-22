import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081/api';

export default function Ordenes() {
  const { token } = useAuth();
  const [ordenes, setOrdenes] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarOrdenes = async () => {
      try {
        const res = await fetch(`${API_URL}/ordenes`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setOrdenes(data);
        }
      } catch (error) {
        console.error('Error al cargar órdenes:', error);
      } finally {
        setCargando(false);
      }
    };
    cargarOrdenes();
  }, [token]);

  return (
    <div className="container my-5">
      <h2 className="mb-4">Historial de Órdenes</h2>
      <div className="table-responsive p-3">
        {cargando ? (
          <p className="text-center my-3">Cargando órdenes...</p>
        ) : (
          <table className="table align-middle">
            <thead>
              <tr>
                <th>N° Orden</th>
                <th>Fecha</th>
                <th>Total</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {ordenes.map((orden) => (
                <tr key={orden.id}>
                  <td>#{orden.id}</td>
                  <td>{orden.fecha || orden.fechaCreacion || 'Reciente'}</td>
                  <td>${Number(orden.total || 0).toLocaleString('es-CL')}</td>
                  <td>
                    <span className="badge bg-success">{orden.estado || 'COMPLETADA'}</span>
                  </td>
                </tr>
              ))}
              {ordenes.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-4">
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