
# Registro de uso de Inteligencia Artificial 

## Entrada 1 — 2026-11-11: Generación dinámica de portadas desde la API
* **Herramienta utilizada:** Gemini
* **Objetivo:** Implementar las portadas vectoriales de álbumes y géneros según la guía de diseño de Figma sin guardar 25 archivos SVG estáticos.
* **Consulta / Prompt:** Se compartieron los componentes `TarjetaPista.jsx` y `TarjetaGenero.jsx` junto con la guía de portadas de Figma para conectar el objeto `portada` devuelto por la API.
* **Resultado y aplicación:** Se implementó el componente `PortadaSvg` que renderiza dinámicamente los patrones (`0` anillos, `1` rayas, `2` colina y `3` puntos) utilizando los colores `fondo`, `figura` y `detalle` enviados por los endpoints `/generos` y `/generos/:id`.

---
## Entrada 2 — 2026-11-11: Eliminación del respaldo local de la API en `useTextos.js`
* **Herramienta utilizada:** Gemini
* **Objetivo:** Cambia el hook `useTextos` para consultar los textos de la interfaz desde `GET /textos` de forma general y no especifica para el navbar.
* **Respuesta equivocada de la IA y cómo se corrigió:**
  * **Fallo:** Al generar el hook `useTextos.js`, la IA incluyó una URL de respaldo (*fallback*) hardcodeada en caso de que la variable de entorno `VITE_API_URL` no estuviera definida, evitando ver si la variable habia quedado bien implementada
  * **Corrección manual:** Se eliminó el operador de respaldo de la constante `API_BASE`, dejándola conectada únicamente a `import.meta.env.VITE_API_URL` para que toda la configuración dependa exclusivamente del entorno.

---

## Entrada 3 — 2026-11-11: Corrección de atributos SVG en JSX 
* **Herramienta utilizada:** Gemini
* **Objetivo:** Resolver errores en consola al importar ilustraciones desde Figma
* **Resultado y aplicación:**
  * Se corrigieron los atributos SVG exportados desde Figma (`clip-path` → `clipPath`, `flood-opacity` → `floodOpacity`, `color-interpolation-filters` → `colorInterpolationFilters`) en `Icono.jsx` e `InicioPublico.jsx`.
