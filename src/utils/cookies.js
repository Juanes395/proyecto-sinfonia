export function leerCookie(nombre) {
    const pares = document.cookie.split("; "); // Separa cada cookie en un array
    // Recorremos cada par clave=valor
    for (let par of pares) {
        // Limpiamos los espacios en blanco iniciales o finales
        const [clave, valor] = par.trim().split("=");
        // Si coincide el nombre buscado, retornamos el valor decodificado
        if (clave === nombre) {
            return decodeURIComponent(valor);
        }
    }
    // Si no se encuentra la cookie, retornamos null
    return null;
}

export function guardarCookie(nombre, valor, dias = 365) {
    // Calculamos la fecha de expiración sumando los días al momento actual
    const segundos = dias * 24 * 60 * 60 ; // Días a segundos
    document.cookie = `${nombre}=${encodeURIComponent(valor)}; max-age=${segundos}; path=/; SameSite=Lax`;
}