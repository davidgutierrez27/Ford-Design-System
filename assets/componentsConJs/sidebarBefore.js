/**
 * ARCHIVO: sidebar.js
 * Descripción: Define el Custom Element <app-sidebar>,
 * optimizando la carga del template HTML externo de forma asíncrona y usando caché.
 */

// Variable global (dentro del scope del módulo) para almacenar el template cacheado.
// Se inicializa a null y contendrá una referencia al nodo <template> una vez cargado.
let CACHED_TEMPLATE = null;

// ------------------------------------------------------------------
// Función de utilidad para cargar archivos HTML externos usando Fetch
// ------------------------------------------------------------------
/**
 * Carga un archivo de texto/HTML desde una URL dada.
 * @params {string} path - La URL del recurso HTML.
 * @returnss {Promise<string|null>} El texto del HTML o null si hay error.
 */
async function loadTemplate(path) {
    try {
        const res = await fetch(path);

        if (!res.ok) {
            // Lanza un error si la respuesta HTTP no es exitosa (ej. 404 Not Found)
            throw new Error(`HTTP ${res.status} al cargar ${path}`);
        }

        return await res.text();
    } catch (err) {
        // Captura errores de red o errores HTTP
        console.error("Error cargando template:", err);
        return null;
    }
}

// ------------------------------------------------------------------
// Función principal para precargar y parsear el template ANTES de que se necesite
// ------------------------------------------------------------------
/**
 * Inicializa y cachea el template de la barra lateral.
 * Esta función es asíncrona y se ejecuta una sola vez al cargar el script.
 */
async function initializeSidebarTemplate() {
    if (CACHED_TEMPLATE) return; // Si ya está cargado, no hacemos nada.

    try {
        // Calcula la URL absoluta del archivo sidebar.html
        const scriptUrl = new URL(import.meta.url);
        const templateUrl = new URL("sidebar.html", scriptUrl).href;

        // Espera a que se descargue el HTML
        const html = await loadTemplate(templateUrl);
        if (!html) return;

        // ✅ Solución para el error `innerHTML` y parsing eficiente:
        // Usamos DOMParser para convertir la cadena de texto HTML en un objeto Document
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        // Extraemos la etiqueta <template id="sidebar-template"> del documento parseado
        const template = doc.querySelector("#sidebar-template");

        if (!template) {
            console.error("❌ No se encontró #sidebar-template en el archivo HTML.");
            return;
        }

        // ✅ Cacheamos la referencia al nodo <template> real
        CACHED_TEMPLATE = template;
        console.log("Template de sidebar cargado y cacheado exitosamente.");

    } catch (e) {
        console.warn("No se pudo inicializar el template de sidebar:", e);
    }
}


// ------------------------------------------------------------------
// Definición de la Clase del Custom Element <app-sidebar>
// ------------------------------------------------------------------
class AppSidebar extends HTMLElement {

    /**
     * El connectedCallback se ejecuta cuando el elemento es añadido al DOM.
     * Es crucial que esta función sea lo más RÁPIDA y SÍNCRONA posible.
     */
    connectedCallback() {
        if (this.hasChildNodes()) return; // Evita renderizar dos veces si el elemento se mueve en el DOM

        // ✅ Eliminamos 'await' y 'fetch' de aquí. Ahora solo usamos la caché SÍNCRONAMENTE.
        if (CACHED_TEMPLATE) {
            // 1. Clonamos el contenido del template cacheado de forma instantánea.
            this.appendChild(CACHED_TEMPLATE.content.cloneNode(true));

            // 2. Inicializamos la funcionalidad JS (dropdowns)
            this.initDropdowns();

            // 3. Añadimos una clase de CSS para indicar que el componente está listo/visible
            this.classList.add("ready");
        } else {
            // Manejamos el caso de error si la precarga falló (lo cual ya no debería pasar con el fix de arriba)
            console.error("Template cacheado no disponible. El componente no se renderizó.");
            // Aquí se podría mostrar un spinner de carga o un mensaje de error si se desea
        }
    }


    /**
     * Lógica para manejar el estado de los dropdowns (tu código original, que funciona bien)
     */
    initDropdowns() {
        // ... (Tu código de initDropdowns original va aquí, sin cambios) ...
        const STORAGE_KEY = "sidebarDropdownState";
        let state;

        try {
            state = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
        } catch {
            console.warn("Estado del sidebar corrupto, reiniciando");
            state = {};
        }

        const toggles = this.querySelectorAll(".dropdown-toggle");

        toggles.forEach(toggle => {
            const targetId = toggle.dataset.target;
            if (!targetId) return;

            const content = this.querySelector(`#${targetId}`);
            if (!content) return;

            // Restaurar estado
            if (state[targetId]) {
                content.classList.add("dropdown__content--open");
                toggle.classList.add("active");
            }

            toggle.addEventListener("click", () => {
                const isOpen = content.classList.toggle("dropdown__content--open");
                toggle.classList.toggle("active");

                state[targetId] = isOpen;

                try {
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
                } catch {
                    console.warn("No se pudo guardar el estado del sidebar");
                }
            });
        });
    }
}


// ------------------------------------------------------------------
// Orquestación y Definición del Custom Element
// ------------------------------------------------------------------

// 1. Ejecutamos la precarga del template. Esto inicia el FETCH asíncrono.
// Usamos .finally() para asegurarnos de que la definición del elemento ocurra SIEMPRE.
initializeSidebarTemplate()
    .catch(error => {
        // Captura cualquier error que initializeSidebarTemplate no manejó internamente
        console.error("Error crítico durante la inicialización del template:", error);
    })
    .finally(() => {
        // 2. Una vez que el template está *intentado* cargar, definimos el Custom Element.
        // Esto permite que el navegador "hidrate" cualquier <app-sidebar> que encuentre en el HTML.
        if (!customElements.get("app-sidebar")) { // Evita un error si intentas definirlo dos veces
            customElements.define("app-sidebar", AppSidebar);
            console.log("Custom Element <app-sidebar> definido y listo.");
        }
    });

