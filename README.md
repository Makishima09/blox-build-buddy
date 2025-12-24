# 🍎 Blox Fruits Companion

> Tu compañero definitivo para dominar Blox Fruits en Roblox

[![React](https://img.shields.io/badge/React-18.3-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-purple?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)

Una aplicación web moderna y completa diseñada para ayudar a los jugadores de Blox Fruits a optimizar sus builds, simular matchups PVP y explorar información detallada sobre todas las frutas del juego.

## ✨ Características Principales

### 🎮 Simulador PVP
- **Análisis de Matchups**: Simula enfrentamientos entre tu build y la de tu rival
- **Score Detallado**: Obtén un score de 0-100 con breakdown completo
- **Razones Explicadas**: Entiende por qué ganas o pierdes cada matchup
- **Recomendaciones**: Recibe sugerencias específicas para mejorar tu build
- **Tips de Batalla**: Consejos contextuales para cada situación
- **Compartir Resultados**: Genera URLs compartibles con tus simulaciones

### ⚡ Optimizador de Builds
- **Recomendaciones Inteligentes**: Obtén builds optimizadas según tu objetivo (PVP, Farm, Boss)
- **Ruta de Mejora**: Sigue una ruta priorizada para mejorar tu build actual
- **Alternativas**: Explora diferentes opciones de builds
- **Justificaciones**: Entiende el razonamiento detrás de cada recomendación
- **Métricas de Mejora**: Visualiza el impacto esperado de cada cambio

### 📚 Guía de Frutas
- **Catálogo Completo**: Explora todas las frutas del juego con información detallada
- **Filtros Avanzados**: Busca por nombre, tier (S, A, B, C) y tipo (Paramecia, Logia, Zoan)
- **Información Detallada**: Tags, stats óptimas, counters y sinergias
- **Organización Intuitiva**: Navega fácilmente por tipos de frutas

### 🌍 Internacionalización
- **Español e Inglés**: Interfaz completamente traducida
- **Cambio Dinámico**: Alterna entre idiomas sin recargar la página

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+ ([instalar con nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- npm o yarn

### Instalación

```bash
# 1. Clonar el repositorio
git clone <YOUR_GIT_URL>
cd blox-build-buddy

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo con hot-reload

# Producción
npm run build        # Construye la aplicación para producción
npm run preview      # Previsualiza la build de producción

# Calidad de Código
npm run lint         # Ejecuta el linter
```

## 🛠️ Tecnologías Utilizadas

### Core
- **[React 18](https://react.dev/)** - Biblioteca UI
- **[TypeScript](https://www.typescriptlang.org/)** - Tipado estático
- **[Vite](https://vitejs.dev/)** - Build tool y dev server

### UI & Estilos
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS utility-first
- **[shadcn/ui](https://ui.shadcn.com/)** - Componentes UI accesibles
- **[Framer Motion](https://www.framer.com/motion/)** - Animaciones fluidas
- **[Radix UI](https://www.radix-ui.com/)** - Componentes primitivos accesibles
- **[Lucide React](https://lucide.dev/)** - Iconos modernos

### Estado y Routing
- **[Zustand](https://zustand-demo.pmnd.rs/)** - Gestión de estado ligera
- **[React Router DOM](https://reactrouter.com/)** - Enrutamiento
- **[TanStack Query](https://tanstack.com/query)** - Gestión de datos y caché

### Formularios y Validación
- **[React Hook Form](https://react-hook-form.com/)** - Formularios performantes
- **[Zod](https://zod.dev/)** - Validación de esquemas

## 📁 Estructura del Proyecto

```
blox-build-buddy/
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── shared/         # Componentes compartidos (FruitSelect, WeaponSelect, etc.)
│   │   └── ui/              # Componentes UI de shadcn
│   ├── data/                # Datos estáticos (JSON)
│   │   ├── fruits.json      # Base de datos de frutas
│   │   ├── weapons.json     # Base de datos de armas
│   │   ├── matchups.json    # Tabla de matchups
│   │   └── presets.json     # Builds predefinidas
│   ├── hooks/               # Custom hooks
│   │   └── useLanguage.tsx  # Hook de internacionalización
│   ├── logic/               # Lógica de negocio
│   │   ├── matchupScorer.ts # Cálculo de matchups PVP
│   │   └── buildOptimizer.ts # Optimización de builds
│   ├── pages/               # Páginas de la aplicación
│   │   ├── Index.tsx        # Página principal
│   │   ├── Simulator.tsx    # Simulador PVP
│   │   ├── Optimizer.tsx    # Optimizador de builds
│   │   ├── Fruits.tsx       # Guía de frutas
│   │   └── NotFound.tsx     # Página 404
│   ├── types/               # Definiciones TypeScript
│   ├── App.tsx              # Componente raíz
│   └── index.css            # Estilos globales
├── public/                   # Assets estáticos
├── MILESTONE.md             # Registro de cambios y roadmap
└── package.json             # Dependencias y scripts
```

## 🎯 Funcionalidades en Detalle

### Simulador PVP

El simulador te permite analizar enfrentamientos entre builds:

1. **Configura tu Build**: Selecciona nivel (1-2800), fruta, arma, pistola, estilo de pelea y enfoque de stats
2. **Configura el Build Rival**: Define el build de tu oponente
3. **Obtén Análisis**: Recibe un score detallado con:
   - Razones de ventaja/desventaja
   - Recomendaciones de mejora (counters)
   - Tips estratégicos contextuales
   - Nivel de confianza del resultado

### Optimizador de Builds

Obtén recomendaciones personalizadas:

1. **Define tu Objetivo**: PVP, Farm o Boss
2. **Ingresa tu Build Actual** (opcional): Para comparar y generar ruta de mejora
3. **Recibe Recomendaciones**: 
   - Build óptima para tu objetivo
   - Ruta de mejora priorizada
   - Alternativas de builds
   - Justificación detallada

### Guía de Frutas

Explora el catálogo completo:

- **Búsqueda**: Encuentra frutas por nombre
- **Filtros**: Por tier (S, A, B, C) y tipo (Paramecia, Logia, Zoan)
- **Información**: Tags, stats óptimas, counters y sinergias

## 📊 Base de Datos

El proyecto incluye una base de datos completa:

- **20+ Frutas**: Con información detallada de tiers, tipos, tags y counters
- **37 Espadas**: Desde tier C hasta tier S
- **15 Pistolas**: Incluyendo armas legendarias
- **5 Estilos de Pelea**: Todos los estilos principales
- **Matchups**: Tabla de ventajas/desventajas entre frutas
- **Presets**: Builds recomendadas por objetivo

## 🌐 Internacionalización

La aplicación soporta múltiples idiomas:

- **Español** (predeterminado)
- **Inglés**

Todos los textos de la interfaz, resultados, razones, counters y tips están completamente traducidos.

## 🚧 Estado del Proyecto

### ✅ Completado (MVP)

- ✅ Simulador PVP funcional
- ✅ Optimizador de builds
- ✅ Guía de frutas
- ✅ Sistema de traducciones completo
- ✅ Base de datos de armas y frutas
- ✅ Interfaz moderna y responsive

### 🔄 En Desarrollo

- 🔄 Completar base de datos de frutas (hasta 41 frutas)
- 🔄 Expandir tabla de matchups
- 🔄 Mejorar sistema de sinergias

### 📋 Planificado

- 📋 Boss Helper (recomendaciones por boss)
- 📋 Farming Route Generator
- 📋 Sistema de builds guardadas
- 📋 Historial de simulaciones
- 📋 Comparación lado a lado de builds
- 📋 Tema claro/oscuro

Ver [MILESTONE.md](./MILESTONE.md) para el roadmap completo.

## 🤝 Contribuir

Las contribuciones son bienvenidas! Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 🙏 Agradecimientos

- [Blox Fruits Wiki](https://blox-fruits.fandom.com/) - Por la información detallada del juego
- [shadcn/ui](https://ui.shadcn.com/) - Por los componentes UI increíbles
- Comunidad de Blox Fruits - Por el feedback y sugerencias

## 📞 Contacto

¿Tienes preguntas o sugerencias? Abre un issue en el repositorio.

---

**Desarrollado con ❤️ para la comunidad de Blox Fruits**
