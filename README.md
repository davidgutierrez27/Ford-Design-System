# Ford Design System - Documentation Project

Este es el repositorio del Sistema de Diseño de Ford, enfocado en documentar los principios de diseño, componentes y fundamentos para asegurar la consistencia en todas las plataformas digitales.

## 🚀 Estructura del Proyecto

```text
/
├── assets/          # Imágenes e iconos
├── css/             # CSS compilado (No editar directamente)
├── js/              # Lógica de navegación, búsqueda y temas
│   ├── main-nav.js  # Gestión de scrollspy y navegación secundaria
│   ├── router.js    # Carga dinámica de páginas (SPA)
│   └── search.js    # Lógica del buscador global
├── pages/           # Vistas HTML (Home, Fundaciones, Componentes)
│   ├── foundations/ # Colores, Tipografía, Radius, Spacing, Icons, Grid
│   └── components/  # Botones, Inputs, etc.
├── scss/            # Código fuente de estilos (Sass)
│   ├── base/        # Reset y estilos globales
│   ├── layout/      # Estructura (Sidebar, Nav, Layout)
│   ├── atoms/       # Estilos de componentes básicos
│   ├── pages/       # Estilos específicos por página
│   └── _tokens.scss # El corazón del sistema: colores y tipografía
├── index.html       # Punto de entrada principal
└── package.json     # Configuración de scripts y dependencias
```

## 🛠️ Comandos Básicos

El proyecto utiliza **SASS** para la gestión de estilos.

### Desarrollo (Modo Watch)
Para vigilar los cambios en los archivos `.scss` y compilarlos automáticamente en tiempo real:
```bash
npm run sass
```

### Producción (Compilación única)
Para generar el archivo CSS final optimizado:
```bash
npm run build
```

## 📖 Guía de Ayuda Rápida
Puedes encontrar más detalles sobre comandos de SASS y flujo de trabajo con **GitHub** en el archivo:
`scss/ayuda.scss`

## 🎨 Principios de Diseño
- **Coherencia**: Uso estricto de tokens definidos en `_tokens.scss`.
- **Accesibilidad**: Respeto a los contrastes WCAG y legibilidad.
- **SPA (Single Page Application)**: El sistema carga las páginas dinámicamente sin recargar el navegador, gestionado por `router.js`.

---
*Desarrollado para el equipo de diseño y desarrollo de Ford.*
