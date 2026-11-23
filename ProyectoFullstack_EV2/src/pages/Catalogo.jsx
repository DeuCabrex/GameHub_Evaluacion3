import { useState, useEffect, useContext } from 'react';
import { CarritoContext } from '../context/CarritoContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081/api';

export default function Catalogo() {
  const { agregarProducto } = useContext(CarritoContext);

  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const [categoriaSel, setCategoriaSel] = useState('Todas');
  const [precioMax, setPrecioMax] = useState('');
  const [orden, setOrden] = useState('nombre');

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        setCargando(true);
        const res = await fetch(`${API_URL}/productos`);
        if (!res.ok) {
          throw new Error('No se pudieron cargar los productos desde el servidor');
        }
        const data = await res.json();
        setProductos(data);
      } catch (err) {
        console.error('Error al cargar catálogo:', err);
        setError('Error al conectar con el catálogo de la tienda.');
      } finally {
        setCargando(false);
      }
    };

    cargarProductos();
  }, []);

  const categorias = ['Todas', ...new Set(productos.map(p => p.categoria).filter(Boolean))];

  const productosFiltrados = productos.filter(p => {
    const cumpleCat = categoriaSel === 'Todas' || p.categoria === categoriaSel;
    const cumplePrecio = precioMax === '' || Number(p.precio) <= Number(precioMax);
    return cumpleCat && cumplePrecio;
  });

  const productosOrdenados = [...productosFiltrados].sort((a, b) => {
    if (orden === 'precioAsc') return a.precio - b.precio;
    if (orden === 'precioDesc') return b.precio - a.precio;
    return a.nombre.localeCompare(b.nombre);
  });

  return (
    <div className="container py-4">
      <h2 className="h3 text-success border-bottom pb-2 mb-4">Catálogo de Productos</h2>

      <div className="row">
        <div className="col-md-3 mb-4">
          <div className="card p-3 shadow-sm">
            <h5 className="fw-bold mb-3">Filtros</h5>

            <div className="mb-3">
              <label className="form-label fw-bold">Categoría</label>
              <select className="form-select" value={categoriaSel} onChange={e => setCategoriaSel(e.target.value)}>
                {categorias.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">Precio Máximo ($)</label>
              <input
                type="number"
                className="form-control"
                placeholder="Sin límite"
                min="0"
                value={precioMax}
                onChange={e => setPrecioMax(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">Ordenar por</label>
              <select className="form-select" value={orden} onChange={e => setOrden(e.target.value)}>
                <option value="nombre">Nombre (A-Z)</option>
                <option value="precioAsc">Precio: Menor a Mayor</option>
                <option value="precioDesc">Precio: Mayor a Menor</option>
              </select>
            </div>
          </div>
        </div>

        <div className="col-md-9">
          {cargando ? (
            <div className="text-center py-5">
              <p className="text-light fs-5">Cargando productos...</p>
            </div>
          ) : error ? (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          ) : (
            <div className="row g-4">
              {productosOrdenados.length === 0 ? (
                <div className="col-12 text-center py-5">
                  <p className="text-light fs-5">No hay productos que coincidan con los filtros.</p>
                </div>
              ) : (
                productosOrdenados.map(p => (
                  <div key={p.id} className="col-md-4">
                    <div className="card h-100 shadow-sm border-0">
                      <img
                        src={p.imagen || '/placeholder.png'}
                        className="card-img-top p-3"
                        alt={p.nombre}
                        style={{ height: '200px', objectFit: 'contain' }}
                      />
                      <div className="card-body d-flex flex-column">
                        <span className="badge bg-secondary w-auto mb-2 align-self-start">{p.categoria}</span>
                        <h5 className="card-title fs-6 fw-bold">{p.nombre}</h5>
                        <p className="text-success fw-bold fs-5 mt-auto">${Number(p.precio).toLocaleString('es-CL')}</p>
                        <p className="small text-light mb-2">
                          Stock: {p.stock > 0 ? `${p.stock} un.` : <span className="text-danger fw-bold">Sin Stock</span>}
                        </p>
                        <button
                          className="btn btn-success w-100 fw-bold"
                          disabled={p.stock === 0}
                          onClick={() => agregarProducto(p)}
                        >
                          {p.stock > 0 ? 'Añadir al Carrito' : 'Agotado'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}