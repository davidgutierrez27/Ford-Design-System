/**
 * theme-toggle.js
 * 
 * Handles the global dark mode toggle for the Design System website.
 * Persists user preference using localStorage.
 */

document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
});

// Support SPA updates
window.addEventListener('viewLoaded', () => {
    // Re-bind listener if button was re-rendered (rare for index.html static elements but good practice)
    initThemeToggle();
});

function initThemeToggle() {
    const toggleBtn = document.getElementById('theme-toggle-button');
    const html = document.documentElement;
    const STORAGE_KEY = 'fds-theme'; // Ford Design System Theme

    // 1. Initial Load: Check storage or system preference
    const savedTheme = localStorage.getItem(STORAGE_KEY);
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        html.setAttribute('data-theme', 'dark');
    } else {
        html.removeAttribute('data-theme');
    }

    if (!toggleBtn) return;

    // Prevent duplicate listeners
    if (toggleBtn.dataset.listenerAttached === 'true') return;

    // 2. Toggle Event
    toggleBtn.addEventListener('click', () => {
        const isDark = html.getAttribute('data-theme') === 'dark';

        if (isDark) {
            html.removeAttribute('data-theme');
            localStorage.setItem(STORAGE_KEY, 'light');
        } else {
            html.setAttribute('data-theme', 'dark');
            localStorage.setItem(STORAGE_KEY, 'dark');
        }
    });

    toggleBtn.dataset.listenerAttached = 'true';
}
