import { useEffect, useState } from "react";
import Navbar from "./components/Navbar/Navbar.jsx";
import Footer from "./components/Footer/Footer.jsx";
import AvisoCookies from "./components/AvisoCookies/AvisoCookies.jsx";
import InicioPublico from "./components/InicioPublico/InicioPublico.jsx";
import { useTextos } from "./hooks/useTextos.js";
import { leerCookie, guardarCookie } from "./utils/cookies.js";
import Catalogo from "./components/Catalogo/Catalogo.jsx";


function leerSeccion() {
  return window.location.hash.slice(1) || "inicio";
}

export default function App() {
  // Estado para el consentimiento de cookies
  const [consentimiento, setConsentimiento] = useState(() => leerCookie("consentimiento"));
  // Idioma inicial por defecto: español
  const [idioma, setIdioma] = useState(() => {
    const consent = leerCookie("consentimiento");
    if (consent === "aceptadas") {
      const cookieIdioma = leerCookie("idioma");
      if (cookieIdioma === "es" || cookieIdioma === "en") {
        return cookieIdioma;
      }
    }
    return "es";
  });
  const [activo, setActivo] = useState(leerSeccion);
  const [textoGrande, setTextoGrande] = useState(false);

  // se consume el hook conectado a la API de Sintonía
  const { textos, cargando, error, recargar } = useTextos(idioma);

  // Sincroniza la sección activa con la URL (HASH)
  useEffect(() => {
    function actualizar() {
      setActivo(leerSeccion());
    }
    window.addEventListener("hashchange", actualizar);
    return () => window.removeEventListener("hashchange", actualizar);
  }, []);

  // Actualiza el atributo lang del <html> para accesibilidad
  useEffect(() => {
    document.documentElement.lang = idioma;
  }, [idioma]);

  // Aumenta el texto global si se activa la opción de accesibilidad
  useEffect(() => {
    document.documentElement.style.fontSize = textoGrande ? "112%" : "";
    return () => {
      document.documentElement.style.fontSize = "";
    };
  }, [textoGrande]);
  // Manejador centralizado para cambiar de idioma
  function manejarCambioIdioma(nuevoIdioma) {
    setIdioma(nuevoIdioma);
    // Si la persona aceptó las cookies, persistimos su elección en la cookie 'idioma' 
    if (consentimiento === "aceptadas") {
      guardarCookie("idioma", nuevoIdioma);
    }
  }
  function manejarRespuestaCookies(decision) {
    setConsentimiento(decision);
    // Si el usuario acepta en esta primera visita, guardamos de inmediato su idioma actual
    if (decision === "aceptadas") {
      guardarCookie("idioma", idioma);
    }
  }
  return (
    <>
      <Navbar
        textos={textos}
        cargando={cargando}
        error={error}
        recargar={recargar}
        idioma={idioma}
        cambiarIdioma={setIdioma}
        activo={activo}
        onNavegar={(destino) => {
          setActivo(destino);
          window.location.hash = destino;
        }}
        onAbrirAccesibilidad={() =>
          console.log("Abrir panel de accesibilidad")
        }
      />
      <main style={{ padding: "2rem", maxWidth: "80rem", marginInline: "auto", color: "var(--texto-principal)" }}>
        {activo === "inicio" && (
          <InicioPublico
            textos={textos}
            onNavegar={(destino) => {
              setActivo(destino);
              window.location.hash = destino;
            }}
          />
        )}

        {activo.startsWith("catalogo") && (
          <Catalogo
            textos={textos}
            generoInicial={
              new URLSearchParams(window.location.hash.split("?")[1]).get("genero") || null
            }
            onNavegar={(destino) => {
              setActivo(destino);
              window.location.hash = destino;
            }}
          />
        )}
        {activo !== "inicio" && !activo.startsWith("catalogo") && (
          <div style={{ color: "var(--texto-principal)", paddingBlock: "4rem" }}>
            <h2 className="titular-h2">Vista: {activo}</h2>
            <p className="cuerpo-m" style={{ color: "var(--texto-secundario)" }}>
              En construcción :p
            </p>
          </div>
        )}
      </main>
      <Footer
        textos={textos}
        onNavegar={(destino) => {
          setActivo(destino);
          window.location.hash = destino;
        }}
        onAbrirAccesibilidad={() =>
          console.log("Abrir panel de accesibilidad desde Footer")
        }
      />
      {/* Banner de cookies: solo se muestra en la primera visita cuando consentimiento es null */}
      {!consentimiento && (
        <AvisoCookies
          textos={textos}
          onResponder={manejarRespuestaCookies}
        />
      )}
    </>
  );
}