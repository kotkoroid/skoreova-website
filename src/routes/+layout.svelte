<script lang="ts">
import "../app.css";
import { onMount } from "svelte";
import { browser } from "$app/environment";
import AnimationIcon from "$lib/components/AnimationIcon.svelte";
import CloseIcon from "$lib/components/CloseIcon.svelte";
import FacebookIcon from "$lib/components/FacebookIcon.svelte";
import GitHubIcon from "$lib/components/GitHubIcon.svelte";
import HamburgerMenuIcon from "$lib/components/HamburgerMenuIcon.svelte";
import InstagramIcon from "$lib/components/InstagramIcon.svelte";
import InteractiveBackground from "$lib/components/InteractiveBackground.svelte";
import Logo from "$lib/components/Logo.svelte";
import ThreadsIcon from "$lib/components/ThreadsIcon.svelte";
import TikTokIcon from "$lib/components/TikTokIcon.svelte";
import XIcon from "$lib/components/XIcon.svelte";

const { children } = $props();

let lenis: any = null;
let gsap: any = null;

// Unified animation state management
type MenuState = "closed" | "opening" | "open" | "closing";
let menuState = $state<MenuState>("closed");
let currentAnimation: gsap.core.Timeline | null = null;

// Cache DOM elements for animations
let menuElements: {
	background?: HTMLElement;
	items?: HTMLElement[];
	buttons?: HTMLElement[];
} = {};

// Derived states for components
const mobileMenuOpen = $derived(
	menuState === "open" || menuState === "opening" || menuState === "closing",
);
const isAnimating = $derived(
	menuState === "opening" || menuState === "closing",
);

// Menu data for reduced duplication
const menuItems = [
	{ href: "#home", label: "Domů" },
	{ href: "#features", label: "Funkce" },
	{ href: "#analytics", label: "Analytika" },
	{ href: "#teams", label: "Týmy" },
	{ href: "#contact", label: "Kontakt" },
];

const socialLinks = [
	{ href: "https://facebook.com/skoreova", icon: FacebookIcon },
	{ href: "https://instagram.com/skoreova", icon: InstagramIcon },
	{ href: "https://tiktok.com/@skoreova", icon: TikTokIcon },
	{ href: "https://x.com/Skoreova", icon: XIcon },
	{ href: "https://threads.com/@skoreova", icon: ThreadsIcon },
	{ href: "https://github.com/falkara", icon: GitHubIcon },
];

function resetAnimationState() {
	if (currentAnimation) {
		currentAnimation.kill();
		currentAnimation = null;
	}
	menuState = "closed";
}

async function toggleMobileMenu() {
	// Prevent multiple clicks during animation
	if (isAnimating) return;

	if (mobileMenuOpen) {
		await closeMobileMenu();
	} else {
		await openMobileMenu();
	}
}

async function openMobileMenu() {
	// Cancel any existing animation
	if (currentAnimation) {
		currentAnimation.kill();
	}

	menuState = "opening";

	if (!gsap) {
		console.warn("GSAP not loaded, using fallback");
		menuState = "open";
		return;
	}

	// Wait for DOM to render before starting animations
	requestAnimationFrame(() => {
		// Cache DOM elements once
		menuElements.background = document.querySelector(
			".full-pink-bg",
		) as HTMLElement;
		menuElements.items = Array.from(
			document.querySelectorAll(".menu-item"),
		) as HTMLElement[];
		menuElements.buttons = Array.from(
			document.querySelectorAll(".menu-button"),
		) as HTMLElement[];

		// Create master timeline for coordinated animation
		currentAnimation = gsap.timeline({
			onComplete: () => {
				menuState = "open";
				currentAnimation = null;
			},
			onInterrupt: () => {
				currentAnimation = null;
			},
		});

		// Background roll animation
		if (menuElements.background) {
			currentAnimation.fromTo(
				menuElements.background,
				{
					scaleY: 0,
					transformOrigin: "top",
				},
				{
					scaleY: 1,
					duration: 0.6,
					ease: "power2.out",
				},
			);
		}

		// Menu items animation (starts while background is still animating)
		if (menuElements.items && menuElements.items.length > 0) {
			currentAnimation.fromTo(
				menuElements.items,
				{
					y: -15,
					opacity: 0,
				},
				{
					y: 0,
					opacity: 1,
					duration: 0.4,
					stagger: 0.06,
					ease: "power1.out",
				},
				0.25, // Start earlier for faster perceived loading
			);
		}

		// Buttons animation
		if (menuElements.buttons && menuElements.buttons.length > 0) {
			currentAnimation.fromTo(
				menuElements.buttons,
				{
					y: 10,
					opacity: 0,
				},
				{
					y: 0,
					opacity: 1,
					duration: 0.35,
					stagger: 0.08,
					ease: "power1.out",
				},
				0.45, // Start sooner and overlap with menu items
			);
		}
	});
}

