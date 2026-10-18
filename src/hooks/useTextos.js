import {useState, useEffect} from "react";

const API = "https://yanethm-sintonia-api.fly.dev/api/v1/textos";
const CLAVES_MENU = ["descubrir", "planes", "paraArtistas", "ayuda"];

function validarTextos(datos) {
  const nav = datos?.textos?.navbar;

  const etiquetas = [
    nav?.logo?.texto,
    nav?.logo?.aria,
    ...CLAVES_MENU.map((clave) => nav?.enlaces?.invitado?.[clave]),
    nav?.botones?.invitado?.ingresar,
    nav?.botones?.invitado?.crearCuenta,
  ];

  if (!etiquetas.every((valor) => typeof valor === "string" && valor.trim())) {
    throw new Error("La respuesta no contiene los textos requeridos del navbar.");
  }

  return datos.textos;
}

export function useTextos(idioma = "es") {
  const [textos, setTextos] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    const controlador = new AbortController();
    const limite = setTimeout(() => controlador.abort(), 12000);
    let vigente = true;

    setCargando(true);
    setError(false);
    setTextos(null);

    async function cargarTextosNavbar() {
      try {
        const respuesta = await fetch(`${API}?idioma=${idioma}`, {
          signal: controlador.signal,
        });

        if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);

        const datos = await respuesta.json();
        const nuevosTextos = validarTextos(datos);

        if (vigente) setTextos(nuevosTextos);
      } catch (err) {
        if (vigente) {
          console.error("Error al cargar los textos: ", err);
          setError(true);
        }
      } finally {
        clearTimeout(limite);
        if (vigente) setCargando(false);
      }
    }

    cargarTextosNavbar();

    return () => {
      vigente = false;
      clearTimeout(limite);
      controlador.abort();
    };
  }, [idioma, intento]);

  return {
    textos,
    cargando,
    error,
    recargar: () => setIntento((valor) => valor + 1),
  };
}