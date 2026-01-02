document.addEventListener("DOMContentLoaded", () => {
    const sidebar = document.querySelector(".sidebar");
    const menuButton = document.getElementById("menu-button");

    // 1. Create Overlay dynamically
    const overlay = document.createElement("div");
    overlay.classList.add("sidebar-overlay");
    document.body.appendChild(overlay);

    // 2. Logic to Open/Close
    function toggleSidebar() {
        sidebar.classList.toggle("sidebar--active");
        overlay.classList.toggle("sidebar-overlay--active");
    }

    function closeSidebar() {
        sidebar.classList.remove("sidebar--active");
        overlay.classList.remove("sidebar-overlay--active");
    }

    // 3. Listeners
    if (menuButton) {
        menuButton.addEventListener("click", (e) => {
            e.stopPropagation();
            toggleSidebar();
        });
    }

    overlay.addEventListener("click", closeSidebar);

    // Close when clicking a link (optional, good for UX)
    // We delegate this inside the existing click listener for optimization, 
    // or add a specific check here. Let's add it to the existing listener below.

    // ACTIVE → single active item in the entire sidebar
    function clearActive() {
        sidebar
            .querySelectorAll(".dropdown__btn--active")
            .forEach(el => el.classList.remove("dropdown__btn--active"));
    }

    // OPEN-ACTIVE → caret only, there can be multiple
    function clearOpenActive() {
        sidebar
            .querySelectorAll(".dropdown__btn--open-active")
            .forEach(el => el.classList.remove("dropdown__btn--open-active"));
    }

    // EVENT DELEGATION
    sidebar.addEventListener("click", (e) => {
        const btn = e.target.closest(".dropdown__btn");
        if (!btn) return;

        const isToggle = btn.classList.contains("dropdown-toggle");

        // DROPDOWN TOGGLE
        if (isToggle) {
            const targetId = btn.dataset.target;
            const content = document.getElementById(targetId);
            if (!content) return;

            const isOpen =
                content.classList.contains("dropdown__content--open");

            // 1 ACTIVE → this dropdown always becomes the focus
            clearActive();
            btn.classList.add("dropdown__btn--active");

            // 2 TOGGLE OPEN
            content.classList.toggle("dropdown__content--open");

            // 3 CARET
            if (!isOpen) {
                // opens
                btn.classList.add("dropdown__btn--open-active");
            } else {
                // closes
                btn.classList.remove("dropdown__btn--open-active");
            }

            return;
        }

        // ITEM FINAL (links, buttons, etc.)
        clearActive();
        btn.classList.add("dropdown__btn--active");

        // Mobile: Close sidebar on navigation
        if (window.innerWidth <= 1024) {
            closeSidebar();
        }
    });

    // 4. Initial State (Always Home on Physical Load)
    const homeBtn = sidebar.querySelector('[data-view="home"]');
    if (homeBtn) {
        homeBtn.classList.add("dropdown__btn--active");
    }
});