async function closeMobileMenu() {
	// Cancel any existing animation
	if (currentAnimation) {
		currentAnimation.kill();
	}

	menuState = "closing";

	if (!gsap) {
		console.warn("GSAP not loaded, using fallback animation");
		menuState = "closed";
		return;
	}

	// Use cached elements if available, otherwise fallback to queries
	const itemsAndButtons = [
		...(menuElements.items || []),
		...(menuElements.buttons || []),
	];

	// Skip animation if no cached elements (shouldn't happen in normal flow)
	if (itemsAndButtons.length === 0) {
		console.warn("No cached menu elements found, skipping content animation");
	}

	// Create close animation timeline
	currentAnimation = gsap.timeline({
		onComplete: () => {
			menuState = "closed";
			currentAnimation = null;
		},
		onInterrupt: () => {
			currentAnimation = null;
		},
	});

	// Animate content and background with optimized overlap timing
	if (itemsAndButtons.length > 0) {
		currentAnimation.to(itemsAndButtons, {
			y: -10,
			opacity: 0,
			duration: 0.15,
			ease: "power1.in",
		});
	}

	// Start background animation slightly before content finishes for smoother transition
	if (menuElements.background) {
		currentAnimation.to(
			menuElements.background,
			{
				scaleY: 0,
				duration: 0.4,
				ease: "power2.inOut",
			},
			0.1, // Start 0.1s after timeline begins (overlaps with content animation)
		);
	}
}

onMount(() => {
	if (browser) {
		// Load GSAP once and cache it
		setTimeout(async () => {
			try {
				const gsapModule = await import("gsap");
				gsap = gsapModule.gsap;
			} catch (error) {
				console.warn("Failed to load GSAP:", error);
			}
		}, 50);

		// Defer non-critical smooth scrolling until after initial render
		setTimeout(async () => {
			try {
				const { default: Lenis } = await import("lenis");
				await import("lenis/dist/lenis.css");

				lenis = new Lenis({
					duration: 1.2,
					easing: (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t)),
				});

				function raf(time: number) {
					lenis.raf(time);
					requestAnimationFrame(raf);
				}

				requestAnimationFrame(raf);
			} catch (error) {
				console.warn("Failed to load Lenis smooth scrolling:", error);
			}
		}, 100);

		return () => {
			lenis?.destroy();
		};
	}
});
</script>

<!-- Interactive Background -->
<InteractiveBackground />

