export function leerCookie(nombre) {
    const pares = document.cookie.split(":");
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