import React, { useEffect, useState } from "react";
import { obtenerGeneros, obtenerGeneroPorId } from "../../services/api.js";
import TarjetaGenero from "../TarjetaGenero/TarjetaGenero.jsx";
import TarjetaPista from "../TarjetaPista/TarjetaPista.jsx";
import "./Catalogo.css";
import { EsqueletoSeccion, EstadoVacio, EstadoError } from "../EstadoUI/EstadoUI.jsx";

// Función auxiliar para convertir segundos (ej. 80) a formato mm:ss (ej. "1:20")
function formatearDuracion(segundos) {
  if (typeof segundos !== "number" || isNaN(segundos)) return "0:00";
  const mins = Math.floor(segundos / 60);
  const segs = Math.floor(segundos % 60);
  return `${mins}:${segs < 10 ? "0" : ""}${segs}`;
}

export default function Catalogo({ textos, generoInicial, onNavegar }) {
  // Se extrae la sección traducida de catálogo desde la API
  const t = textos?.paginas?.catalogo;

  // Estado para la lista general de géneros 
  const [generos, setGeneros] = useState([]);
  const [cargandoGeneros, setCargandoGeneros] = useState(true);
  const [errorGeneros, setErrorGeneros] = useState(false);

  // Estado del ID de género seleccionado (null = vista general del catálogo)
  const [generoId, setGeneroId] = useState(generoInicial || null);

  // Sincroniza el estado del género seleccionado con la prop inicial (si cambia)
  useEffect(() => {
    setGeneroId(generoInicial || null);
  }, [generoInicial]);

  // Estado para guardar los álbumes destacados
  const [albumesDestacados, setAlbumesDestacados] = useState([]);
  const [cargandoDestacados, setCargandoDestacados] = useState(false);

  // Estado para guardar el detalle completo del género seleccionado 
  const [detalleGenero, setDetalleGenero] = useState(null);
  const [cargandoDetalle, setCargandoDetalle] = useState(false);
  const [errorDetalle, setErrorDetalle] = useState(false);
  // Estados para manejar reintentos de carga en caso de error, relacionados con el archivo estadoUI.jsx
  const [errorDestacados, setErrorDestacados] = useState(false);
  const [intentoGeneros, setIntentoGeneros] = useState(0);
  const [intentoDestacados, setIntentoDestacados] = useState(0);
  const [intentoDetalle, setIntentoDetalle] = useState(0);

  // 1. Cargar la lista de los 12 géneros al montar el componente
  useEffect(() => {
    const controlador = new AbortController();
    let vigente = true;

    setCargandoGeneros(true);
    setErrorGeneros(false);

    obtenerGeneros(controlador.signal)
      .then((lista) => {
        if (vigente) {
          setGeneros(Array.isArray(lista) ? lista : []);
        }
      })
      .catch((err) => {
        if (vigente && err.name !== "AbortError") {
          console.error("Error al cargar géneros:", err);
          setErrorGeneros(true);
        }
      })
      .finally(() => {
        if (vigente) setCargandoGeneros(false);
      });

    return () => {
      vigente = false;
      controlador.abort();
    };
  }, [intentoGeneros]);
  // 2. Si NO hay género seleccionado, cargamos los "Álbumes destacados" 
  useEffect(() => {
    if (generoId || generos.length === 0) return;

    const controlador = new AbortController();
    let vigente = true;

    setCargandoDestacados(true);
    setErrorDestacados(false);

    // Consultamos los primeros géneros para reunir 6 álbumes variados de muestra
    const primerosGeneros = generos.slice(0, 6);
    Promise.all(
      primerosGeneros.map((g) => obtenerGeneroPorId(g.id, controlador.signal))
    )
      .then((respuestas) => {
        if (vigente) {
          // Extraemos los álbumes de cada género y tomamos los primeros 6
          const todosLosAlbumes = respuestas.flatMap((d) =>
            Array.isArray(d?.albumes) ? d.albumes : []
          );
          setAlbumesDestacados(todosLosAlbumes.slice(0, 6));
        }
      })
      .catch((err) => {
        if (vigente && err.name !== "AbortError") {
          console.error("Error al cargar álbumes destacados:", err);
          setErrorDestacados(true);
        }
      })
      .finally(() => {
        if (vigente) setCargandoDestacados(false);
      });

    return () => {
      vigente = false;
      controlador.abort();
    };
  }, [generoId, generos, intentoDestacados]);
  // 3. Si HAY un género seleccionado (Modo B), pedimos su detalle a GET /generos/:id
  useEffect(() => {
    if (!generoId) {
      setDetalleGenero(null);
      return;
    }

    const controlador = new AbortController();
    let vigente = true;

    setCargandoDetalle(true);
    setErrorDetalle(false);

    obtenerGeneroPorId(generoId, controlador.signal)
      .then((datos) => {
        if (vigente) {
          setDetalleGenero(datos);
        }
      })
      .catch((err) => {
        if (vigente && err.name !== "AbortError") {
          console.error("Error al cargar detalle del género:", err);
          setErrorDetalle(true);
        }
      })
      .finally(() => {
        if (vigente) setCargandoDetalle(false);
      });

    return () => {
      vigente = false;
      controlador.abort();
    };
  }, [generoId, intentoDetalle]);
  // Manejador al hacer clic en una tarjeta de género
  function seleccionarGenero(id) {
    // Si hace clic en el género que ya está activo, vuelve a la vista general del catálogo
    const nuevoId = generoId === id ? null : id;
    setGeneroId(nuevoId);
    if (onNavegar) {
      onNavegar(nuevoId ? `catalogo?genero=${nuevoId}` : "catalogo");
    }
  }
  // Título y subtítulo dinámicos según el modo (General vs Género seleccionado)
  const tituloEncabezado = generoId && detalleGenero
    ? detalleGenero.nombre
    : t?.encabezado?.titulo;

  const subtituloEncabezado = generoId && detalleGenero
    ? detalleGenero.descripcion
    : t?.encabezado?.subtitulo;

  // Reemplazo dinámico de "{genero}" en "Álbumes de {genero}"
  const tituloAlbumesGenero = (t?.genero?.albumes?.titulo || "").replace(
    "{genero}",
    detalleGenero?.nombre || ""
  );
  return (
    <div className="catalogo-vista">
      <div className="catalogo-contenedor">
        {/* 1. ENCABEZADO DINÁMICO */}
        <header className="catalogo-encabezado">
          <h1 className="catalogo-titulo titular-h1">
            {tituloEncabezado}
          </h1>
          <p className="catalogo-subtitulo cuerpo-m">
            {subtituloEncabezado}
          </p>
        </header>

        {/* 2. SECCIÓN: EXPLORAR POR GÉNERO (Las 12 tarjetas siempre visibles) */}
        <section className="catalogo-seccion" aria-labelledby="titulo-explorar-genero">
          <h2 id="titulo-explorar-genero" className="catalogo-seccion-titulo titular-h2">
            {t?.generos?.titulo}
          </h2>
          {cargandoGeneros ? (
            <EsqueletoSeccion
              tipo="generos"
              cantidad={8}
              ariaLabel={textos?.estados?.cargando?.aria}
            />
          ) : errorGeneros ? (
            <EstadoError
              textos={textos}
              onReintentar={() => setIntentoGeneros((n) => n + 1)}
            />
          ) : generos.length === 0 ? (
            <EstadoVacio descripcion={textos?.estados?.vacio?.generico} />
          ) : (
            <div className="catalogo-generos-grilla">
              {generos.map((g, i) => (
                <TarjetaGenero
                  key={g.id || i}
                  genero={g}
                  indice={i}
                  activa={generoId === g.id}
                  ariaSeleccionado={t?.generos?.aria?.seleccionado}
                  onSeleccionar={seleccionarGenero}
                />
              ))}
            </div>
          )}
        </section>

        {/* 3. MODO A: SIN GÉNERO SELECCIONADO */}
        {!generoId && (
          <section className="catalogo-seccion" aria-labelledby="titulo-albumes-destacados">
            <div className="catalogo-seccion-encabezado">
              <h2 id="titulo-albumes-destacados" className="catalogo-seccion-titulo titular-h2">
                {t?.destacados?.titulo}
              </h2>
              {t?.destacados?.enlaces?.descubrirMas && (
                <a
                  href="#catalogo"
                  className="catalogo-enlace-verde cuerpo-p-fuerte"
                  onClick={(e) => {
                    e.preventDefault();
                    if (generos[0]?.id) seleccionarGenero(generos[0].id);
                  }}
                >
                  {t.destacados.enlaces.descubrirMas} →
                </a>
              )}
            </div>

            {cargandoDestacados ? (
              <EsqueletoSeccion
                tipo="destacados"
                cantidad={8}
                ariaLabel={textos?.estados?.cargando?.aria}
              />
            ) : errorDestacados ? (
              <EstadoError
                textos={textos}
                onReintentar={() => setIntentoDestacados((n) => n + 1)}
              />
            ) : generos.length === 0 ? (
              <EstadoVacio descripcion={textos?.estados?.vacio?.generico} />
            ) : (
              <div className="catalogo-albumes-grilla">
                {albumesDestacados.map((album, idx) => (
                  <TarjetaPista
                    key={album.id || idx}
                    pista={album}
                    onSeleccionar={(item) => {
                      const idAlbum = item?.album?.id || item?.id;
                      if (idAlbum) onNavegar?.(`albumes/${idAlbum}`);
                    }}
                  />
                ))}
              </div>
            )}
          </section>
        )}
        {/* 4. MODO B: CON GÉNERO SELECCIONADO  */}
        {generoId && (
          <>
            {cargandoDetalle ? (
              <EsqueletoSeccion tipo="lista" cantidad={5} ariaLabel={textos?.estados?.cargando?.aria} />
            ) : errorDetalle ? (
              <EstadoError textos={textos} onReintentar={() => setIntentoDetalle((n) => n + 1)} />
            ) : detalleGenero ? (
              <>
                {/* 4.1. SECCIÓN DE ARTISTAS (Círculos de color) */}
                {Array.isArray(detalleGenero.artistas) && detalleGenero.artistas.length > 0 && (
                  <section className="catalogo-seccion" aria-labelledby="titulo-artistas-genero">
                    <h2 id="titulo-artistas-genero" className="catalogo-seccion-titulo titular-h2">
                      {t?.genero?.artistas?.titulo}
                    </h2>

                    <div className="catalogo-artistas-lista">
                      {detalleGenero.artistas.map((artista, i) => {
                        // Usamos el color de fondo que envía la API o rotamos entre tokens
                        const colorCirculo = artista.portada?.fondo
                        return (
                          <div key={artista.id || i} className="catalogo-artista-card">
                            <div
                              className="catalogo-artista-avatar"
                              style={{ backgroundColor: artista.portada?.fondo || colorCirculo }}
                              aria-hidden="true"
                            />
                            <h3 className="catalogo-artista-nombre titular-h4">
                              {artista.nombre}
                            </h3>
                            <span className="catalogo-artista-etiqueta detalle-nota">
                              {t?.genero?.artistas?.etiqueta}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                )}

                {/* 4.2. SECCIÓN DE ÁLBUMES DEL GÉNERO */}
                <section className="catalogo-seccion" aria-labelledby="titulo-albumes-genero">
                  <h2 id="titulo-albumes-genero" className="catalogo-seccion-titulo titular-h2">
                    {tituloAlbumesGenero}
                  </h2>

                  {Array.isArray(detalleGenero.albumes) && detalleGenero.albumes.length > 0 ? (
                    <div className="catalogo-albumes-genero-fila">
                      {detalleGenero.albumes.map((album, idx) => (
                        <TarjetaPista
                          key={album.id || idx}
                          pista={album}
                          onSeleccionar={(item) => {
                            const idAlbum = item?.album?.id || item?.id;
                            if (idAlbum) onNavegar?.(`albumes/${idAlbum}`);
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    <EstadoVacio titulo={t?.vacio?.titulo} descripcion={t?.vacio?.texto} />
                  )}
                </section>

                {/* 4.3. SECCIÓN DE CANCIONES MÁS ESCUCHADAS (Lista numerada 1 a 5) */}
                {Array.isArray(detalleGenero.pistas) && detalleGenero.pistas.length > 0 && (
                  <section className="catalogo-seccion" aria-labelledby="titulo-canciones-genero">
                    <h2 id="titulo-canciones-genero" className="catalogo-seccion-titulo titular-h2">
                      {t?.genero?.canciones?.titulo}
                    </h2>

                    <ol className="catalogo-canciones-lista">
                      {detalleGenero.pistas.map((pista, idx) => (
                        <li key={pista.id || idx} className="catalogo-cancion-fila">
                          <span className="catalogo-cancion-numero cuerpo-p">
                            {idx + 1}
                          </span>

                          <div className="catalogo-cancion-textos">
                            <span className="catalogo-cancion-titulo cuerpo-p-fuerte">
                              {pista.titulo}
                            </span>
                            <span className="catalogo-cancion-artista detalle-nota">
                              {pista.artista?.nombre ?? pista.artista}
                            </span>
                          </div>

                          <span className="catalogo-cancion-duracion detalle-nota">
                            {formatearDuracion(pista.duracionSeg)}
                          </span>
                        </li>
                      ))}
                    </ol>
                  </section>
                )}
              </>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}