<!-- Backdrop blur overlay - optimized for performance -->
{#if mobileMenuOpen}
	<div class="fixed inset-0 z-40 bg-black/20" style="backdrop-filter: blur(8px); will-change: opacity;"></div>
{/if}

<!-- Combined Header/Menu -->
<div class="fixed top-0 left-0 right-0 z-50 md:backdrop-blur-md" style="contain: layout style;">
	<!-- Header background - always visible -->
	<div class={`${!mobileMenuOpen ? 'backdrop-blur-md border-b border-white/10' : ''}`} style={!mobileMenuOpen ? 'background-color: rgba(15, 23, 42, 0.2);' : ''}>

		<!-- Header pink background - optimized with dynamic height -->
		{#if mobileMenuOpen}
			<!-- Dynamic height background that adapts to content -->
			<!-- <div class="full-pink-bg bg-gradient-to-b from-purple-600 via-pink-500 to-pink-400 absolute top-0 left-0 right-0 origin-top border-b border-white/10" style="height: 100vh; max-height: 680px; transform: scaleY(0); will-change: transform;"></div> -->
			<div class="full-pink-bg bg-gradient-to-b from-purple-600 via-pink-500 to-pink-400 absolute top-0 left-0 right-0 origin-top border-b border-white/10" style="height: 100vh; max-height: 160px; transform: scaleY(0); will-change: transform;"></div>
		{/if}

	<!-- Header Content -->
	<nav class={`max-w-7xl mx-auto px-4 py-2.5 relative z-10 ${mobileMenuOpen ? 'border-b border-white/10' : ''}`}>
		<div class="flex items-center justify-between min-h-[3.75rem]">
			<!-- Logo -->
			<div class="flex items-center space-x-4">
				<div class="h-16 w-16 bg-white rounded-full shadow-lg flex items-center justify-center">
					<Logo size={72} color="#000000" />
				</div>
				<span class="text-white font-bold text-3xl uppercase tracking-wide">Skóreová</span>
			</div>

			<!-- Desktop Navigation Links -->
			<!-- <div class="hidden md:flex items-center space-x-8">
				<a href="#home" class="text-white/80 hover:text-white transition-colors">Domů</a>
				<a href="#features" class="text-white/80 hover:text-white transition-colors">Funkce</a>
				<a href="#analytics" class="text-white/80 hover:text-white transition-colors">Analytika</a>
				<a href="#teams" class="text-white/80 hover:text-white transition-colors">Týmy</a>
				<a href="#contact" class="text-white/80 hover:text-white transition-colors">Kontakt</a>
			</div> -->

			<!-- Desktop Social Icons -->
			<div class="hidden md:flex items-center space-x-2">
				{#each socialLinks as social}
					<a
						href={social.href}
						target="_blank"
						class="p-3 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-500 hover:border-transparent hover:shadow-lg hover:shadow-pink-500/25 hover:scale-110 transition-all duration-300 transform"
					>
						<social.icon size={18} color="white" class="hover:text-white transition-colors drop-shadow-sm" />
					</a>
				{/each}
			</div>

			<!-- Mobile Menu Button -->
			<button
				class={`md:hidden text-white p-2 rounded-lg transition-colors ${isAnimating ? '' : 'hover:bg-white/10'}`}
				onclick={toggleMobileMenu}
				disabled={isAnimating}
			>
				{#if isAnimating}
					<AnimationIcon size={32} color="white" class="animate-bounce-stretch" />
				{:else if mobileMenuOpen}
					<CloseIcon size={32} color="white" />
				{:else}
					<HamburgerMenuIcon size={32} color="white" />
				{/if}
			</button>
		</div>
	</nav>

	<!-- Mobile Menu Content (only visible when menu is open) -->
	{#if mobileMenuOpen}
		<div class="md:hidden relative z-10 pb-4" style="will-change: transform, opacity;">
			<!-- Mobile Navigation -->
			<!-- <nav class="px-6 pt-2 space-y-0">
				{#each menuItems as item}
					<a
						href={item.href}
						class="menu-item block py-6 text-2xl font-medium text-white hover:text-pink-200 transition-colors border-b border-white/20 opacity-0"
						onclick={closeMobileMenu}
					>
						{item.label}
					</a>
				{/each}
			</nav> -->

			<!-- Social Media Icons -->
			<div class="px-6 py-4">
				<div class="flex items-center justify-center space-x-6">
					{#each socialLinks as social}
						<a href={social.href} target="_blank" class="menu-item opacity-0 p-2 rounded-full hover:bg-white/20 transition-colors">
							<social.icon size={24} color="white" class="hover:text-pink-200 transition-colors" />
						</a>
					{/each}
				</div>
			</div>

			<!-- CTA Button -->
			<!-- <div class="px-6 pt-6 pb-4">
				<button
					class={`menu-button w-full bg-white text-pink-500 py-4 rounded-xl text-lg font-semibold hover:bg-pink-50 transition-colors opacity-0 ${mobileMenuOpen && !isAnimating ? 'buzzing-border' : ''}`}
					onclick={closeMobileMenu}
				>
					SPUSTIT APLIKACI
				</button>
			</div> -->


		</div>
	{/if}
	</div>
</div>



<main class="relative z-10">
	{@render children()}
</main>

<style>
	:global(html) {
		scroll-behavior: auto;
		margin: 0;
		padding: 0;
		overflow-x: hidden;
	}

	:global(body) {
		margin: 0;
		padding: 0;
		background: #0f172a;
		min-height: 100vh;
		overflow-x: hidden;
	}

	:global(.animate-bounce-stretch) {
		animation: bounce-stretch 0.8s ease-in-out infinite;
	}

	@keyframes bounce-stretch {
		0%, 100% {
			transform: scale(1);
		}
		25% {
			transform: scale(1.1, 0.9);
		}
		50% {
			transform: scale(1.2);
		}
		75% {
			transform: scale(0.9, 1.1);
		}
	}

	.buzzing-border {
		border: 2px solid transparent;
		background: linear-gradient(#ffffff, #ffffff) padding-box,
		           linear-gradient(90deg, #ff1493, #ff6b6b, #ffffff, #ff8c42, #ff1493) border-box;
		background-size: 100% 100%, 200% 100%;
		animation: buzzing-colors 2s linear infinite;
	}

	@keyframes buzzing-colors {
		0% {
			background-position: 0% 50%;
		}
		100% {
			background-position: 200% 50%;
		}
	}
</style>
