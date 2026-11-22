import React from "react";

// Componente reutilizable que dibuja las portadas geométricas de Sintonía
// a partir del objeto `portada` que entrega la API ({ patron, fondo, figura, detalle })
export default function PortadaSvg({ portada, className = "" }) {
  if (!portada) return null;
  const { patron, fondo, figura, detalle = "#FFFFFF" } = portada;

  return (
    <svg
      viewBox="0 0 176 176"
      width="100%"
      height="100%"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect width="176" height="176" rx="12" fill={fondo} />

      {/* Patrón 0: anillos */}
      {patron === 0 && (
        <>
          <circle cx="176" cy="176" r="150" fill={figura} />
          <circle cx="176" cy="176" r="110" fill={fondo} />
          <circle cx="176" cy="176" r="70" fill={figura} />
        </>
      )}

      {/* Patrón 1: rayas */}
      {patron === 1 && (
        <>
          <rect x="-60" y="70" width="320" height="20" transform="rotate(-35 -60 70)" fill={figura} />
          <rect x="-54" y="116" width="320" height="20" transform="rotate(-35 -54 116)" fill={figura} />
          <rect x="-48" y="162" width="320" height="20" transform="rotate(-35 -48 162)" fill={figura} />
          <rect x="-42" y="208" width="320" height="20" transform="rotate(-35 -42 208)" fill={figura} />
        </>
      )}

      {/* Patrón 2: colina */}
      {patron === 2 && (
        <>
          <circle cx="88" cy="152" r="60" fill={figura} />
          <circle cx="135" cy="41" r="19" fill={detalle} />
        </>
      )}

      {/* Patrón 3: puntos */}
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