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

## Domain & Deployment
- Production domain: `skoreova.cz`
- Deployed to Cloudflare Workers
- Uses Wrangler for local development and type generation