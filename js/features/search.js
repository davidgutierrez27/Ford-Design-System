document.addEventListener("DOMContentLoaded", () => {
    const search = document.querySelector(".search");
    if (!search) return;

    const input = search.querySelector(".search__input");
    const clearBtn = search.querySelector(".search__clear");

    if (!input || !clearBtn) return;

    // --------------------------------------------------
    // Helpers
    // --------------------------------------------------

    const hasValue = () => input.value.trim().length > 0;

    const updateClearState = () => {
        clearBtn.classList.toggle("is-visible", hasValue());
    };

    const clearSearch = () => {
        input.value = "";
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.focus();
    };

    // --------------------------------------------------
    // Events
    // --------------------------------------------------

    input.addEventListener("input", updateClearState);
    clearBtn.addEventListener("click", clearSearch);

    // Focus automático al clickear el contenedor
    search.addEventListener("click", () => {
        input.focus();
    });

    // Estado inicial
    updateClearState();
});
