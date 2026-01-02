/**
 * router.js
 * Manages navigation between views without page reloads (SPA Style).
 * Dynamically loads HTML content into the #app-main container.
 */

document.addEventListener("DOMContentLoaded", () => {
    const main = document.getElementById("app-main");

    // Initial view load (Always Home by default on refresh)
    if (window.location.hash) {
        history.replaceState(null, "", "index.html");
    }
    loadView("home");

    // Event delegation to capture clicks on elements with data-view
    document.body.addEventListener("click", (e) => {
        const link = e.target.closest("[data-view]");
        if (!link) return;

        e.preventDefault();

        const view = link.dataset.view;
        navigate(view);
    });

    /**
     * Navigates to a new view and updates the browser history.
     * @param {string} view - The name/path of the view to load.
     */
    async function navigate(view) {
        await loadView(view);
        history.pushState({ view }, "", `#/${view}`);
    }

    /**
     * Loads the HTML content of a view from the /pages folder.
     * Notifies other scripts by firing the 'viewLoaded' event.
     * @param {string} view - The name of the view (e.g., 'foundations/colors').
     */
    async function loadView(view) {
        try {
            const res = await fetch(`pages/${view}.html`);
            if (!res.ok) throw new Error("404");

            // Inject content into the main container
            main.innerHTML = await res.text();

            // Reset scroll to top after each navigation
            main.scrollTo(0, 0);

            /**
             * IMPORTANT: Notify that the view has loaded.
             * This allows scripts like main-nav.js to re-initialize.
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
            const errorTitle = is404 ? "⚠️ View Not Found" : "❌ Connection Error";
            const errorMessage = is404
                ? `The page "${view}" doesn't exist or couldn't be loaded.`
                : "There was a problem loading the content. Please check your connection.";

            // Render error component with CSS classes
            main.innerHTML = `
                <div class="error-container ${errorClass}">
                    <h2 class="error-container__title">${errorTitle}</h2>
                    <p class="error-container__message">${errorMessage}</p>
                    <a href="#/home" class="btn btn--primary" data-view="home">Back to home</a>
                </div>
            `;
        }
    }

    /**
     * Handles the browser's "back" and "forward" buttons.
     */
    window.addEventListener("popstate", (e) => {
        if (e.state?.view) {
            loadView(e.state.view);
        }
    });
});
