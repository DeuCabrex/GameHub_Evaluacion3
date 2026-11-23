# 🎮 GameHub Store — Plataforma E-Commerce Full-Stack

**GameHub Store** es una tienda en línea especializada en hardware, periféricos, notebooks y consolas gamer, desarrollada como proyecto Full-Stack con arquitectura desacoplada y despliegue continuo en la nube.

---

## 🔗 Accesos Rápidos (Checklist de Presentación)

Haz clic en estos enlaces antes o durante la presentación para verificar que los servicios estén activos y en orden:

* 🌐 **Tienda Pública (Frontend en Vercel):** [https://game-hub-store-duoc.vercel.app](https://game-hub-store-duoc.vercel.app)
* ⚙️ **API Backend (Endpoint de Productos en Render):** [https://gamehub-backend-evaluacion3.onrender.com/api/productos](https://gamehub-backend-evaluacion3.onrender.com/api/productos) *(Nota: si el servidor gratuito entró en reposo, la primera carga puede tardar ~50 segundos en despertar).*
* 🖥️ **Panel de Control Render (Logs y Variables):** [https://dashboard.render.com/web/srv-dc1oh059fdbs73bdun40](https://dashboard.render.com/web/srv-dc1oh059fdbs73bdun40)
* ▲ **Panel de Control Vercel (Variables y Deployments):** [https://vercel.com/becabrerad-6514s-projects/game-hub-evaluacion3/settings/environment-variables](https://vercel.com/becabrerad-6514s-projects/game-hub-evaluacion3/settings/environment-variables)

---

## 🛠️ Arquitectura y Tecnologías

| Capa | Tecnología | Alojamiento |
| :--- | :--- | :--- |
| **Frontend** | React + Vite + Bootstrap 5 | Vercel |
| **Backend** | Java + Spring Boot + Spring Security (JWT) + Docker | Render |
| **Base de Datos** | PostgreSQL | Supabase |

---

## 💻 Qué se implementó en el código

### 1. Frontend (`React + Vite`)
* **Catálogo Dinámico (`Catalogo.jsx`):**
  * Consumo de productos en tiempo real desde la API REST (`VITE_API_URL`).
  * Filtrado por categoría dinámico, ordenamiento (alfabético y por precio) y filtro de **Precio Máximo** opcional (muestra todo el catálogo por defecto y filtra solo al ingresar un monto).
* **Carrito y Órdenes de Compra (`CarritoContext.jsx`):**
  * Gestión global del carrito de compras con control de stock disponible y generación de órdenes asociadas al usuario autenticado.
* **Autenticación y Roles (`AuthContext.jsx`):**
  * Inicio de sesión y registro con manejo de tokens **JWT** almacenados en sesión.
  * Protección de rutas administrativas según el rol del usuario (`ADMIN` vs `CLIENTE`).
* **Panel de Administración (`AdminProductos.jsx`):**
  * Operaciones **CRUD** completas (Crear, Leer, Actualizar y Eliminar productos) conectadas a Supabase.
  * Selector desplegable (`<select>`) estandarizado de categorías que combina categorías base con las existentes en la base de datos.
* **Identidad Visual (`index.html`):**
  * Título personalizado (`GameHub Store`) y favicon corporativo en la pestaña del navegador.

### 2. Backend (`Spring Boot + Docker`)
* **API RESTful:** Controladores para autenticación (`/api/auth`), gestión de productos (`/api/productos`) y órdenes de compra (`/api/ordenes`).
* **Seguridad y CORS:** Configuración de Spring Security con validación de tokens JWT y política **CORS** parametrizada mediante la variable de entorno `CORS_ORIGENES` para permitir peticiones seguras desde Vercel.
* **Contenerización:** `Dockerfile` multi-etapa configurado para compilar el `.jar` con Maven y ejecutarlo en Render conectado al pooler de Supabase.

---

## ✅ Protocolo rápido antes de presentar

1. **Despertar el Backend:** Abre el enlace de la API en Render (~1 minuto antes de exponer) hasta ver el JSON con los productos.
2. **Verificar la Tienda:** Abre [https://game-hub-store-duoc.vercel.app](https://game-hub-store-duoc.vercel.app) y confirma que cargan las tarjetas de productos.
3. **Probar Flujo Admin / Compra:** Inicia sesión con `admin@gmail.com` para mostrar el panel **Admin** y el flujo completo de compra en el **Carrito**.