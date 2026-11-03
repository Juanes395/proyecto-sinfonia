import React, { useEffect, useRef } from "react";
import { guardarCookie } from "../../utils/cookies.js";
import "./AvisoCookies.css";


// - textos: objeto global de la API 
// - onResponder: callback para notificar a App.jsx si se aceptó o rechazó
export default function AvisoCookies({ textos, onResponder }) {
  // Referencia al contenedor del aviso para gestionar el foco accesible
  const contenedorRef = useRef(null);

  // Se extraen exclusivamente los textos del banner de cookies provistos por la API
  const banner = textos?.cookies?.banner;
  const titulo = banner?.titulo;
  const texto = banner?.texto;
  const txtRechazar = banner?.botones?.rechazar;
  const txtAceptar = banner?.botones?.aceptar;

  // Accesibilidad: al montarse el aviso, se traslada el foco al contenedor o al primer botón
  useEffect(() => {
    if (contenedorRef.current) {
      contenedorRef.current.focus();
    }
  }, []);

  // Función interna para procesar la respuesta del usuario
  function responder(decision) {
    // Se guarda la decisión en la cookie obligatoria 'consentimiento' 
    guardarCookie("consentimiento", decision);

    // Se notifica al componente App.jsx para ocultar el banner de inmediato
    if (onResponder) {
      onResponder(decision);
    }
  }

  // Si la API aún no ha devuelto los textos del banner, no se renderiza nada para evitar parpadeos
  if (!banner || !titulo) {
    return null;
  }

  return (
    <aside
      ref={contenedorRef}
      className="aviso-cookies"
      role="region"
      aria-labelledby="titulo-aviso-cookies"
      tabIndex="-1"
    >
      <div className="aviso-cookies-interior">
        {/* Bloque textual informativo */}
        <div className="aviso-cookies-contenido">
          <h3 id="titulo-aviso-cookies" className="aviso-cookies-titulo">
            {titulo}
          </h3>
          <p className="aviso-cookies-texto">
            {texto}
          </p>
        </div>

        {/* Bloque de botones: Aceptar y Rechazar con idéntico tamaño y peso visual */}
        <div className="aviso-cookies-acciones">
          {txtRechazar && (
            <button
              type="button"
              className="aviso-cookies-btn aviso-cookies-btn-rechazar"
              onClick={() => responder("rechazadas")}
            >
              {txtRechazar}
            </button>
          )}

          {txtAceptar && (
            <button
              type="button"
              className="aviso-cookies-btn aviso-cookies-btn-aceptar"
              onClick={() => responder("aceptadas")}
            >
              {txtAceptar}
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}