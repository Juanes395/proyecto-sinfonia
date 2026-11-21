import React, { useEffect, useState } from "react";
import { obtenerAlbumPorId } from "../../services/api.js";
import PortadaSvg from "../PortadaSvg/PortadaSvg.jsx";
import Icono from "../Icono.jsx";
import "./DetalleAlbum.css";

// Reemplaza marcadores tipo "{artista}" o "{anio}" en las plantillas de la API
function interpolar(plantilla = "", valores = {}) {
    return plantilla.replace(/\{(\w+)\}/g, (_, clave) => valores[clave] ?? "");
}

// Convierte segundos (ej. 70) en formato "m:ss" (ej. "1:10")
function formatearDuracionPista(segundos = 0) {
    const min = Math.floor(segundos / 60);
    const seg = Math.floor(segundos % 60);
    return `${min}:${String(seg).padStart(2, "0")}`;
}

const MESES_ES = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

const MESES_EN = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];

// Formatea la fecha ISO ("2025-10-04") sin usar new Date() para evitar desfases de zona horaria
function formatearFechaPublicacion(fechaIso, idioma = "es") {
    if (!fechaIso) return "";
    const [anio, mes, dia] = fechaIso.split("-").map(Number);
    if (!anio || !mes || !dia) return fechaIso;

    if (idioma === "en") {
        return `${MESES_EN[mes - 1]} ${dia}, ${anio}`;
    }
    return `${dia} de ${MESES_ES[mes - 1]} de ${anio}`;
}
// Formatea números de reproducciones con separador de miles según idioma
function formatearNumero(valor, idioma = "es") {
    if (typeof valor !== "number") return "";
    const locale = idioma === "en" ? "en-US" : "es-CO";
    return new Intl.NumberFormat(locale).format(valor);
}

