import { useEffect, useState } from "react";
import Navbar from "./components/Navbar/Navbar.jsx";
import Footer from "./components/Footer/Footer.jsx";
import { useTextos } from "./hooks/useTextos.js";


function leerSeccion() {
  return window.location.hash.slice(1) || "inicio";
}

export default function App() {
  // Idioma inicial por defecto: español
  const [idioma, setIdioma] = useState("es");
  const [activo, setActivo] = useState(leerSeccion);
  const [textoGrande, setTextoGrande] = useState(false);

  // Consumimos el hook conectado a la API de Sintonía
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
        <p>Vista activa: <strong>{activo}</strong></p>
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
    </>
  );
}