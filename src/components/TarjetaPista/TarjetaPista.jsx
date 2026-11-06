import React from "react";
import "./TarjetaPista.css";

const COLORES_PORTADA = [
  "var(--portada-3)",
  "var(--portada-5)",
  "var(--portada-4)",
  "var(--portada-6)",
  "var(--portada-2)",
  "var(--portada-1)",
];

// El componente recibe:
// - pista: objeto con datos de la pista ({ id, titulo, artista, duracion })
// - indice: número de orden para rotar la paleta de colores oficial
export default function TarjetaPista({ pista, indice = 0 }) {
  // Se calcula el color de la portada usando el operador módulo %
  const colorFondo = COLORES_PORTADA[indice % COLORES_PORTADA.length];

  // Se obtiene el nombre del artista verificando si viene como objeto { id, nombre } o texto
  const nombreArtista = pista?.artista?.nombre ?? pista?.artista ?? "";

  return (
    <article className="tarjeta-pista" tabIndex="0">
      {/* Portada abstracta sin fotografías */}
      <div
        className="tarjeta-pista-portada"
        style={{ backgroundColor: colorFondo }}
        aria-hidden="true"
      >
        <div className="tarjeta-pista-adorno" />
      </div>

      {/* Información textual de la pista */}
      <div className="tarjeta-pista-info">
        <h3 className="tarjeta-pista-titulo titular-h4" title={pista?.titulo}>
          {pista?.titulo}
        </h3>
        <p className="tarjeta-pista-artista cuerpo-p" title={nombreArtista}>
          {nombreArtista}
        </p>

        {/* Duración de la pista si viene provista en la API */}
        {pista?.duracion && (
          <span className="tarjeta-pista-duracion detalle-nota">
            {pista.duracion}
          </span>
        )}
      </div>
    </article>
  );
}