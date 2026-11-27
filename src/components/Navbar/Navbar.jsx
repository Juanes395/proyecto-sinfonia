import { useEffect, useRef, useState } from "react";
import Icono from "../Icono.jsx";
import "./Navbar.css";


export default function Navbar({ textos, cargando, error, recargar, idioma, cambiarIdioma, activo = "inicio", onNavegar, onAbrirAccesibilidad, ocultarEnMovil = false, usuario = null, onCerrarSesion }) {
    const [menuAbierto, setMenuAbierto] = useState(false);
    const botonMenuRef = useRef(null);
    const [cuentaAbierta, setCuentaAbierta] = useState(false);
    const menuCuentaRef = useRef(null);

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
    // Textos de sesión iniciada desde GET /textos
    const ariaMenuCuenta = nav?.usuario?.menu;
    const txtCerrarSesion = nav?.usuario?.cerrarSesion;
    const txtCuentaMovil = menuMovil?.secciones?.cuenta;
    const txtCerrarSesionMovil = menuMovil?.botones?.conSesion?.cerrarSesion || txtCerrarSesion;
    // Calcula las iniciales a partir del nombre del usuario
    const iniciales = (usuario?.nombre || "")
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((parte) => parte[0]?.toUpperCase() || "")
        .join("");
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
            setCuentaAbierta(false)
            onNavegar(destino);
        }
    }
    useEffect(() => {
        function cerrarConEscape(evento) {
            if (evento.key === "Escape") {
                if (menuAbierto) {
                    setMenuAbierto(false);
                    botonMenuRef.current?.focus();
                }
                if (cuentaAbierta) {
                    setCuentaAbierta(false);
                }
            }
        }

        function cerrarAlClicFuera(evento) {
            if (
                cuentaAbierta &&
                menuCuentaRef.current &&
                !menuCuentaRef.current.contains(evento.target)
            ) {
                setCuentaAbierta(false);
            }
        }

        document.addEventListener("keydown", cerrarConEscape);
        document.addEventListener("mousedown", cerrarAlClicFuera);
        return () => {
            document.removeEventListener("keydown", cerrarConEscape);
            document.removeEventListener("mousedown", cerrarAlClicFuera);
        };
    }, [menuAbierto, cuentaAbierta]);

    function manejarCerrarSesion() {
        setCuentaAbierta(false);
        setMenuAbierto(false);
        if (onCerrarSesion) onCerrarSesion();
    }
    return (
        <header className={`navbar${ocultarEnMovil ? " navbar--ocultar-movil" : ""}`}>
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
                    {!usuario && txtIngresar && (
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
                        {!usuario ? (
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
                                        href="#ingresar "
                                        className="navbar-accion navbar-accion-secundaria"
                                        onClick={() => navegarA("ingresar")}
                                    >
                                        {txtIngresar}
                                    </a>
                                )}
                            </div>
                        ) : (
                            <>
                                {/* Menú desplegable de cuenta en escritorio */}
                                <div className="navbar-cuenta-web" ref={menuCuentaRef}>
                                    <button
                                        type="button"
                                        className="navbar-avatar-btn"
                                        aria-label={ariaMenuCuenta}
                                        aria-expanded={cuentaAbierta}
                                        aria-haspopup="menu"
                                        onClick={() => setCuentaAbierta((v) => !v)}
                                    >
                                        {iniciales}
                                    </button>

                                    {cuentaAbierta && (
                                        <div className="navbar-cuenta-menu" role="menu">
                                            <div className="navbar-cuenta-cabecera">
                                                <span className="navbar-avatar-mini" aria-hidden="true">
                                                    {iniciales}
                                                </span>
                                                <div className="navbar-cuenta-datos">
                                                    <strong className="navbar-cuenta-nombre">{usuario.nombre}</strong>
                                                    <span className="navbar-cuenta-correo">{usuario.correo}</span>
                                                </div>
                                            </div>

                                            <button
                                                type="button"
                                                role="menuitem"
                                                className="navbar-cuenta-salir"
                                                onClick={manejarCerrarSesion}
                                            >
                                                <Icono nombre="cerrarSesion" />
                                                <span>{txtCerrarSesion}</span>
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Tarjeta de cuenta al fondo del menú móvil */}
                                <div className="navbar-cuenta-movil">
                                    <div className="navbar-cuenta-movil-info">
                                        <span
                                            className="navbar-avatar-movil"
                                            style={usuario.colorHex ? { backgroundColor: usuario.colorHex } : undefined}
                                            aria-hidden="true"
                                        >
                                            {iniciales}
                                        </span>
                                        <div className="navbar-cuenta-datos">
                                            <strong className="navbar-cuenta-nombre">
                                                {usuario.nombre?.split(" ")[0] || usuario.nombre}
                                            </strong>
                                            {txtCuentaMovil && (
                                                <span className="navbar-cuenta-estado">{txtCuentaMovil}</span>
                                            )}
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        className="navbar-cuenta-salir-movil"
                                        onClick={manejarCerrarSesion}
                                    >
                                        {txtCerrarSesionMovil}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    );
}