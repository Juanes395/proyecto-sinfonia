import React from "react";
import Icono from "../Icono.jsx";
import "./Footer.css";

export default function Footer({ textos, onNavegar, onAbrirAccesibilidad }) {
  // Extraemos la sección 'footer' provista por la API de textos
  const f = textos?.footer;

  // Obtenemos el año en curso dinámicamente mediante el objeto Date de JavaScript
  const anioActual = new Date().getFullYear();

  // Tomamos la plantilla de derechos de la API y reemplazamos la variable "{anio}" por el año real
  // Si la API aún no ha cargado, usamos un string vacío para no romper la renderización
  const textoDerechos = f?.legal?.derechos
    ? f.legal.derechos.replace("{anio}", anioActual)
    : "";

  // Función auxiliar interna para gestionar la navegación por anclas/secciones
  function manejarClickEnlace(e, destino) {
    // Si se pasa un callback onNavegar desde App.jsx, lo ejecutamos
    if (onNavegar) {
      onNavegar(destino);
    }
  }

  return (
    // Etiqueta semántica <footer> 
    <footer className="foot">
      {/* Contenedor central con ancho máximo y márgenes automáticos */}
      <div className="foot-interior">
        
        {/* Bloque superior del footer: Marca a la izquierda y Columnas a la derecha */}
        <div className="foot-principal">
          
          {/* Bloque de identidad: Logo y lema descriptivo */}
          <div className="foot-identidad">
            {/* Enlace del logo que redirige a la vista inicial */}
            <a
              className="foot-marca"
              href="#inicio"
              aria-label={textos?.navbar?.logo?.aria}
              onClick={(e) => manejarClickEnlace(e, "inicio")}
            >
              <Icono nombre="logo" />
            </a>
            {/* Lema descriptivo proveniente directamente de la API */}
            {f?.lema && <p className="foot-lema">{f.lema}</p>}
          </div>

          {/* Grilla con las tres columnas de enlaces  */}
          <div className="foot-columnas">
            
            {/* Columna 1: Explora */}
            <div className="foot-columna">
              {/* Título de la columna usando nivel semántico h4 */}
              <h4 className="foot-columna-titulo">{f?.columnas?.explora?.titulo}</h4>
              <ul className="foot-enlaces">
                <li>
                  <a
                    href="#inicio"
                    onClick={(e) => manejarClickEnlace(e, "inicio")}
                  >
                    {f?.columnas?.explora?.enlaces?.inicio}
                  </a>
                </li>
                <li>
                  <a
                    href="#catalogo"
                    onClick={(e) => manejarClickEnlace(e, "catalogo")}
                  >
                    {f?.columnas?.explora?.enlaces?.catalogo}
                  </a>
                </li>
              </ul>
            </div>

            {/* Columna 2: Tu cuenta */}
            <div className="foot-columna">
              <h4 className="foot-columna-titulo">{f?.columnas?.cuenta?.titulo}</h4>
              <ul className="foot-enlaces">
                <li>
                  <a
                    href="#ingresar"
                    onClick={(e) => manejarClickEnlace(e, "ingresar")}
                  >
                    {f?.columnas?.cuenta?.enlaces?.ingresar}
                  </a>
                </li>
                <li>
                  <a
                    href="#crear-cuenta"
                    onClick={(e) => manejarClickEnlace(e, "crear-cuenta")}
                  >
                    {f?.columnas?.cuenta?.enlaces?.crearCuenta}
                  </a>
                </li>
              </ul>
            </div>

            {/* Columna 3: Legal */}
            <div className="foot-columna">
              <h4 className="foot-columna-titulo">{f?.columnas?.legal?.titulo}</h4>
              <ul className="foot-enlaces">
                <li>
                  <a
                    href="#terminos"
                    onClick={(e) => manejarClickEnlace(e, "terminos")}
                  >
                    {f?.columnas?.legal?.enlaces?.terminos}
                  </a>
                </li>
                <li>
                  {/* El enlace de accesibilidad activa el modal al hacer clic */}
                  <button
                    type="button"
                    className="foot-boton-enlace"
                    onClick={() => {
                      if (onAbrirAccesibilidad) onAbrirAccesibilidad();
                    }}
                  >
                    {f?.columnas?.legal?.enlaces?.accesibilidad}
                  </button>
                </li>
              </ul>
            </div>

          </div>
        </div>

        {/* Separador horizontal sutil */}
        <hr className="foot-divisor" />

        {/* Bloque inferior: Información legal y créditos académicos */}
        <div className="foot-inferior">
          {textoDerechos && <p className="foot-derechos">{textoDerechos}</p>}
          {f?.legal?.nota && <p className="foot-nota">{f.legal.nota}</p>}
        </div>

      </div>
    </footer>
  );
}