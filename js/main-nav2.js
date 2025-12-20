// nav-secundaria.js

/**
 * Lógica para inicializar el Scrollspy en la navegación secundaria
 * (la que tiene los enlaces a #seccion1, #seccion2, etc.)
 */
function initSecondaryNavScrollspy() {
    // 1. Intentamos seleccionar los elementos de la navegación secundaria.
    // Si la nav secundaria no está en la vista actual, estas variables serán listas vacías.
    const navLinks = document.querySelectorAll('.main-nav__item a');
    const sections = document.querySelectorAll('section[id]');

    // Si no encontramos enlaces o secciones, salimos de la función.
    // Esto previene errores en vistas que no tienen la nav secundaria.
    if (navLinks.length === 0 || sections.length === 0) {
        console.log("Nav secundaria o secciones no encontradas en la vista actual. Inicialización omitida.");

        // Es importante limpiar cualquier listener de scroll anterior si existe,
        // aunque con addEventListener/removeEventListener esto se manejaría mejor.
        // Por simplicidad, asumiremos que si no hay nav, no hay listeners que limpiar.
        return;
    }

    console.log(`Nav secundaria encontrada. Inicializando Scrollspy para ${navLinks.length} enlaces.`);

    // --- Variables y Funciones del Scrollspy ---
    const navHeightOffset = 100; // Ajusta esto si la altura de tu nav cambia (debe coincidir con scroll-margin-top en CSS)

    function removeActiveClass() {
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
    }

    function setActiveLinkOnScroll() {
        let currentScroll = window.scrollY;
        let activeFound = false;

        // Debug: log current scroll position
        console.log('Current scroll:', currentScroll);

        sections.forEach(section => {
            const sectionTop = section.offsetTop - navHeightOffset;
            const sectionBottom = sectionTop + section.offsetHeight;
            const sectionId = section.getAttribute('id');

            // Debug: log section info
            console.log(`Section ${sectionId}: top=${sectionTop}, bottom=${sectionBottom}, height=${section.offsetHeight}`);

            if (currentScroll >= sectionTop && currentScroll < sectionBottom) {
                removeActiveClass();
                const activeLink = document.querySelector(`.main-nav__item a[href="#${sectionId}"]`);

                if (activeLink) {
                    activeLink.classList.add('active');
                    console.log(`Activated link for section: ${sectionId}`);
                } else {
                    console.warn(`No link found for section: ${sectionId}`);
                }
                activeFound = true;
            }
        });

        // Manejo especial para el inicio de la página
        if (currentScroll === 0 && !activeFound) {
            removeActiveClass();
            // Asume que el primer enlace es el objetivo predeterminado si estamos arriba
            const firstLink = navLinks[0];
            if (firstLink) {
                firstLink.classList.add('active');
                console.log('Activated first link (top of page)');
            }
        }

        if (!activeFound && currentScroll > 0) {
            console.warn('No active section found for current scroll position');
        }
    }

    // --- Event Listeners Específicos para la Navegación Secundaria ---

    // 1. Activación por Scroll
    window.addEventListener('scroll', setActiveLinkOnScroll);

    // 2. Activación al cargar la vista (para el estado inicial)
    // Es mejor usar un pequeño setTimeout para asegurar que el DOM se haya renderizado y las alturas sean correctas.
    setTimeout(setActiveLinkOnScroll, 100);

    // 3. Manejo de Clics
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            // Activa inmediatamente el botón al hacer clic
            removeActiveClass();
            this.classList.add('active');

            // Opcional: El scroll se encargará de disparar setActiveLinkOnScroll
            // una vez que la animación de scroll termine.
        });
    });

    // NOTA AVANZADA: Limpieza de Eventos
    // En una SPA, si cambias de vista, debes eliminar este listener de scroll.
    // De lo contrario, se acumularán múltiples listeners, uno por cada vez que cargues la vista.
    // Si la función setActiveLinkOnScroll es única (no anónima), puedes hacer:
    // window.addEventListener('beforeunload', () => window.removeEventListener('scroll', setActiveLinkOnScroll));
    // Pero eso es más complejo para este ejemplo. Por ahora, nos quedamos con la inicialización.
}


// --- PUNTO DE ENTRADA EN LA SPA ---

// Escuchamos el evento personalizado que dispara tu router (router.js)
window.addEventListener('viewLoaded', (e) => {
    // Aquí es donde sabemos que la nueva vista ha sido inyectada en el DOM.
    const viewName = e.detail.view;

    // Opcional: Solo inicializa si sabes que la vista contiene la nav secundaria
    // Ejemplo: Si solo está en la vista 'documentation' o 'system-colors'
    // if (viewName === 'documentation') {
    initSecondaryNavScrollspy();
    // }

    // Como no sabemos el nombre de la vista que contendrá la nav,
    // llamaremos a la función y dejaremos que se autoverifique internamente.
    initSecondaryNavScrollspy();
});
