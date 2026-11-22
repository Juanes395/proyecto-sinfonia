import React, { useEffect, useRef, useState } from "react";
import { iniciarSesion } from "../../services/api.js";
import PortadaSvg from "../PortadaSvg/PortadaSvg.jsx";
import Icono from "../Icono.jsx";
import "./IniciarSesion.css";

// Las 8 portadas geométricas exactas del panel derecho en Figma (y 3 en el collage móvil)
const PORTADAS_DECORATIVAS = [
  { patron: 2, fondo: "#2BC4B6", figura: "#0C0B10", detalle: "#FFFFFF" },
  { patron: 0, fondo: "#FF5FA2", figura: "#8E7BFF", detalle: "#FFFFFF" },
  { patron: 1, fondo: "#FF6B5E", figura: "#F5B544", detalle: "#FFFFFF" },
  { patron: 1, fondo: "#4C8DFF", figura: "#2BC4B6", detalle: "#FFFFFF" },
  { patron: 3, fondo: "#F5B544", figura: "#FF6B5E", detalle: "#FFFFFF" },
  { patron: 3, fondo: "#0C0B10", figura: "#FF5FA2", detalle: "#FFFFFF" },
  { patron: 0, fondo: "#2BC4B6", figura: "#F5B544", detalle: "#FFFFFF" },
  { patron: 2, fondo: "#4C8DFF", figura: "#FF5FA2", detalle: "#FFFFFF" },
];

