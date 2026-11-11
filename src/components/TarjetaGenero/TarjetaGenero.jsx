import React from "react";
import "./TarjetaGenero.css";



// El componente recibe:
// - genero: objeto con los datos del género ({ id, nombre, descripcion })
// - indice: posición en la lista para asignarle color y patrón decorativo
// - activa: booleano para indicar si la tarjeta está seleccionada
// - ariaSeleccionado: booleano para indicar si la tarjeta está seleccionada para accesibilidad
// - onSeleccionar: callback para navegar al catálogo con ese género filtrado
export default function TarjetaGenero({ genero, activa= false, ariaSeleccionado, onSeleccionar }) {
  const portada = genero?.portada;
  return (
    // Enlace accesible con rol interactivo y estilos visuales basados en tokens
    <a
      href={`#catalogo?genero=${genero.id}`}
      className={`tarjeta-genero${activa ? " is-activa" : ""}`}
      style={{ backgroundColor: portada?.fondo  }}
      aria-current={activa ? "true" : undefined}
      aria-label={activa && ariaSeleccionado ? `${genero.nombre} (${ariaSeleccionado})` : undefined}
      onClick={(e) => {
        e.preventDefault();
        if (onSeleccionar) {
          onSeleccionar(genero.id);
        }
      }}
    >
      {/* Nombre del género con tipografía Syne en negrita */}
      <span className="tarjeta-genero-nombre">{genero.nombre}</span>

      {/* Ilustración geométrica decorativa de fondo */}
      <span
        className="tarjeta-genero-adorno"
        style={{ backgroundColor: portada?.figura }}
        aria-hidden="true"
      />
    </a>
  );
}
