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
