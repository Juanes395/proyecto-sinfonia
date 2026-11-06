import React, { useEffect, useState } from "react";
import { obtenerGeneros, obtenerGeneroPorId } from "../../services/api.js";
import TarjetaGenero from "../TarjetaGenero/TarjetaGenero.jsx";
import "./InicioPublico.css";
import TarjetaPista from "../TarjetaPista/TarjetaPista.jsx";

// El componente recibe:
// - textos: objeto global con todas las cadenas traducidas
// - onNavegar: callback para transicionar entre vistas (#inicio, #catalogo, #crear-cuenta)
export default function InicioPublico({ textos, onNavegar }) {
    // Estado para guardar la lista de géneros devuelta por la API
    const [generos, setGeneros] = useState([]);
    // Estados para controlar la carga y posibles errores de la petición a /generos
    const [cargandoGeneros, setCargandoGeneros] = useState(true);
    const [errorGeneros, setErrorGeneros] = useState(false);

    // Extraemos la sección específica de Inicio público de la API
    const t = textos?.paginas?.inicioPublico;
    const hero = t?.hero;
    const cifras = t?.cifras;
    const destacados = t?.destacados;
    const seccionGeneros = t?.generos;
    const cta = t?.cta;

    //Canciones destacadas
    const [destacadosPistas, setDestacadosPistas] = useState([]);
    const [cargandoDestacados, setCargandoDestacados] = useState(true);
    const [errorDestacados, setErrorDestacados] = useState(false);


    // Petición a GET /generos para cargar las categorías musicales
    useEffect(() => {
        const controlador = new AbortController();
        let vigente = true;

        setCargandoGeneros(true);
        setCargandoDestacados(true);
        setErrorGeneros(false);
        setErrorDestacados(false);

        // 1. Obtenemos la lista real de géneros
        obtenerGeneros(controlador.signal)
            .then((datos) => {
                if (!vigente) return;

                const lista = Array.isArray(datos)
                    ? datos
                    : Array.isArray(datos?.generos)
                        ? datos.generos
                        : [];

                setGeneros(lista);
                setCargandoGeneros(false);

                // 2. Si hay al menos un género disponible, usamos el ID del primero
                if (lista.length > 0) {
                    const idPrimerGenero = lista[0].id;
                    return obtenerGeneroPorId(idPrimerGenero, controlador.signal);
                }
            })
            .then((detalle) => {
                if (vigente && detalle) {
                    const pistas = Array.isArray(detalle?.pistas) ? detalle.pistas : [];
                    setDestacadosPistas(pistas.slice(0, 6));
                    setCargandoDestacados(false);
                }
            })
            .catch((err) => {
                if (vigente && err.name !== "AbortError") {
                    console.error("Error al cargar datos del catálogo:", err);
                    setErrorGeneros(true);
                    setErrorDestacados(true);
                }
            })
            .finally(() => {
                if (vigente) {
                    setCargandoGeneros(false);
                    setCargandoDestacados(false);
                }
            });

        return () => {
            vigente = false;
            controlador.abort();
        };
    }, []);

    function navegarA(destino) {
        if (onNavegar) onNavegar(destino);
    }

    return (
        <div className="inicio-publico">
            {/* 1. SECCIÓN HERO */}
            <section className="inicio-hero" aria-label="Introducción">
                <div className="inicio-hero-texto">
                    {hero?.etiquetas?.temporada && (
                        <span className="inicio-hero-badge">
                            {hero.etiquetas.temporada}
                        </span>
                    )}

                    {/* Titular Display principal */}
                    {hero?.titulo && (
                        <h1 className="inicio-hero-titulo titular-display">
                            {hero.titulo}
                        </h1>
                    )}

                    {/* Subtítulo explicativo */}
                    {hero?.subtitulo && (
                        <p className="inicio-hero-subtitulo cuerpo-g">
                            {hero.subtitulo}
                        </p>
                    )}

                    {/* Botones de llamada a la acción */}
                    <div className="inicio-hero-botones">
                        {hero?.botones?.crearCuentaGratis && (
                            <button
                                type="button"
                                className="inicio-btn inicio-btn-primario"
                                onClick={() => navegarA("crear-cuenta")}
                            >
                                {hero.botones.crearCuentaGratis}
                            </button>
                        )}
                        {hero?.botones?.explorarCatalogo && (
                            <button
                                type="button"
                                className="inicio-btn inicio-btn-secundario"
                                onClick={() => navegarA("catalogo")}
                            >
                                {hero.botones.explorarCatalogo}
                            </button>
                        )}
                    </div>
                </div>

                {/* Ilustración geométrica abstracta de Figma (cero fotos) */}
                <div className="inicio-hero-grafico" aria-hidden="true">
                    <div className="inicio-figura inicio-figura-1" />
                    <div className="inicio-figura inicio-figura-2" />
                    <div className="inicio-figura inicio-figura-3">
                    </div>
                </div>
            </section>

            {/* 2. SECCIÓN CIFRAS / MÉTRICAS */}
            <section className="inicio-cifras" aria-label="Estadísticas de la plataforma">
                {/* Canciones */}
                <div className="inicio-cifra-item">
                    <span className="inicio-cifra-valor dato-cifra">
                        {cifras?.canciones?.valor}
                    </span>
                    <span className="inicio-cifra-etiqueta cuerpo-p">
                        {cifras?.canciones?.etiqueta}
                    </span>
                </div>

                {/* Géneros (el número se calcula dinámicamente con los recibidos de la API) */}
                <div className="inicio-cifra-item">
                    <span className="inicio-cifra-valor dato-cifra">
                        {generos.length > 0 ? generos.length : "0"}
                    </span>
                    <span className="inicio-cifra-etiqueta cuerpo-p">
                        {cifras?.generos?.etiqueta}
                    </span>
                </div>

                {/* Cortes al navegar */}
                <div className="inicio-cifra-item">
                    <span className="inicio-cifra-valor dato-cifra">
                        {cifras?.cortes?.valor}
                    </span>
                    <span className="inicio-cifra-etiqueta cuerpo-p">
                        {cifras?.cortes?.etiqueta}
                    </span>
                </div>
            </section>

            {/* 3. SECCIÓN SUENA ESTA SEMANA */}
            <section className="inicio-seccion" aria-labelledby="titulo-suena-esta-semana">
                <div className="inicio-seccion-encabezado">
                    <h2 id="titulo-suena-esta-semana" className="inicio-seccion-titulo titular-h2">
                        {destacados?.titulo}
                    </h2>
                    <a
                        href="#catalogo"
                        className="inicio-seccion-enlace cuerpo-p-fuerte"
                        onClick={(e) => {
                            e.preventDefault();
                            navegarA("catalogo");
                        }}
                    >
                        {destacados?.enlaces?.descubrirMas} →
                    </a>
                </div>
                {/* Portadas de muestra destacadas con patrones geométricos */}
                {/* Renderizado condicional según estado de la petición */}
                {cargandoDestacados ? (
                    <p className="cuerpo-m" style={{ color: "var(--texto-secundario)" }}>
                        Cargando canciones…
                    </p>
                ) : errorDestacados ? (
                    <p className="cuerpo-m" style={{ color: "var(--estado-error)" }}>
                        No se pudieron cargar las canciones destacadas.
                    </p>
                ) : (
                    <div className="inicio-destacados-grilla">
                        {/* Se recorre el arreglo real devuelto por la API */}
                        {destacadosPistas.map((pista, index) => (
                            <TarjetaPista
                                key={pista.id || index}
                                pista={pista}
                                indice={index}
                            />
                        ))}
                    </div>
                )}
            </section>

            {/* 4. SECCIÓN EXPLORA POR GÉNERO */}
            <section className="inicio-seccion" aria-labelledby="titulo-explora-genero">
                <div className="inicio-seccion-encabezado">
                    <h2 id="titulo-explora-genero" className="inicio-seccion-titulo titular-h2">
                        {seccionGeneros?.titulo}
                    </h2>
                    <a
                        href="#catalogo"
                        className="inicio-seccion-enlace cuerpo-p-fuerte"
                        onClick={(e) => {
                            e.preventDefault();
                            navegarA("catalogo");
                        }}
                    >
                        {seccionGeneros?.enlaces?.verCatalogo} →
                    </a>
                </div>

                {/* Grilla dinámica de géneros cargada desde la API */}
                {cargandoGeneros ? (
                    <p className="cuerpo-m" style={{ color: "var(--texto-secundario)" }}>
                        Cargando géneros…
                    </p>
                ) : errorGeneros ? (
                    <p className="cuerpo-m" style={{ color: "var(--estado-error)" }}>
                        No se pudieron cargar los géneros.
                    </p>
                ) : (
                    <div className="inicio-generos-grilla">
                        {/* Mostramos los primeros 8 géneros en la vista de Inicio */}
                        {generos.slice(0, 8).map((genero, i) => (
                            <TarjetaGenero
                                key={genero.id || i}
                                genero={genero}
                                indice={i}
                                onSeleccionar={(id) => navegarA(`catalogo?genero=${id}`)}
                            />
                        ))}
                    </div>
                )}
            </section>

            {/* 5. BANNER CTA INFERIOR */}
            <section className="inicio-cta" aria-labelledby="titulo-cta">
                <div className="inicio-cta-contenido">
                    <h2 id="titulo-cta" className="inicio-cta-titulo titular-h2">
                        {cta?.titulo}
                    </h2>
                    <p className="inicio-cta-texto cuerpo-m">
                        {cta?.texto}
                    </p>
                </div>
                {cta?.botones?.crearCuentaGratis && (
                    <button
                        type="button"
                        className="inicio-cta-btn"
                        onClick={() => navegarA("crear-cuenta")}
                    >
                        {cta.botones.crearCuentaGratis}
                    </button>
                )}
            </section>
        </div>
    );
}