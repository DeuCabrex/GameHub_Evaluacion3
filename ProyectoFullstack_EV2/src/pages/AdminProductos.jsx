import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { leerSesion } from '../services/sesion';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081/api';

const FORM_INICIAL = {
  nombre: '',
  categoria: '',
  marca: '',
  precio: '',
  stock: '',
  imagen: ''
};

export default function AdminProductos() {
  const { token } = useAuth();
  const [productos, setProductos] = useState([]);
  const [formulario, setFormulario] = useState(FORM_INICIAL);
  const [editandoId, setEditandoId] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  const obtenerToken = () => {
    return token || leerSesion()?.token || null;
  };

  const cargarProductos = async () => {
    try {
      const res = await fetch(`${API_URL}/productos`);
      if (res.ok) {
        const data = await res.json();
        setProductos(data);
      }
    } catch (error) {
      console.error('Error al cargar productos:', error);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormulario((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setMensaje(null);

    const jwt = obtenerToken();
    if (!jwt) {
      setMensaje({
        tipo: 'danger',
        texto: 'No se encontró un token de sesión. Cierra sesión y vuelve a ingresar.'
      });
      setCargando(false);
      return;
    }

    const precioLimpio = Number(String(formulario.precio).replace(/\./g, ''));

    const payload = {
      nombre: formulario.nombre.trim(),
      categoria: formulario.categoria.trim(),
      marca: formulario.marca.trim(),
      precio: precioLimpio,
      stock: Number(formulario.stock),
      imagen: formulario.imagen.trim()
    };

    const url = editandoId
      ? `${API_URL}/productos/${editandoId}`
      : `${API_URL}/productos`;
    const metodo = editandoId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method: metodo,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.mensaje || err.error || `Error ${res.status} al guardar el producto`);
      }

      setMensaje({
        tipo: 'success',
        texto: editandoId ? 'Producto actualizado correctamente.' : 'Producto creado con éxito en Supabase.'
      });
      setFormulario(FORM_INICIAL);
      setEditandoId(null);
      cargarProductos();
    } catch (error) {
      setMensaje({ tipo: 'danger', texto: error.message });
    } finally {
      setCargando(false);
    }
  };

  const handleEditar = (prod) => {
    setEditandoId(prod.id);
    setFormulario({
      nombre: prod.nombre || '',
      categoria: prod.categoria || '',
      marca: prod.marca || '',
      precio: prod.precio ?? '',
      stock: prod.stock ?? '',
      imagen: prod.imagen || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este producto?')) return;

    const jwt = obtenerToken();
    try {
      const res = await fetch(`${API_URL}/productos/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${jwt}`
        }
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.mensaje || 'No se pudo eliminar el producto');
      }

      setMensaje({ tipo: 'success', texto: 'Producto eliminado.' });
      cargarProductos();
    } catch (error) {
      setMensaje({ tipo: 'danger', texto: error.message });
    }
  };

  return (
    <div className="container my-5">
      <h2 className="mb-4">Panel de Administración — Gestión de Productos</h2>

      {mensaje && (
        <div className={`alert alert-${mensaje.tipo}`} role="alert">
          {mensaje.texto}
        </div>
      )}

      <div className="card p-4 mb-5">
        <h4 className="mb-3">{editandoId ? 'Editar Producto' : 'Nuevo Producto'}</h4>
        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-md-4">
            <label className="form-label">Nombre</label>
            <input
              type="text"
              name="nombre"
              className="form-control"
              placeholder="Ej: Ryzen 9 9950X"
              value={formulario.nombre}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Categoría</label>
            <input
              type="text"
              name="categoria"
              className="form-control"
              placeholder="Ej: Procesador, Consolas"
              value={formulario.categoria}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Marca</label>
            <input
              type="text"
              name="marca"
              className="form-control"
              placeholder="Ej: AMD, Sony, Asus"
              value={formulario.marca}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Precio ($)</label>
            <input
              type="text"
              inputMode="numeric"
              name="precio"
              className="form-control"
              placeholder="Ej: 900000"
              value={formulario.precio}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Stock</label>
            <input
              type="number"
              name="stock"
              className="form-control"
              min="0"
              value={formulario.stock}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">URL de Imagen</label>
            <input
              type="text"
              name="imagen"
              className="form-control"
              placeholder="https://..."
              value={formulario.imagen}
              onChange={handleChange}
            />
          </div>
          <div className="col-12 d-flex gap-2">
            <button type="submit" className="btn btn-primary" disabled={cargando}>
              {cargando ? 'Guardando...' : editandoId ? 'Actualizar Producto' : 'Agregar Producto'}
            </button>
            {editandoId && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setEditandoId(null);
                  setFormulario(FORM_INICIAL);
                }}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="table-responsive p-3">
        <h4 className="mb-3">Catálogo Actual ({productos.length})</h4>
        <table className="table align-middle">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Marca</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((prod) => (
              <tr key={prod.id}>
                <td>{prod.id}</td>
                <td>{prod.nombre}</td>
                <td>{prod.marca || '-'}</td>
                <td>{prod.categoria || '-'}</td>
                <td>${Number(prod.precio).toLocaleString('es-CL')}</td>
                <td>{prod.stock}</td>
                <td className="d-flex gap-2">
                  <button
                    className="btn btn-sm btn-warning"
                    onClick={() => handleEditar(prod)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleEliminar(prod.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {productos.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  No hay productos registrados todavía.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}