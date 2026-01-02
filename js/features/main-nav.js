/**
 * main-nav.js
 * 
 * Este archivo gestiona la navegación secundaria (enlaces de sección en páginas de fundamentos)
 * e implementa la funcionalidad de Scrollspy para resaltar el enlace activo según el scroll.
 */

// Variable global para persistir el listener y poder removerlo entre cambios de vista
let secondaryNavScrollListener = null;

/**
 * Inicializa el comportamiento de Scrollspy y scroll horizontal automático.
 * Busca secciones con ID y enlaces que apunten a ellas dentro de .main-nav.
 */
function initSecondaryNavScrollspy() {
    const appMain = document.getElementById('app-main');
    const navLinks = document.querySelectorAll('.main-nav__item a');
    const sections = document.querySelectorAll('section[id]');
    const navList = document.querySelector('.main-nav__list');

    if (!appMain || navLinks.length === 0 || sections.length === 0) {
        // Limpieza: si no hay nav secundaria, removemos el listener si existía
        if (secondaryNavScrollListener && appMain) {
            appMain.removeEventListener('scroll', secondaryNavScrollListener);
            secondaryNavScrollListener = null;
        }
        return;
    }

    // Configuración del offset para el scroll
    const navHeightOffset = 150;

    /**
     * Centra el enlace activo en el contenedor de navegación horizontal.
     * Útil para dispositivos móviles y tablets.
     * @param {HTMLElement} activeLink - El elemento <a> que está activo actualmente.
     */
    function centerActiveLink(activeLink) {
        if (!navList || !activeLink) return;

        const navWidth = navList.offsetWidth;
        const linkOffset = activeLink.offsetLeft;
        const linkWidth = activeLink.offsetWidth;

        const scrollPos = linkOffset - (navWidth / 2) + (linkWidth / 2);

        navList.scrollTo({
            left: scrollPos,
            behavior: 'smooth'
        });
    }

    /**
     * Remueve la clase 'active' de todos los enlaces de la navegación secundaria.
     */
    function removeActiveClass() {
        navLinks.forEach(link => link.classList.remove('active'));
    }

    /**
     * Determina qué sección está actualmente en vista y marca el enlace correspondiente.
     */
    function setActiveLinkOnScroll() {
        let currentScroll = appMain.scrollTop;
        let activeFound = false;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - navHeightOffset;
            const sectionBottom = sectionTop + section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (currentScroll >= sectionTop && currentScroll < sectionBottom) {
                const activeLink = document.querySelector(`.main-nav__item a[href="#${sectionId}"]`);

                if (activeLink && !activeLink.classList.contains('active')) {
                    removeActiveClass();
                    activeLink.classList.add('active');
                    centerActiveLink(activeLink);
                }
                activeFound = true;
            }
        });

        // Caso especial: Inicio de página (si estamos muy arriba, activamos el primero)
        if (currentScroll < 10 && !activeFound) {
            removeActiveClass();
            const firstLink = navLinks[0];
            if (firstLink) {
                firstLink.classList.add('active');
                centerActiveLink(firstLink);
            }
        }
    }

    // Limpieza de eventos previos para evitar duplicados al navegar
    if (secondaryNavScrollListener) {
        appMain.removeEventListener('scroll', secondaryNavScrollListener);
    }

    secondaryNavScrollListener = setActiveLinkOnScroll;
    appMain.addEventListener('scroll', secondaryNavScrollListener);

    // Ejecución inicial para marcar el estado correcto al cargar
    setTimeout(setActiveLinkOnScroll, 100);

    // Eventos de clic para respuesta inmediata antes del scroll
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            removeActiveClass();
            this.classList.add('active');
            centerActiveLink(this);
        });
    });
}

// --- Eventos Globales ---

// Se ejecuta cada vez que el router inyecta una nueva vista
window.addEventListener('viewLoaded', (e) => {
    initSecondaryNavScrollspy();
});

// Respaldo para carga inicial de la página
document.addEventListener('DOMContentLoaded', () => {
    initSecondaryNavScrollspy();
});
