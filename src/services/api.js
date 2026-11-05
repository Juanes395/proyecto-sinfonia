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