export default function DetalleAlbum({ albumId, textos, idioma = "es", onNavegar }) {
    const [album, setAlbum] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [noEncontrado, setNoEncontrado] = useState(false);
    const [errorRed, setErrorRed] = useState(false);
    const [intento, setIntento] = useState(0);

    // Textos traducidos de la página de álbum y nota legal
    const t = textos?.paginas?.album;
    const notaLegal = textos?.footer?.legal?.nota;

    useEffect(() => {
        // Si no viene un ID válido, mostramos directamente el estado 404
        if (!albumId) {
            setAlbum(null);
            setNoEncontrado(true);
            setCargando(false);
            return;
        }

        const controlador = new AbortController();
        let vigente = true;

        setCargando(true);
        setNoEncontrado(false);
        setErrorRed(false);

        obtenerAlbumPorId(albumId, controlador.signal)
            .then((datos) => {
                if (vigente) {
                    setAlbum(datos);
                    // Subimos el scroll al cambiar entre álbumes (ej. desde "Más del artista")
                    window.scrollTo({ top: 0, behavior: "smooth" });
                }
            })
            .catch((err) => {
                if (!vigente || err.name === "AbortError") return;
                if (err.status === 404) {
                    setNoEncontrado(true);
                } else {
                    console.error("Error al cargar el detalle del álbum:", err);
                    setErrorRed(true);
                }
            })
            .finally(() => {
                if (vigente) setCargando(false);
            });

        return () => {
            vigente = false;
            controlador.abort();
        };
    }, [albumId, intento]);
    // Actualiza el título de la pestaña del navegador con el nombre del álbum
    useEffect(() => {
        if (album?.titulo && t?.seo?.titulo) {
            document.title = interpolar(t.seo.titulo, { titulo: album.titulo });
        }
        return () => {
            document.title = textos?.sitio?.nombre || "Sintonía";
        };
    }, [album, t, textos]);
    function navegarA(destino) {
        if (onNavegar) onNavegar(destino);
    }

    // 1. Estado de carga
    if (cargando) {
        return (
            <section className="album-vista album-estado" aria-busy="true">
                <div className="album-esqueleto-cabecera">
                    <div className="album-esqueleto-portada" />
                    <div className="album-esqueleto-meta">
                        <div className="album-esqueleto-linea corta" />
                        <div className="album-esqueleto-linea grande" />
                        <div className="album-esqueleto-linea media" />
                    </div>
                </div>
            </section>
        );
    }

    // 2. Estado 404: álbum no encontrado
    if (noEncontrado || !album) {
        return (
            <section className="album-vista album-estado" role="status">
                <h1 className="titular-h2">{t?.noEncontrado?.titulo}</h1>
                <p className="cuerpo-m album-estado-texto">{t?.noEncontrado?.texto}</p>
                <button
                    type="button"
                    className="album-btn-primario"
                    onClick={() => navegarA("catalogo")}
                >
                    {t?.noEncontrado?.botones?.volver}
                </button>
            </section>
        );
    }

    // 3. Estado de error de red o servidor (500)
    if (errorRed) {
        return (
            <section className="album-vista album-estado" role="alert">
                <h1 className="titular-h2">
                    {textos?.componentes?.reproductor?.error?.botones?.reintentar
                        ? t?.noEncontrado?.titulo
                        : "Error"}
                </h1>
                <button
                    type="button"
                    className="album-btn-primario"
                    onClick={() => setIntento((n) => n + 1)}
                >
                    {textos?.componentes?.reproductor?.error?.botones?.reintentar}
                </button>
            </section>
        );
    }

    // Datos calculados para el encabezado
    const anio = album.fechaPublicacion ? album.fechaPublicacion.slice(0, 4) : "";
    const tipoEtiqueta = t?.encabezado?.etiquetas?.tipo?.[album.tipo] ?? album.tipo;
    const totalPistas = album.totalPistas ?? album.pistas?.length ?? 0;
    const textoCanciones = interpolar(
        totalPistas === 1 ? t?.encabezado?.canciones?.uno : t?.encabezado?.canciones?.otro,
        { cantidad: totalPistas }
    );
    const minutosTotales = Math.max(1, Math.round((album.duracionSeg ?? 0) / 60));
    const textoDuracion = interpolar(t?.encabezado?.duracion, { minutos: minutosTotales });
    const resumenMeta = interpolar(t?.encabezado?.etiquetas?.resumen, {
        artista: album.artista?.nombre ?? "",
        anio,
        canciones: textoCanciones,
        duracion: textoDuracion,
    });

    const pistas = Array.isArray(album.pistas) ? album.pistas : [];
    const masDelArtista = Array.isArray(album.masDelArtista) ? album.masDelArtista : [];

    return (
        <article className="album-vista">
            <div className="album-contenedor">
                {/* Botón volver visible en móvil (igual a Figma 390 px) */}
                <button
                    type="button"
                    className="album-btn-volver"
                    onClick={() => navegarA("catalogo")}
                    aria-label={t?.noEncontrado?.botones?.volver}
                >
                    <Icono nombre="volver" />
                </button>

                {/* 1. ENCABEZADO DEL ÁLBUM */}
                <header className="album-cabecera">
                    <div className="album-portada-principal">
                        <PortadaSvg portada={album.portada} />
                    </div>

                    <div className="album-meta">
                        {tipoEtiqueta && <span className="album-tipo-badge">{tipoEtiqueta}</span>}

                        <h1 className="album-titulo titular-display">{album.titulo}</h1>

                        <div className="album-resumen-fila">
                            <span className="album-avatar-mini" aria-hidden="true">
                                <PortadaSvg portada={album.portada} />
                            </span>
                            <p className="album-resumen cuerpo-p">
                                <strong className="album-artista-nombre">{album.artista?.nombre}</strong>
                                {resumenMeta
                                    ? resumenMeta.replace(album.artista?.nombre ?? "", "")
                                    : ""}
                            </p>
                        </div>
                    </div>
                </header>

                {/* 2. TABLA DE CANCIONES */}
                <section className="album-pistas-seccion" aria-label={t?.tabla?.etiquetas?.titulo}>
                    <table className="album-tabla">
                        <thead className="album-tabla-head">
                            <tr>
                                <th scope="col" className="col-numero">
                                    {t?.tabla?.etiquetas?.numero}
                                </th>
                                <th scope="col" className="col-titulo">
                                    {t?.tabla?.etiquetas?.titulo}
                                </th>
                                <th scope="col" className="col-reproducciones">
                                    {t?.tabla?.etiquetas?.reproducciones}
                                </th>
                                <th
                                    scope="col"
                                    className="col-duracion"
                                    aria-label={t?.tabla?.etiquetas?.duracion}
                                >
                                    <span className="album-icono-reloj" title={t?.tabla?.etiquetas?.duracion}>
                                        <Icono nombre="reloj" />
                                    </span>
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {pistas.map((pista, indice) => (
                                <tr key={pista.id} className="album-fila-pista">
                                    <td className="col-numero">{pista.numero ?? indice + 1}</td>

                                    <td className="col-titulo">
                                        <div className="pista-celda-principal">
                                            <div className="pista-portada-mini">
                                                <PortadaSvg portada={pista.portada ?? album.portada} />
                                            </div>
                                            <div className="pista-textos">
                                                <span className="pista-titulo">{pista.titulo}</span>
                                                <span className="pista-artista">
                                                    {pista.artista?.nombre ?? album.artista?.nombre}
                                                </span>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="col-reproducciones">
                                        {formatearNumero(pista.reproducciones, idioma)}
                                    </td>

                                    <td className="col-duracion">
                                        {formatearDuracionPista(pista.duracionSeg)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>

                {/* 3. FECHA DE PUBLICACIÓN Y NOTA LEGAL */}
                <footer className="album-pie-meta">
                    {album.fechaPublicacion && (
                        <p className="album-fecha">
                            {formatearFechaPublicacion(album.fechaPublicacion, idioma)}
                        </p>
                    )}
                    {notaLegal && (
                        <p className="album-nota-legal">
                            © {anio} {album.artista?.nombre} · {notaLegal}
                        </p>
                    )}
                </footer>

                {/* 4. MÁS DEL ARTISTA */}
                {masDelArtista.length > 0 && (
                    <section className="album-mas-artista">
                        <div className="album-mas-encabezado">
                            <h2 className="titular-h2">
                                {interpolar(t?.masDelArtista?.titulo, {
                                    artista: album.artista?.nombre ?? "",
                                })}
                            </h2>
                            <button
                                type="button"
                                className="album-enlace-discografia"
                                onClick={() => navegarA("catalogo")}
                            >
                                {t?.masDelArtista?.enlaces?.verDiscografia}
                            </button>
                        </div>

                        <div className="album-mas-grilla">
                            {masDelArtista.map((item) => {
                                const anioItem = item.fechaPublicacion
                                    ? item.fechaPublicacion.slice(0, 4)
                                    : "";
                                const tipoItem =
                                    t?.encabezado?.etiquetas?.tipo?.[item.tipo] ?? item.tipo;
                                const subtituloItem = interpolar(
                                    t?.masDelArtista?.etiquetas?.anioYTipo,
                                    { anio: anioItem, tipo: tipoItem }
                                );

                                return (
                                    <button
                                        key={item.id}
                                        type="button"
                                        className="album-tarjeta-relacionada"
                                        onClick={() => navegarA(`albumes/${item.id}`)}
                                    >
                                        <div className="album-tarjeta-portada">
                                            <PortadaSvg portada={item.portada} />
                                        </div>
                                        <span className="album-tarjeta-titulo">{item.titulo}</span>
                                        <span className="album-tarjeta-subtitulo">{subtituloItem}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </section>
                )}
            </div>
        </article>
    );
}