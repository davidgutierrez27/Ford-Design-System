document.addEventListener("DOMContentLoaded", () => {
    const main = document.getElementById("app-main");

    // Cargar vista inicial
    loadView("home");

    document.body.addEventListener("click", (e) => {
        const link = e.target.closest("[data-view]");
        if (!link) return;

        e.preventDefault();

        const view = link.dataset.view;
        navigate(view);
    });

    async function navigate(view) {
        await loadView(view);
        history.pushState({ view }, "", `#/${view}`);
    }

    async function loadView(view) {
        try {
            const res = await fetch(`/pages/${view}.html`);
            if (!res.ok) throw new Error("404");

            main.innerHTML = await res.text();
        } catch {
            main.innerHTML = "<h2>⚠️ Vista no encontrada</h2>";
        }
    }

    // volver/adelante del navegador
    window.addEventListener("popstate", (e) => {
        if (e.state?.view) {
            loadView(e.state.view);
        }
    });
});
