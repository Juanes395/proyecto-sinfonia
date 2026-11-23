const API_BASE = import.meta.env.VITE_API_URL;

// Función para obtener la lista general de géneros musicales (GET /generos)
export async function obtenerGeneros(signal) {
  const respuesta = await fetch(`${API_BASE}/generos`, { signal });
  // Si el servidor responde con error, lanzamos una excepción
  if (!respuesta.ok) {
    throw new Error(`Error al cargar géneros: HTTP ${respuesta.status}`);
  }
  // Convertimos a JSON y devolvemos la propiedad 'generos' del backend
  const json = await respuesta.json();
  if (Array.isArray(json)) return json;
  if (Array.isArray(json?.datos)) return json.datos;
  if (Array.isArray(json?.generos)) return json.generos;
  return [];
}

// Función para obtener el detalle de un género específico con sus álbumes y pistas (GET /generos/:id)
export async function obtenerGeneroPorId(id, signal) {
  const respuesta = await fetch(`${API_BASE}/generos/${id}`, { signal });
  if (!respuesta.ok) {
    throw new Error(`Error al cargar género ${id}: HTTP ${respuesta.status}`);
  }
  const json = await respuesta.json();
  return json?.datos ?? json?.genero ?? json;
}
// Función para obtener los álbumes populares (GET /albumes?orden=populares&limite=6)
export async function obtenerAlbumesPopulares(signal) {
  const respuesta = await fetch(`${API_BASE}/albumes?orden=populares&limite=6`, { signal });
  if (!respuesta.ok) {
    throw new Error(`Error al cargar álbumes populares: HTTP ${respuesta.status}`);
  }
  const json = await respuesta.json();
  if (Array.isArray(json)) return json;
  if (Array.isArray(json?.datos)) return json.datos;
  return [];
}

// Función para obtener el detalle completo de un álbum (GET /albumes/:id)
export async function obtenerAlbumPorId(id, signal) {
  const respuesta = await fetch(`${API_BASE}/albumes/${id}`, { signal });

  if (respuesta.status === 404) {
    const error = new Error("Álbum no encontrado");
    error.status = 404;
    error.codigo = "no_encontrado";
    throw error;
  }

  if (!respuesta.ok) {
    const error = new Error(`Error al cargar álbum ${id}: HTTP ${respuesta.status}`);
    error.status = respuesta.status;
    throw error;
  }

  const json = await respuesta.json();
  return json?.datos ?? json?.album ?? json;
}
// Función para iniciar sesión con correo y contraseña (POST /sesion)
export async function iniciarSesion({ correo, clave }, signal) {
  const respuesta = await fetch(`${API_BASE}/sesion`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ correo, clave }),
    signal,
  });

  // Intentamos leer el cuerpo JSON (tanto en éxito como en errores 401/422/429)
  let datos = null;
  try {
    datos = await respuesta.json();
  } catch {
    datos = null;
  }

  if (!respuesta.ok) {
    const error = new Error(datos?.mensaje || `Error HTTP ${respuesta.status}`);
    error.status = respuesta.status;
    error.codigo = datos?.codigo || null;
    error.campos = datos?.campos || null;
    // Leemos la cabecera Retry-After (en segundos) para el manejo de 429
    const retryHeader = respuesta.headers.get("Retry-After");
    error.retryAfter = retryHeader ? Number(retryHeader) : null;
    throw error;
  }

  // Devuelve { usuario, token } según el contrato de POST /sesion
  return datos;
}
// Obtiene la cuenta de la sesión actual (GET /sesion)
export async function obtenerSesionActual(token, signal) {
  const headers = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const respuesta = await fetch(`${API_BASE}/sesion`, {
    method: "GET",
    headers,
    credentials: "include",
    signal,
  });
  // 401 significa que no hay sesión activa o el token venció
  if (respuesta.status === 401) {
    const error = new Error("No autenticado");
    error.status = 401;
    throw error;
  }
  if (!respuesta.ok) {
    const error = new Error(`Error al verificar sesión: HTTP ${respuesta.status}`);
    error.status = respuesta.status;
    throw error;
  }
  // La API devuelve directamente el objeto de usuario sin envolver
  return respuesta.json();
}

// Cierra la sesión en el servidor y borra su cookie (DELETE /sesion)
export async function cerrarSesionApi(token) {
  const headers = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const respuesta = await fetch(`${API_BASE}/sesion`, {
    method: "DELETE",
    headers,
    credentials: "include",
  });
  // 204 indica cierre exitoso (no trae cuerpo JSON)
  if (!respuesta.ok && respuesta.status !== 204) {
    throw new Error(`Error al cerrar sesión: HTTP ${respuesta.status}`);
  }
}