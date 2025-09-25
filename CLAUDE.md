# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a SvelteKit website for Skóreová (skoreova.cz), built with:
- **SvelteKit** - Full-stack framework with file-based routing
- **Tailwind CSS 4** - Utility-first CSS framework with new Vite integration
- **TypeScript** - Type-safe development
- **Cloudflare Workers** - Serverless deployment platform with edge computing capabilities

## Development Commands

**IMPORTANT**: Always use `bun` instead of `npm` for all package management and script execution in this project.

### Core Development
- `bun dev` - Start development server
- `bun run preview` - Build and preview with Wrangler locally
- `bun run typecheck` - Type check the entire project
- `bun run types` - Generate Cloudflare Worker types
- `bun install` - Install dependencies
- `bun run build` - Build the project for production

### Deployment
- Builds are deployed to Cloudflare Workers
- Uses `@sveltejs/adapter-cloudflare` for Workers compatibility

## Architecture

### File Structure
- `src/routes/` - SvelteKit file-based routing
  - `+layout.svelte` - Global layout with header, footer, and animated background
  - `+page.svelte` - Homepage content
- `src/app.html` - HTML template
- `src/app.css` - Global styles with custom font imports
- `src/app.d.ts` - TypeScript declarations for Cloudflare platform types
- `static/` - Static assets (fonts, favicon, etc.)

### Key Features
- **Animated Background**: Interactive mouse-following radial gradients in the layout
- **Mobile-First Design**: Responsive header with hamburger menu
- **A4 Paper Layout**: Main content styled as paper document (210mm width)
- **Cloudflare Integration**: Platform interface includes `env`, `cf`, and `ctx` for Workers

### Styling Approach
- Uses Tailwind CSS 4 with new Vite plugin integration
- Custom font: SplineSansMono loaded from `/static/fonts/`
- Sticky header with shadow
- Grid-based layout with sidebar
- CSS custom properties for dynamic background gradients

### State Management
- Uses Svelte 5 runes (`$state`, `$props`) for reactive state
- Component-level state in layout for mobile menu and mouse tracking

### TypeScript Configuration
- Extends SvelteKit's generated tsconfig
- Includes Cloudflare Worker types via `worker-configuration.d.ts`
- Strict mode enabled with comprehensive compiler options

### Animation Performance Guidelines
- **Cache Dynamic Imports**: Load animation libraries (GSAP) once in `onMount` and reuse the cached reference
- **Avoid Repeated Dynamic Imports**: Never import animation libraries multiple times during runtime in animation functions
- **Use Transform Over Layout**: Prefer CSS `transform` properties over layout-affecting properties for animations
- **Cache DOM References**: Store frequently-queried DOM elements in variables instead of repeated queries
- **Timeline Over setTimeout**: Use animation library timelines instead of nested `setTimeout` for precise timing
- **Coordinated Timing**: Use single timeline with position parameters (e.g., `0.3`) instead of multiple setTimeout chains
- **Frame-Synchronized Animation**: Animation libraries provide requestAnimationFrame-based timing, unlike setTimeout
- **Reliable State Management**: Use timeline callbacks (`onComplete`) for animation state instead of manual setTimeout timing
- **Element Caching Strategy**: Query DOM elements once and store in object/variables, reuse cached references across animations
- **Fallback Queries**: Always provide fallback DOM queries when cached elements might not exist
- **Null Checks**: Verify cached elements exist before animating to prevent silent failures
- **Unified State Machine**: Use single state enum (`"closed" | "opening" | "open" | "closing"`) instead of multiple boolean flags
- **Animation Interruption**: Always kill existing animations before starting new ones with `timeline.kill()`
- **Derived State**: Use `$derived` for computed states like `isAnimating` based on main state machine
- **Timeline Cleanup**: Store animation references and clean up properly with `onComplete`/`onInterrupt` callbacks
- **Optimize Heavy DOM**: Use viewport-relative heights (`100vh`) with `max-height` instead of fixed heights
- **Performance Hints**: Add `will-change` CSS property for animated elements to promote to compositor layer
- **CSS Containment**: Use `contain: layout style` on animation containers to limit layout recalculation scope
- **Backdrop Optimization**: Use explicit `backdrop-filter` instead of Tailwind classes for better control
- **Eliminate Fallback Queries**: Trust cached element references instead of fallback DOM queries in animation functions
- **Query Validation**: Use element count checks and warnings instead of repeated querySelectorAll calls
- **Optimized Animation Timing**: Use overlapping animations instead of sequential delays for faster perceived performance
- **Reduced Animation Duration**: Shorter individual animations (0.15-0.4s) with staggered starts feel more responsive
- **Smart Overlap**: Start background animations before content animations finish for smoother transitions
- **Data-Driven UI**: Replace duplicate HTML elements with `{#each}` loops and data arrays for maintainability
- **Component Reuse**: Store repetitive UI patterns in arrays with href/label/icon structures
- **Reduced Bundle Size**: Eliminate duplicate code to reduce final bundle size and improve maintainability

### Canvas Performance Guidelines
- **Eliminate Shadow Effects**: Remove `shadowBlur` and `shadowColor` - they are extremely expensive GPU operations
- **Reduce Frame Rate**: Use 30fps instead of 60fps for background animations with `frameInterval` throttling
- **Minimize Composite Operations**: Limit `globalCompositeOperation` changes - each change forces expensive recompositing
- **Visibility-Based Animation**: Pause animations when page/tab is not visible using `visibilitychange` events
- **Simplified Gradients**: Use fewer gradients (2-3 max) instead of 7+ overlapping gradients
- **Canvas Context Optimization**: Set `imageSmoothingQuality: 'low'` for background animations
- **Reduced Motion Amplitude**: Lower sine wave amplitudes (200px vs 400px) for similar visual effect with less computation

## Domain & Deployment
- Production domain: `skoreova.cz`
- Deployed to Cloudflare Workers
- Uses Wrangler for local development and type generation