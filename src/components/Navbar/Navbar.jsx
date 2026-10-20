import { useEffect, useRef, useState } from "react";
import Icono from "../Icono.jsx";
import "./Navbar.css";

const DESTINOS = {
    descubrir: "#descubrir",
    planes: "#planes",
    paraArtistas: "#para-artistas",
    ayuda: "#ayuda",
};

export default function Navbar({ textos, cargando, error, recargar, idioma, cambiarIdioma, activo, textoGrande, alternarTexto, }) {
    const [abierto, setAbierto] = useState(false);
    const botonMenu = useRef(null);

    const nav = textos?.navbar;
    const ingles = idioma === "en";

    // Textos para accesibilidad del botón móvil (si vienen en la API o fallback)
    const abrir = textos?.menuMovil?.abrir ?? (ingles ? "Open menu" : "Abrir menú");
    const cerrar = textos?.menuMovil?.cerrar ?? (ingles ? "Close menu" : "Cerrar menú");

    // Filtramos los enlaces de invitado
    const enlaces = Object.entries(nav?.enlaces?.invitado ?? {}).filter(
        ([clave]) => DESTINOS[clave]
    );

    useEffect(() => {
        function cerrarConEscape(evento) {
            if (evento.key === "Escape" && abierto) {
                setAbierto(false);
                botonMenu.current?.focus();
            }
        }
        document.addEventListener("keydown", cerrarConEscape);
        return () => document.removeEventListener("keydown", cerrarConEscape);
    }, [abierto]);

    return (
        <header className="navbar">
            <nav
                className="navbar-interior"
                aria-label={nav?.aria?.navegacion ?? "Navegación principal"}
            >
                {/* LOGO */}
                <a
                    className="navbar-marca"
                    href="#inicio"
                    aria-label={nav?.logo?.aria ?? "sintonía, ir al inicio"}
                    onClick={() => setAbierto(false)}
                >
                    <Icono nombre="logo" />
                </a>

                {/* ACCIONES MÓVIL  */}
                <div className="navbar-movil-acciones">
                    <button
                        ref={botonMenu}
                        type="button"
                        className="navbar-icono"
                        aria-label={abierto ? cerrar : abrir}
                        aria-expanded={abierto}
                        aria-controls="navbar-panel"
                        onClick={() => setAbierto((valor) => !valor)}
                    >
                        <Icono nombre={abierto ? "cerrar" : "menu"} />
                    </button>
                </div>

                {/* PANEL PRINCIPAL */}
                <div
                    id="navbar-panel"
                    className={`navbar-panel${abierto ? " is-abierto" : ""}`}
                    aria-busy={cargando}
                >
                    {cargando && (
                        <p className="navbar-estado" role="status">
                            {ingles ? "Loading navigation…" : "Cargando navegación…"}
                        </p>
                    )}

                    {error && (
                        <div className="navbar-estado" role="alert">
                            <p>
                                {ingles
                                    ? "Navigation could not be loaded."
                                    : "No pudimos cargar el menú."}
                            </p>
                            <button type="button" onClick={recargar}>
                                {ingles ? "Try again" : "Reintentar"}
                            </button>
                        </div>
                    )}

                    {nav && (
                        <>
                            {/* ENLACES DEL MENÚ */}
                            <ul className="navbar-enlaces">
                                {enlaces.map(([clave, etiqueta]) => (
                                    <li key={clave}>
                                        <a
                                            href={DESTINOS[clave]}
                                            aria-current={activo === clave ? "page" : undefined}
                                            onClick={() => setAbierto(false)}
                                        >
                                            {etiqueta}
                                        </a>
                                    </li>
                                ))}
                            </ul>                              
                            
                        </>
                    )}

                    {/* BOTONES Y UTILIDADES */}
                    <div className="navbar-utilidades">
                        <label className="navbar-idioma">
                            <Icono nombre="idioma" />
                            <select
                                value={idioma}
                                onChange={(evento) => cambiarIdioma(evento.target.value)}
                                aria-label={nav?.aria?.idioma ?? "Cambiar idioma"}
                            >
                                <option value="es">ES</option>
                                <option value="en">EN</option>
                            </select>
                        </label>

                        <button
                            className="navbar-icono navbar-accesibilidad"
                            type="button"
                            aria-label={ingles ? "Enlarge text" : "Aumentar texto"}
                            aria-pressed={textoGrande}
                            onClick={alternarTexto}
                        >
                            <Icono nombre="accesibilidad" />
                        </button>

                        {/* BOTONES DE INVITADO: Ingresar y Crear cuenta */}
                        {nav && (
                            <div className="navbar-botones-sesion">
                                <a
                                    className="navbar-accion navbar-accion-secundaria"
                                    href="#ingresar"
                                    onClick={() => setAbierto(false)}
                                >
                                    {nav.botones.invitado.ingresar}
                                </a>
                                <a
                                    className="navbar-accion navbar-accion-primaria"
                                    href="#crear-cuenta"
                                    onClick={() => setAbierto(false)}
                                >
                                    {nav.botones.invitado.crearCuenta}
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    );
}