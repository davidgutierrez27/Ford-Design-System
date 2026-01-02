/**
 * nav-theme.js
 * Control simplificado de la clase .active en la navegación.
 */

(function () {
    const initNavTheme = () => {
        const nav = document.querySelector('.nav-bar');
        // Buscamos el contenedor de scroll (ajusta '.landing-main' si el ID es diferente)
        const scrollContainer = document.querySelector('.landing-main') || document.getElementById('app-main');

        if (!nav) return;

        const updateNav = (scrollTop) => {
            // Si el scroll no es 0, añade 'active'. Si es 0, la quita.
            if (scrollTop > 0) {
                nav.classList.add('active');
            } else {
                nav.classList.remove('active');
            }
        };

        // Escucha el scroll en el contenedor específico (si existe) y en la ventana global
        const handleScrollEvent = (e) => {
            const target = e.target === document ? (document.documentElement || document.body) : e.target;
            updateNav(target.scrollTop || window.scrollY);
        };

        // Registrar eventos en ambos para asegurar captura
        window.addEventListener('scroll', handleScrollEvent, { passive: true });
        if (scrollContainer) {
            scrollContainer.addEventListener('scroll', handleScrollEvent, { passive: true });
        }

        // Ejecución inmediata para detectar posición inicial al cargar
        const initialScroll = scrollContainer ? scrollContainer.scrollTop : window.scrollY;
        updateNav(initialScroll);
    };

    // Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initNavTheme);
    } else {
        initNavTheme();
    }
})();


