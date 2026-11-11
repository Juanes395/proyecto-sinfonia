import React from "react";
import "./TarjetaPista.css";

function PortadaSvg({ portada }) {
  if (!portada) return null;
  const { patron, fondo, figura, detalle = "#FFFFFF" } = portada;

  return (
    <svg viewBox="0 0 176 176" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect width="176" height="176" rx="12" fill={fondo} />
      {patron === 0 && (
        <>
          <circle cx="176" cy="176" r="150" fill={figura} />
          <circle cx="176" cy="176" r="110" fill={fondo} />
          <circle cx="176" cy="176" r="70" fill={figura} />
        </>
      )}
      {patron === 1 && (
        <>
          <rect x="-60" y="70" width="320" height="20" transform="rotate(-35 -60 70)" fill={figura} />
          <rect x="-54" y="116" width="320" height="20" transform="rotate(-35 -54 116)" fill={figura} />
          <rect x="-48" y="162" width="320" height="20" transform="rotate(-35 -48 162)" fill={figura} />
          <rect x="-42" y="208" width="320" height="20" transform="rotate(-35 -42 208)" fill={figura} />
        </>
      )}
      {patron === 2 && (
        <>
          <circle cx="88" cy="152" r="60" fill={figura} />
          <circle cx="135" cy="41" r="19" fill={detalle} />
        </>
      )}
      {patron === 3 && (
        <>
          <circle cx="40" cy="40" r="16" fill={detalle} />
          <circle cx="40" cy="88" r="16" fill={figura} />
          <circle cx="40" cy="136" r="16" fill={detalle} />
          <circle cx="88" cy="40" r="16" fill={figura} />
          <circle cx="88" cy="88" r="16" fill={detalle} />
          <circle cx="88" cy="136" r="16" fill={figura} />
          <circle cx="136" cy="40" r="16" fill={detalle} />
          <circle cx="136" cy="88" r="16" fill={figura} />
          <circle cx="136" cy="136" r="16" fill={detalle} />
        </>
      )}
    </svg>
  );
}
// El componente recibe:
// - pista: objeto con datos de la pista ({ id, titulo, artista, duracion })
// - indice: número de orden para rotar la paleta de colores oficial
export default function TarjetaPista({ pista, indice = 0 }) {


  // Se obtiene el nombre del artista verificando si viene como objeto { id, nombre } o texto
  const nombreArtista = pista?.artista?.nombre ?? pista?.artista ?? "";

  return (
    <article className="tarjeta-pista" tabIndex="0">
      {/* Portada abstracta sin fotografías */}
      <div className="tarjeta-pista-portada" aria-hidden="true">
        <PortadaSvg portada={pista?.portada} />
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