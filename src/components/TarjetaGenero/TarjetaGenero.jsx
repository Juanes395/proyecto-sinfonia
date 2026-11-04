import React from "react";
import "./TarjetaGenero.css";

// Mapeo de colores y adornos según el ID del género o índice para replicar Figma
const COLORES_GENERO = [
  "var(--portada-3)", // Pop (verde azulado)
  "var(--portada-2)", // Indie (coral / naranja rojizo)
  "var(--portada-1)", // Rock (morado / violeta)
  "var(--portada-6)", // Electrónica (azul vibrante)
  "var(--portada-5)", // Salsa (magenta / rosado)
  "var(--portada-4)", // Tropical (amarillo mostaza)
  "var(--portada-1)", // Música andina (morado lavanda)
  "var(--portada-3)", // Folk (verde esmeralda)
];

// El componente recibe:
// - genero: objeto con los datos del género ({ id, nombre, descripcion })
// - indice: posición en la lista para asignarle color y patrón decorativo
// - onSeleccionar: callback para navegar al catálogo con ese género filtrado
export default function TarjetaGenero({ genero, indice = 0, onSeleccionar }) {
  // se asigna un color rotativo usando el índice, evita que si hay mas generos que colores en un futuro este se rompa
  const fondo = COLORES_GENERO[indice % COLORES_GENERO.length];

  return (
    // Enlace accesible con rol interactivo y estilos visuales basados en tokens
    <a
      href={`#catalogo?genero=${genero.id}`}
      className="tarjeta-genero"
      style={{ backgroundColor: fondo }}
      onClick={(e) => {
        e.preventDefault();
        if (onSeleccionar) {
          onSeleccionar(genero.id);
        }
      }}
    >
      {/* Nombre del género con tipografía Syne en negrita */}
      <span className="tarjeta-genero-nombre">{genero.nombre}</span>

      {/* Ilustración geométrica decorativa de fondo (cero fotos) */}
      <span className="tarjeta-genero-adorno" aria-hidden="true" />
    </a>
  );
}