export default function IniciarSesion({ textos, onNavegar, onSesionIniciada }) {
  const t = textos?.paginas?.ingresar;
  const f = t?.formulario;
  const eTextos = t?.errores;

  // Estados del formulario
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [mantenerSesion, setMantenerSesion] = useState(true);
  const [mostrarClave, setMostrarClave] = useState(false);

  // Estados de validación y envío
  const [errorCorreo, setErrorCorreo] = useState("");
  const [errorClave, setErrorClave] = useState("");
  const [alertaGeneral, setAlertaGeneral] = useState(null); // { titulo, texto }
  const [enviando, setEnviando] = useState(false);

  // Referencias para mover el foco al primer campo con error (accesibilidad)
  const correoRef = useRef(null);
  const claveRef = useRef(null);

  // Actualiza el título de la pestaña con SEO de la API
  useEffect(() => {
    if (t?.seo?.titulo) {
      document.title = t.seo.titulo;
    }
    return () => {
      document.title = textos?.sitio?.nombre || "Sintonía";
    };
  }, [t, textos]);

  async function manejarEnvio(evento) {
    evento.preventDefault();

    const correoLimpio = correo.trim();
    const errCorreo = !correoLimpio ? (eTextos?.correoObligatorio || "") : "";
    const errClave = !clave ? (eTextos?.claveObligatoria || "") : "";

    setErrorCorreo(errCorreo);
    setErrorClave(errClave);

    // Si falta algún campo obligatorio, mostramos la alerta y movemos el foco al primer error
    if (errCorreo || errClave) {
      setAlertaGeneral({
        titulo: eTextos?.camposObligatorios?.titulo,
        texto: eTextos?.camposObligatorios?.texto,
      });
      if (errCorreo) {
        correoRef.current?.focus();
      } else {
        claveRef.current?.focus();
      }
      return;
    }

    setAlertaGeneral(null);
    setEnviando(true);

    try {
      const resultado = await iniciarSesion({ correo: correoLimpio, clave });
      // Notificamos a App que la sesión fue iniciada (usuario, token y preferencia de recordar)
      if (onSesionIniciada) {
        onSesionIniciada({ ...resultado, mantenerSesion });
      }
      if (onNavegar) {
        onNavegar("inicio");
      }
    } catch (err) {
      // Manejo base de errores 
      if (err.status === 401) {
        setAlertaGeneral({
          titulo: eTextos?.credenciales?.titulo,
          texto: eTextos?.credenciales?.texto,
        });
      } else if (err.status === 422 && err.campos) {
        setErrorCorreo(err.campos.correo || "");
        setErrorClave(err.campos.clave || "");
        setAlertaGeneral({
          titulo: eTextos?.camposObligatorios?.titulo,
          texto: eTextos?.camposObligatorios?.texto,
        });
      } else {
        setAlertaGeneral({
          titulo: eTextos?.conexion?.titulo,
          texto: eTextos?.conexion?.texto,
        });
      }
    } finally {
      setEnviando(false);
    }
  }

  const textoDerechos = (textos?.footer?.legal?.derechos || "").replace(
    "{anio}",
    String(new Date().getFullYear())
  );

  return (
    <div className="ingreso-pagina">
      {/* COLUMNA IZQUIERDA: FORMULARIO */}
      <section className="ingreso-columna-form" aria-labelledby="titulo-ingresar">
        {/* Collage superior visible solo en móvil (390 px) */}
        <div className="ingreso-collage-movil" aria-hidden="true">
          <div className="collage-card collage-izq">
            <PortadaSvg portada={PORTADAS_DECORATIVAS[1]} />
          </div>
          <div className="collage-card collage-centro">
            <PortadaSvg portada={PORTADAS_DECORATIVAS[0]} />
          </div>
          <div className="collage-card collage-der">
            <PortadaSvg portada={PORTADAS_DECORATIVAS[2]} />
          </div>
        </div>

        {/* Logo clickeable para volver al inicio */}
        <a
          href="#inicio"
          className="ingreso-logo"
          aria-label={textos?.navbar?.logo?.aria}
          onClick={(e) => {
            e.preventDefault();
            onNavegar?.("inicio");
          }}
        >
          <Icono nombre="logo" />
        </a>

        <div className="ingreso-contenido">
          <header className="ingreso-encabezado">
            <h1 id="titulo-ingresar" className="ingreso-titulo titular-display">
              {f?.titulo}
            </h1>
            <p className="ingreso-subtitulo cuerpo-m">{f?.subtitulo}</p>
          </header>

          {/* Caja de alerta general (campos obligatorios / errores de ingreso) */}
          {alertaGeneral && (
            <div className="ingreso-alerta" role="alert">
              <span className="ingreso-alerta-icono">
                <Icono nombre="alerta" />
              </span>
              <div className="ingreso-alerta-textos">
                <strong className="ingreso-alerta-titulo">{alertaGeneral.titulo}</strong>
                <p className="ingreso-alerta-desc">{alertaGeneral.texto}</p>
              </div>
            </div>
          )}

          <form className="ingreso-form" onSubmit={manejarEnvio} noValidate>
            {/* Campo Correo electrónico */}
            <div className="ingreso-campo">
              <label htmlFor="ingreso-correo" className="ingreso-etiqueta">
                {f?.etiquetas?.correo}
              </label>
              <input
                ref={correoRef}
                id="ingreso-correo"
                name="correo"
                type="email"
                autoComplete="email"
                className={`ingreso-input${errorCorreo ? " is-error" : ""}`}
                placeholder={f?.placeholders?.correo}
                value={correo}
                onChange={(e) => {
                  setCorreo(e.target.value);
                  if (errorCorreo) setErrorCorreo("");
                }}
                aria-invalid={Boolean(errorCorreo)}
                aria-describedby={errorCorreo ? "error-correo" : undefined}
                disabled={enviando}
              />
              {errorCorreo && (
                <span id="error-correo" className="ingreso-error-campo">
                  {errorCorreo}
                </span>
              )}
            </div>

            {/* Campo Contraseña con botón de mostrar/ocultar */}
            <div className="ingreso-campo">
              <label htmlFor="ingreso-clave" className="ingreso-etiqueta">
                {f?.etiquetas?.clave}
              </label>
              <div className="ingreso-input-clave-wrap">
                <input
                  ref={claveRef}
                  id="ingreso-clave"
                  name="clave"
                  type={mostrarClave ? "text" : "password"}
                  autoComplete="current-password"
                  className={`ingreso-input ingreso-input--clave${errorClave ? " is-error" : ""}`}
                  value={clave}
                  onChange={(e) => {
                    setClave(e.target.value);
                    if (errorClave) setErrorClave("");
                  }}
                  aria-invalid={Boolean(errorClave)}
                  aria-describedby={errorClave ? "error-clave" : undefined}
                  disabled={enviando}
                />
                <button
                  type="button"
                  className="ingreso-btn-ojo"
                  onClick={() => setMostrarClave((v) => !v)}
                  aria-label={mostrarClave ? f?.botones?.ocultarClave : f?.botones?.mostrarClave}
                  aria-pressed={mostrarClave}
                  disabled={enviando}
                >
                  <Icono nombre={mostrarClave ? "ojoCerrado" : "ojo"} />
                </button>
              </div>
              {errorClave && (
                <span id="error-clave" className="ingreso-error-campo">
                  {errorClave}
                </span>
              )}
            </div>

            {/* Checkbox "Mantener la sesión iniciada" + Enlace "¿Olvidaste tu contraseña?" */}
            <div className="ingreso-opciones">
              <label className="ingreso-checkbox-label">
                <input
                  type="checkbox"
                  className="ingreso-checkbox"
                  checked={mantenerSesion}
                  onChange={(e) => setMantenerSesion(e.target.checked)}
                  disabled={enviando}
                />
                <span>{f?.etiquetas?.mantenerSesion}</span>
              </label>

              <a
                href="#recuperar"
                className="ingreso-enlace-verde"
                onClick={(e) => {
                  e.preventDefault();
                  onNavegar?.("recuperar");
                }}
              >
                {f?.enlaces?.olvidasteClave}
              </a>
            </div>

            {/* Botón principal */}
            <button
              type="submit"
              className="ingreso-btn-submit"
              disabled={enviando}
            >
              {enviando ? f?.mensajes?.ingresando : f?.botones?.ingresar}
            </button>

            {/* Enlace a crear cuenta */}
            <p className="ingreso-registro-texto">
              {f?.mensajes?.sinCuenta}{" "}
              <a
                href="#crear-cuenta"
                className="ingreso-enlace-verde"
                onClick={(e) => {
                  e.preventDefault();
                  onNavegar?.("crear-cuenta");
                }}
              >
                {f?.enlaces?.crearCuenta}
              </a>
            </p>
          </form>
        </div>

        {/* Nota legal inferior (visible en escritorio) */}
        {textoDerechos && <p className="ingreso-derechos">{textoDerechos}</p>}
      </section>

      {/* COLUMNA DERECHA: PRESENTACIÓN VISUAL (solo escritorio) */}
      <aside className="ingreso-columna-visual" aria-hidden="true">
        <div className="ingreso-visual-tarjeta">
          <div className="ingreso-mosaico">
            {PORTADAS_DECORATIVAS.map((portada, idx) => (
              <div key={idx} className="ingreso-mosaico-item">
                <PortadaSvg portada={portada} />
              </div>
            ))}
          </div>
          <div className="ingreso-visual-textos">
            <h2 className="titular-h1">{t?.presentacion?.titulo}</h2>
            <p className="cuerpo-m">{t?.presentacion?.texto}</p>
          </div>
        </div>
      </aside>
    </div>
  );
}