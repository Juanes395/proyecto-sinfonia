import { useEffect, useRef, useState } from "react";
import Icono from "../Icono.jsx";
import "./Navbar.css";


export default function Navbar({ textos, cargando, error, recargar, idioma, cambiarIdioma, activo = "inicio", onNavegar, onAbrirAccesibilidad }) {
    const [menuAbierto, setMenuAbierto] = useState(false);
    const botonMenuRef = useRef(null);

    const nav = textos?.navbar;
    const menuMovil = textos?.menuMovil;
    // Enlaces y botones principales
    const txtInicio = nav?.enlaces?.inicio;
    const txtCatalogo = nav?.enlaces?.catalogo;
    const txtIngresar = nav?.botones?.invitado?.ingresar;
    const txtCrearCuenta = nav?.botones?.invitado?.crearCuenta;
    // Atributos de accesibilidad (Aria)
    const ariaNav = nav?.aria?.navegacion;
    const ariaLogo = nav?.logo?.aria;
    const ariaIdioma = nav?.aria?.idioma;
    const ariaAccesibilidad = nav?.aria?.accesibilidad;
    const ariaAbrirMenu = menuMovil?.abrir;
    const ariaCerrarMenu = menuMovil?.cerrar;
    // Etiquetas para la vista de menú en celular
    const etiquetaIdioma = menuMovil?.secciones?.idioma;
    const etiquetaAccesibilidad = menuMovil?.secciones?.accesibilidad;

    useEffect(() => {
        function cerrarConEscape(evento) {
            if (evento.key === "Escape" && menuAbierto) {
                setMenuAbierto(false);
                botonMenuRef.current?.focus();
            }
        }
        document.addEventListener("keydown", cerrarConEscape);
        return () => document.removeEventListener("keydown", cerrarConEscape);
    }, [menuAbierto]);

    function navegarA(destino) {
        setMenuAbierto(false);
        if (onNavegar) {
            onNavegar(destino);
        }
    }
    return (
        <header className="navbar">
            <nav className="navbar-interior" aria-label={ariaNav}>
                {/* LOGO */}
                <a
                    className="navbar-marca"
                    href="#inicio"
                    aria-label={ariaLogo}
                    onClick={() => navegarA("inicio")}
                >
                    <Icono nombre="logo" />
                </a>

                {/* ACCIONES MÓVIL  */}
                <div className="navbar-movil-acciones">
                    {txtIngresar && (
                        <a
                            className="navbar-enlace-login-movil"
                            href="#ingresar"
                            onClick={() => navegarA("ingresar")}
                        >
                            {txtIngresar}
                        </a>
                    )}
                    <button
                        ref={botonMenuRef}
                        type="button"
                        className="navbar-icono"
                        aria-label={menuAbierto ? ariaCerrarMenu : ariaAbrirMenu}
                        aria-expanded={menuAbierto}
                        aria-controls="navbar-menu-panel"
                        onClick={() => setMenuAbierto((valor) => !valor)}
                    >
                        <Icono nombre={menuAbierto ? "cerrar" : "menu"} />
                    </button>
                </div>

                {/* PANEL PRINCIPAL */}
                <div
                    id="navbar-menu-panel"
                    className={`navbar-panel${menuAbierto ? " is-abierto" : ""}`}
                    aria-busy={cargando}
                >
                    {/*Cabecera movil*/}
                    <div className="navbar-panel-cabecera-movil">
                        <a
                            className="navbar-marca"
                            href="#inicio"
                            aria-label={ariaLogo}
                            onClick={() => navegarA("inicio")}
                        >
                            <Icono nombre="logo" />
                        </a>
                        <button
                            type="button"
                            className="navbar-icono"
                            aria-label={ariaCerrarMenu}
                            onClick={() => setMenuAbierto(false)}
                        >
                            <Icono nombre="cerrar" />
                        </button>
                    </div>
                    {/* Enlaces de navegación */}
                    <ul className="navbar-enlaces">
                        {txtInicio && (
                            <li>
                                <a
                                    href="#inicio"
                                    aria-current={activo === "inicio" ? "page" : undefined}
                                    onClick={() => navegarA("inicio")}
                                >
                                    {txtInicio}
                                </a>
                            </li>
                        )}
                        {txtCatalogo && (
                            <li>
                                <a
                                    href="#catalogo"
                                    aria-current={activo === "catalogo" ? "page" : undefined}
                                    onClick={() => navegarA("catalogo")}
                                >
                                    {txtCatalogo}
                                </a>
                            </li>
                        )}
                    </ul>
                    {/* BOTONES Y UTILIDADES */}
                    <div className="navbar-utilidades">
                        {/* Botón de opciones de accesibilidad */}
                        <div className="navbar-utilidad-item">
                            {etiquetaAccesibilidad && (
                                <span className="navbar-utilidad-etiqueta-movil">
                                    {etiquetaAccesibilidad}
                                </span>
                            )}
                            <button
                                type="button"
                                className="navbar-icono navbar-icono-accesibilidad"
                                aria-label={ariaAccesibilidad}
                                onClick={() => {
                                    setMenuAbierto(false);
                                    if (onAbrirAccesibilidad) onAbrirAccesibilidad();
                                }}
                            >
                                <Icono nombre="accesibilidad" />
                            </button>
                        </div>
                        {/* Control de idioma (ES | EN) */}
                        <div className="navbar-utilidad-item">
                            {etiquetaIdioma && (
                                <span className="navbar-utilidad-etiqueta-movil">
                                    {etiquetaIdioma}
                                </span>
                            )}
                            <div
                                className="navbar-idioma-pill"
                                role="radiogroup"
                                aria-label={ariaIdioma}
                            >
                                <button
                                    type="button"
                                    role="radio"
                                    aria-checked={idioma === "es"}
                                    className={`navbar-idioma-btn ${idioma === "es" ? "is-activo" : ""}`}
                                    onClick={() => cambiarIdioma("es")}
                                >
                                    ES
                                </button>
                                <button
                                    type="button"
                                    role="radio"
                                    aria-checked={idioma === "en"}
                                    className={`navbar-idioma-btn ${idioma === "en" ? "is-activo" : ""}`}
                                    onClick={() => cambiarIdioma("en")}
                                >
                                    EN
                                </button>
                            </div>
                        </div>
                        {/* BOTONES DE INVITADO: Ingresar y Crear cuenta */}
                        <div className="navbar-botones-sesion">
                            {txtCrearCuenta && (
                                <a
                                    href="#crear-cuenta"
                                    className="navbar-accion navbar-accion-primaria"
                                    onClick={() => navegarA("crear-cuenta")}
                                >
                                    {txtCrearCuenta}
                                </a>
                            )}
                            {txtIngresar && (
                                <a
                                    href="#ingresar"
                                    className="navbar-accion navbar-accion-secundaria"
                                    onClick={() => navegarA("ingresar")}
                                >
                                    {txtIngresar}
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
}