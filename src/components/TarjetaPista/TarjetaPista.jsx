import PortadaSvg from "../PortadaSvg/PortadaSvg.jsx";
import "./TarjetaPista.css";
// El componente recibe:
// - pista: objeto con datos de la pista ({ id, titulo, artista, duracion })
export default function TarjetaPista({ pista, onSeleccionar }) {


  // Se obtiene el nombre del artista verificando si viene como objeto { id, nombre } o texto
  const nombreArtista = pista?.artista?.nombre ?? pista?.artista ?? "";
  function manejarClic() {
    if (onSeleccionar) onSeleccionar(pista);
  }

  function manejarTecla(e) {
    if (onSeleccionar && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      onSeleccionar(pista);
    }
  }

  return (
    <article className="tarjeta-pista" tabIndex="0" role={onSeleccionar ? "button" : undefined} onClick={manejarClic} onKeyDown={manejarTecla}>
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