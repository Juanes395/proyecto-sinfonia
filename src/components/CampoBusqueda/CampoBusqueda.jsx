import React, { useRef } from "react";
import Icono from "../Icono.jsx";
import "./CampoBusqueda.css";

// El componente recibe:
// - valor: texto actual del input
// - onChange: función que actualiza el texto de búsqueda
// - placeholder: texto de ayuda traducido proveniente de la API
// - etiquetaBorrar: texto para el botón de limpiar
export default function CampoBusqueda({ valor, onChange, placeholder, etiquetaBorrar }) {
  const inputRef = useRef(null);

  function limpiar() {
    onChange("");
    inputRef.current?.focus();
  }

  return (
    <div className="campo-busqueda-contenedor">
      {/* Icono de búsqueda visual accesible */}
      <span className="campo-busqueda-icono" aria-hidden="true">
        <Icono nombre="buscar" />
      </span>

      {/* Input de texto accesible */}
      <input
        ref={inputRef}
        type="search"
        className="campo-busqueda-input cuerpo-m"
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
      />

      {/* Botón para limpiar cuando hay texto escrito */}
      {valor && (
        <button
          type="button"
          className="campo-busqueda-btn-limpiar"
          onClick={limpiar}
          aria-label="Borrar búsqueda"
        >
          <Icono nombre="cerrar" />
        </button>
      )}
    </div>
  );
}