import React from "react";
import "./EstadoUI.css";

// Esqueleto de carga reutilizable para grillas (generos | albumes | lista)
// Respeta accesibilidad con aria-busy y aria-label desde la API
export function EsqueletoSeccion({ tipo = "albumes", cantidad = 6, ariaLabel }) {
  const items = Array.from({ length: cantidad });

  return (
    <div
      className={`estado-esqueleto-contenedor estado-esqueleto--${tipo}`}
      role="status"
      aria-busy="true"
      aria-label={ariaLabel}
    >
      {items.map((_, indice) => (
        <div key={indice} className={`estado-esqueleto-item estado-esqueleto-item--${tipo}`}>
          {tipo === "albumes" && (
            <>
              <div className="estado-shimmer estado-shimmer-portada" />
              <div className="estado-shimmer estado-shimmer-linea" />
              <div className="estado-shimmer estado-shimmer-linea corta" />
            </>
          )}
          {tipo === "generos" && (
            <div className="estado-shimmer estado-shimmer-genero" />
          )}
          {tipo === "lista" && (
            <div className="estado-shimmer estado-shimmer-fila" />
          )}
        </div>
      ))}
    </div>
  );
}

// Tarjeta de estado vacío reutilizable
export function EstadoVacio({ titulo, descripcion }) {
  return (
    <div className="estado-caja estado-caja--vacio" role="status">
      {titulo && <h3 className="estado-caja-titulo titular-h3">{titulo}</h3>}
      {descripcion && <p className="estado-caja-texto cuerpo-m">{descripcion}</p>}
    </div>
  );
}

// Tarjeta de error con botón Reintentar conectada a textos.estados.error
export function EstadoError({ textos, descripcionPersonalizada, onReintentar }) {
  const tError = textos?.estados?.error;

  return (
    <div className="estado-caja estado-caja--error" role="alert">
      {tError?.titulo && (
        <h3 className="estado-caja-titulo titular-h3">{tError.titulo}</h3>
      )}
      <p className="estado-caja-texto cuerpo-m">
        {descripcionPersonalizada || tError?.descripcion}
      </p>
      {onReintentar && tError?.botones?.reintentar && (
        <button
          type="button"
          className="estado-btn-reintentar"
          onClick={onReintentar}
        >
          {tError.botones.reintentar}
        </button>
      )}
    </div>
  );
}