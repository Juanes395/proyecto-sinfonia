import {useState, useEffect} from "react";

const API_BASE = import.meta.env.VITE_API_URL;

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

    async function cargarTextos(){
      try {
        const respuesta = await fetch(`${API_BASE}/textos?idioma=${idioma}`, {
          signal: controlador.signal,
        });
        if (!respuesta.ok) {
          throw new Error(`Error HTTP: ${respuesta.status}`);
        }
        const datos = await respuesta.json();
        
        const contenido = datos?.textos ?? datos;
        if (vigente) {
          setTextos(contenido);
          setCargando(false);
        }     
      }catch (err) {
        if (vigente) {
          setError(true);
          setCargando(false);
        }
      }finally {
        clearTimeout(limite);
        if (vigente) {
          setCargando(false);
        }
      }
    }
    cargarTextos();

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