import { useEffect, useState } from "react";
import Navbar from "./components/Navbar/Navbar.jsx";
import { useTextos } from "./hooks/useTextos.js";


function leerSeccion() {
  return window.location.hash.slice(1) || "descubrir";
}

export default function App() {
  // Idioma inicial por defecto: español
  const [idioma, setIdioma] = useState("es");
  const [activo, setActivo] = useState(leerSeccion);
  const [textoGrande, setTextoGrande] = useState(false);

  // Consumimos el hook conectado a la API de Sintonía
  const datos = useTextos(idioma);

  // Sincroniza la sección activa con el historial de navegación (#hash)
  useEffect(() => {
    function actualizar() {
      setActivo(leerSeccion());
      setConsulta("");
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
        {...datos}
        idioma={idioma}
        cambiarIdioma={setIdioma}
        activo={activo}
        textoGrande={textoGrande}
        alternarTexto={() => setTextoGrande((valor) => !valor)}
      />
    </>
  );
}