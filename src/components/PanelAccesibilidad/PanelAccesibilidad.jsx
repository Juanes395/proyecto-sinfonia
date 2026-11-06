import React, { useEffect } from "react";
import Icono from "../Icono.jsx";
import "./PanelAccesibilidad.css";

// Opciones de porcentaje para el control "Tamaño del texto"
const ESCALAS_TEXTO = [90, 100, 110, 120];

// El componente recibe:
// - textos: objeto global de textos de la API
// - abierto: booleano que indica si el panel se muestra
// - onCerrar: función para cerrar el panel
// - preferencias: objeto con el estado actual ({ tamanoTexto, altoContraste, reducirMovimiento, subrayarEnlaces, espaciado })
// - onCambiar: función para actualizar cualquiera de las preferencias
// - onRestablecer: función para volver a los valores iniciales (100% y todo apagado)
export default function PanelAccesibilidad({
  textos,
  abierto,
  onCerrar,
  preferencias,
  onCambiar,
  onRestablecer,
}) {
  // Extraemos la sección "accesibilidad" del JSON de la API
  const t = textos?.accesibilidad;

  // Permite cerrar el panel presionando la tecla Escape
  useEffect(() => {
    function manejarEscape(e) {
      if (e.key === "Escape" && abierto) {
        onCerrar();
      }
    }
    document.addEventListener("keydown", manejarEscape);
    return () => document.removeEventListener("keydown", manejarEscape);
  }, [abierto, onCerrar]);

  // Si no está abierto, no renderizamos nada
  if (!abierto) return null;

  // Funciones para disminuir o aumentar el porcentaje de texto
  const indiceActual = ESCALAS_TEXTO.indexOf(preferencias.tamanoTexto);

  function reducirTexto() {
    if (indiceActual > 0) {
      onCambiar("tamanoTexto", ESCALAS_TEXTO[indiceActual - 1]);
    }
  }

  function aumentarTexto() {
    if (indiceActual < ESCALAS_TEXTO.length - 1) {
      onCambiar("tamanoTexto", ESCALAS_TEXTO[indiceActual + 1]);
    }
  }

  // Reemplaza "{valor}" por el número actual (ej. "100 %")
  const textoPorcentaje = (t?.tamanoTexto?.valor || "{valor} %").replace(
    "{valor}",
    preferencias.tamanoTexto
  );

  // Lista de los 4 interruptores exactamente como aparecen en el Figma
  const interruptores = [
    {
      clave: "altoContraste",
      etiqueta: t?.altoContraste?.etiqueta,
      ayuda: t?.altoContraste?.ayuda,
    },
    {
      clave: "reducirMovimiento",
      etiqueta: t?.reducirMovimiento?.etiqueta,
      ayuda: t?.reducirMovimiento?.ayuda,
    },
    {
      clave: "subrayarEnlaces",
      etiqueta: t?.subrayarEnlaces?.etiqueta,
      ayuda: t?.subrayarEnlaces?.ayuda,
    },
    {
      clave: "espaciado",
      etiqueta: t?.espaciado?.etiqueta,
      ayuda: t?.espaciado?.ayuda,
    },
  ];

  return (
    <div
      className="panel-acc-fondo"
      onClick={onCerrar}
      role="presentation"
    >
      {/* Contenedor del diálogo flotante tal cual la captura de Figma */}
      <div
        className="panel-acc-dialogo"
        role="dialog"
        aria-modal="true"
        aria-labelledby="panel-acc-titulo"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. ENCABEZADO: Título "Accesibilidad" y botón cerrar (X) */}
        <div className="panel-acc-encabezado">
          <h2 id="panel-acc-titulo" className="panel-acc-titulo titular-h3">
            {t?.titulo}
          </h2>
          <button
            type="button"
            className="panel-acc-cerrar"
            aria-label={t?.aria?.cerrar}
            onClick={onCerrar}
          >
            <Icono nombre="cerrar" />
          </button>
        </div>

        {/* 2. CONTROL DE TAMAÑO DEL TEXTO (- 100 % +) */}
        <div className="panel-acc-bloque-tamano">
          <span className="panel-acc-subtitulo cuerpo-p-fuerte">
            {t?.tamanoTexto?.etiqueta}
          </span>
          <div className="panel-acc-control-tamano">
            <button
              type="button"
              className="panel-acc-btn-tamano"
              aria-label={t?.tamanoTexto?.reducir}
              disabled={indiceActual <= 0}
              onClick={reducirTexto}
            >
              −
            </button>
            <span className="panel-acc-valor-tamano cuerpo-p-fuerte" aria-live="polite">
              {textoPorcentaje}
            </span>
            <button
              type="button"
              className="panel-acc-btn-tamano"
              aria-label={t?.tamanoTexto?.aumentar}
              disabled={indiceActual >= ESCALAS_TEXTO.length - 1}
              onClick={aumentarTexto}
            >
              +
            </button>
          </div>
        </div>

        {/* 3. LISTA DE LOS 4 INTERRUPTORES (Switches) */}
        <div className="panel-acc-lista-switches">
          {interruptores.map((item) => {
            const activo = Boolean(preferencias[item.clave]);
            return (
              <div key={item.clave} className="panel-acc-fila-switch">
                <div className="panel-acc-textos-switch">
                  <span className="panel-acc-etiqueta cuerpo-p-fuerte">
                    {item.etiqueta}
                  </span>
                  <span className="panel-acc-ayuda detalle-nota">
                    {item.ayuda}
                  </span>
                </div>

                {/* Botón switch accesible */}
                <button
                  type="button"
                  role="switch"
                  aria-checked={activo}
                  aria-label={item.etiqueta}
                  className={`panel-acc-switch${activo ? " is-activo" : ""}`}
                  onClick={() => onCambiar(item.clave, !activo)}
                >
                  <span className="panel-acc-switch-circulo" />
                </button>
              </div>
            );
          })}
        </div>

        {/* 4. NOTA INFORMATIVA */}
        <p className="panel-acc-nota detalle-nota">
          {t?.mensajes?.nota}
        </p>

        {/* 5. PIE DEL PANEL: Enlace verde y botón Restablecer */}
        <div className="panel-acc-pie">
          <a
            href="#accesibilidad"
            className="panel-acc-enlace detalle-nota-fuerte"
            onClick={(e) => {
              e.preventDefault();
              onCerrar();
            }}
          >
            {t?.enlaces?.declaracion}
          </a>

          <button
            type="button"
            className="panel-acc-btn-restablecer detalle-nota-fuerte"
            onClick={onRestablecer}
          >
            {t?.botones?.restablecer}
          </button>
        </div>
      </div>
    </div>
  );
}
