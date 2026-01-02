/**
 * router.js
 * 
 * Gestiona la navegación entre vistas sin recargar la página (SPA Style).
 * Carga contenido HTML dinámicamente en el contenedor #app-main.
 */

document.addEventListener("DOMContentLoaded", () => {
    const main = document.getElementById("app-main");

    // Carga de la vista inicial al entrar al sitio
    loadView("home");

    // Delegación de eventos para capturar clics en elementos con data-view
    document.body.addEventListener("click", (e) => {
        const link = e.target.closest("[data-view]");
        if (!link) return;

        e.preventDefault();

        const view = link.dataset.view;
        navigate(view);
    });

    /**
     * Navega a una nueva vista y actualiza el historial del navegador.
     * @param {string} view - El nombre/ruta de la vista a cargar.
     */
    async function navigate(view) {
        await loadView(view);
        history.pushState({ view }, "", `#/${view}`);
    }

    /**
     * Carga el contenido HTML de una vista desde la carpeta /pages.
     * Notifica a otros scripts disparando el evento 'viewLoaded'.
     * @param {string} view - El nombre de la vista (ej: 'foundations/colors').
     */
    async function loadView(view) {
        try {
            const res = await fetch(`pages/${view}.html`);
            if (!res.ok) throw new Error("404");

            // Inyectar contenido en el contenedor principal
            main.innerHTML = await res.text();

            // Resetear el scroll al inicio después de cada navegación
            main.scrollTo(0, 0);

            /**
             * IMPORTANTE: Notificamos que la vista se ha cargado.
             * Esto permite que scripts como main-nav.js se reinicialicen.
             */
            window.dispatchEvent(new CustomEvent('viewLoaded', {
                detail: { view }
            }));

        } catch (error) {
            // Structured logging for debugging
            console.error('[Router Error]', {
                view,
                error: error.message,
                timestamp: new Date().toISOString(),
                stack: error.stack
            });

            // Differentiate between 404 and network errors
            const is404 = error.message === "404";
            const errorClass = is404 ? "error-container--not-found" : "error-container--network-error";
            const errorTitle = is404 ? "⚠️ Vista no encontrada" : "❌ Error de conexión";
            const errorMessage = is404
                ? `La página "${view}" no existe o no se pudo cargar.`
                : "Hubo un problema al cargar el contenido. Por favor, verifica tu conexión.";

            // Render error component with CSS classes
            main.innerHTML = `
                <div class="error-container ${errorClass}">
                    <h2 class="error-container__title">${errorTitle}</h2>
                    <p class="error-container__message">${errorMessage}</p>
                    <a href="#/home" class="btn btn--primary" data-view="home">Volver al inicio</a>
                </div>
            `;
        }
    }

    /**
     * Maneja el botón de "atrás" y "adelante" del navegador.
     */
    window.addEventListener("popstate", (e) => {
        if (e.state?.view) {
            loadView(e.state.view);
        }
    });
});
