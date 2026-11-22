import { useState, useEffect } from 'react';
import { ordenesService } from '../services/ordenes';

export default function Ordenes() {
  const [ordenes, setOrdenes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [lento, setLento] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let activo = true;
    const aviso = setTimeout(() => {
      if (activo) setLento(true);
    }, 4000);

    async function cargar() {
      try {
        setCargando(true);
        setError(null);
        const data = await ordenesService.listar();
        if (activo) setOrdenes(Array.isArray(data) ? data : []);
      } catch (err) {
        if (activo) setError(err.message || 'Error al cargar órdenes');
      } finally {
        clearTimeout(aviso);
        if (activo) {
          setLento(false);
          setCargando(false);
        }
      }
    }

    cargar();
    return () => {
      activo = false;
      clearTimeout(aviso);
    };
  }, []);

  if (cargando) {
    return (
      <div className="container py-5 text-center">
        <p className="fs-5">Cargando órdenes...</p>
        {lento && (
          <p className="small text-info">
            El servidor se está activando: puede tardar un minuto.
          </p>
        )}
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-4">
        <div className="alert alert-danger" role="alert">{error}</div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h2 className="h3 border-bottom pb-2 mb-4" style={{ color: 'var(--color-acento, #ACD550)' }}>
        Mis Órdenes / Historial de Compras
      </h2>

      {ordenes.length === 0 ? (
        <div
          className="card p-5 text-center shadow-sm"
          style={{ backgroundColor: 'var(--color-superficie, #1B2838)', border: '1px solid var(--color-borde, #2a3f5a)' }}
        >
          <h4 className="text-white mb-2">No tienes órdenes registradas</h4>
          <p style={{ color: 'var(--color-texto, #C7D5E0)' }} className="mb-0">
            Aún no has realizado ninguna compra. Agrega productos al carrito y completa el Checkout para generar un pedido.
          </p>
        </div>
      ) : (
        ordenes.map((orden, idx) => {
          const items = orden.productos || orden.detalles || [];
          return (
            <div
              className="card shadow-sm p-3 mb-4"
              key={orden.id || idx}
              style={{ backgroundColor: 'var(--color-superficie, #1B2838)', border: '1px solid var(--color-borde, #2a3f5a)' }}
            >
              <div className="d-flex justify-content-between align-items-center mb-2">
                <strong style={{ color: 'var(--color-primario, #66C0F4)' }}>
                  Orden #{orden.id || idx + 1}
                </strong>
                <span className="badge bg-success">{orden.estado || 'Aprobado'}</span>
              </div>

              <div className="row mb-2 small text-light">
                <div className="col-md-6">
                  {orden.cliente && (
                    <p className="mb-1">
                      <strong>Cliente:</strong> {orden.cliente} {orden.correo ? `(${orden.correo})` : ''}
                    </p>
                  )}
                  {orden.direccion && (
                    <p className="mb-1">
                      <strong>Despacho:</strong> {orden.direccion}
                    </p>
                  )}
                </div>
                <div className="col-md-6 text-md-end">
                  <p className="mb-1">
                    <strong>Fecha:</strong> {orden.fecha || 'N/A'}
                  </p>
                  <p className="mb-1">
                    <strong>Total Pagado:</strong> ${(Number(orden.total) || 0).toLocaleString('es-CL')}
                  </p>
                </div>
              </div>

              <div className="table-responsive">
                <table className="table table-dark table-bordered align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Cantidad</th>
                      <th>Precio Unitario</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((prod, pIdx) => {
                      const nombreProd = prod.nombre || prod.nombreProducto || 'Producto';
                      const precioUnit = Number(prod.precio ?? prod.precioUnitario) || 0;
                      const cant = Number(prod.cantidad) || 1;
                      const sub = Number(prod.subtotal) || (precioUnit * cant);
                      return (
                        <tr key={prod.id || pIdx}>
                          <td>{nombreProd}</td>
                          <td>{cant}</td>
                          <td>${precioUnit.toLocaleString('es-CL')}</td>
                          <td>${sub.toLocaleString('es-CL')}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}