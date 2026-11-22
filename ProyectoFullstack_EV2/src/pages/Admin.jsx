import { useEffect, useState } from "react";
import {
  obtenerProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
} from "../services/productos";

const FORMULARIO_VACIO = {
  nombre: "",
  precio: "",
  stock: "",
  categoria: "",
  marca: "",
  imagen: "",
};

export default function Admin() {
  const [productos, setProductos] = useState([]);
  const [form, setForm] = useState(FORMULARIO_VACIO);
  const [editandoId, setEditandoId] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");
  const [mensajeExito, setMensajeExito] = useState("");

  async function cargarCatalogo() {
    setCargando(true);
    setError("");
    try {
      const data = await obtenerProductos();
      setProductos(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "No se pudieron cargar los productos.");
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarCatalogo();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function iniciarEdicion(producto) {
    setEditandoId(producto.id);
    setMensajeExito("");
    setError("");
    setForm({
      nombre: producto.nombre ?? "",
      precio: producto.precio ?? "",
      stock: producto.stock ?? "",
      categoria: producto.categoria ?? "",
      marca: producto.marca ?? "",
      imagen: producto.imagen ?? "",
    });
  }

  function cancelarEdicion() {
    setEditandoId(null);
    setForm(FORMULARIO_VACIO);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setMensajeExito("");

    const payload = {
      nombre: form.nombre.trim(),
      precio: Number(form.precio),
      stock: Number(form.stock),
      categoria: form.categoria.trim(),
      marca: form.marca.trim(),
      imagen: form.imagen.trim() || null,
    };

    if (!payload.nombre || payload.precio <= 0 || payload.stock < 0 || !payload.categoria || !payload.marca) {
      setError("Completa nombre, categoría, marca, un precio mayor a 0 y stock 0 o superior.");
      return;
    }

    setEnviando(true);
    try {
      if (editandoId !== null) {
        await actualizarProducto(editandoId, payload);
        setMensajeExito("Producto actualizado correctamente.");
      } else {
        await crearProducto(payload);
        setMensajeExito("Producto creado correctamente.");
      }
      cancelarEdicion();
      await cargarCatalogo();
    } catch (err) {
      setError(err.message || "Error al guardar el producto.");
    } finally {
      setEnviando(false);
    }
  }

  async function handleEliminar(id, nombre) {
    setError("");
    setMensajeExito("");
    try {
      await eliminarProducto(id);
      setMensajeExito(`Producto "${nombre}" eliminado.`);
      if (editandoId === id) {
        cancelarEdicion();
      }
      await cargarCatalogo();
    } catch (err) {
      setError(err.message || "No se pudo eliminar el producto.");
    }
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Panel de Administración — Productos</h2>
        <button
          type="button"
          className="btn btn-outline-secondary btn-sm"
          onClick={cargarCatalogo}
          disabled={cargando}
        >
          Actualizar lista
        </button>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {mensajeExito && (
        <div className="alert alert-success" role="alert">
          {mensajeExito}
        </div>
      )}

      <div className="card mb-4 shadow-sm">
        <div className="card-header fw-bold">
          {editandoId !== null ? `Editar producto #${editandoId}` : "Nuevo producto"}
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Nombre</label>
              <input
                type="text"
                name="nombre"
                className="form-control"
                value={form.nombre}
                onChange={handleChange}
                placeholder="Ej. Teclado Mecánico RGB"
                required
              />
            </div>

            <div className="col-md-3">
              <label className="form-label">Precio (CLP)</label>
              <input
                type="number"
                name="precio"
                className="form-control"
                value={form.precio}
                onChange={handleChange}
                min="1"
                required
              />
            </div>

            <div className="col-md-3">
              <label className="form-label">Stock</label>
              <input
                type="number"
                name="stock"
                className="form-control"
                value={form.stock}
                onChange={handleChange}
                min="0"
                required
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Categoría</label>
              <input
                type="text"
                name="categoria"
                className="form-control"
                value={form.categoria}
                onChange={handleChange}
                placeholder="Ej. Periféricos"
                required
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Marca</label>
              <input
                type="text"
                name="marca"
                className="form-control"
                value={form.marca}
                onChange={handleChange}
                placeholder="Ej. ASUS"
                required
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Ruta de imagen (opcional)</label>
              <input
                type="text"
                name="imagen"
                className="form-control"
                value={form.imagen}
                onChange={handleChange}
                placeholder="/teclado.png"
              />
            </div>

            <div className="col-12 d-flex gap-2">
              <button type="submit" className="btn btn-primary" disabled={enviando}>
                {enviando
                  ? "Guardando..."
                  : editandoId !== null
                  ? "Guardar cambios"
                  : "Crear producto"}
              </button>
              {editandoId !== null && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={cancelarEdicion}
                  disabled={enviando}
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-header fw-bold">Productos en base de datos</div>
        <div className="card-body p-0">
          {cargando ? (
            <div className="p-4 text-center">Cargando productos...</div>
          ) : productos.length === 0 ? (
            <div className="p-4 text-center text-muted">No hay productos registrados.</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover align-middle mb-0">
                <thead className="table-dark">
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Categoría</th>
                    <th>Marca</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th className="text-end">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.map((p) => (
                    <tr key={p.id}>
                      <td>{p.id}</td>
                      <td>{p.nombre}</td>
                      <td>{p.categoria}</td>
                      <td>{p.marca}</td>
                      <td>${Number(p.precio).toLocaleString("es-CL")}</td>
                      <td>
                        <span className={`badge ${p.stock > 0 ? "bg-success" : "bg-danger"}`}>
                          {p.stock}
                        </span>
                      </td>
                      <td className="text-end">
                        <button
                          type="button"
                          className="btn btn-sm btn-warning me-2"
                          onClick={() => iniciarEdicion(p)}
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-danger"
                          onClick={() => handleEliminar(p.id, p.nombre)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}