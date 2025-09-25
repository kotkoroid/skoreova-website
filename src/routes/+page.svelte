<script lang="ts">
import { onMount } from "svelte";
import { animations, initGSAP } from "$lib/animations";
import LazyImage from "$lib/components/LazyImage.svelte";
import PlayerCard from "$lib/components/PlayerCard.svelte";
import LockIcon from "$lib/components/LockIcon.svelte";

// Player data
const players = [
	{
		name: "Kristýna",
		surname: "Růžičková",
		image: "/Kristyna-Ruzickova.png",
		position: "CM",
		team: "SK Slavia Praha",
	},
	{
		name: "Tamara",
		surname: "Morávková",
		image: "/Tamara-Moravkova.png",
		position: "CB",
		team: "AC Sparta Praha",
	},
	{
		name: "Jana",
		surname: "Žufanková",
		image: "/Jana-Zufankova.png",
		position: "ST",
		team: "FC Baník Ostrava",
	},
	{
		name: "Kamila",
		surname: "Dubcová",
		image: "/Kamila-Dubcova.png",
		position: "GK",
		team: "SK Slavia Praha",
	},
	{
		name: "Vanesa",
		surname: "Jílková",
		image: "/Vanesa-Jilkova.png",
		position: "CDM",
		team: "AC Sparta Praha",
	},
	{
		name: "Barbora",
		surname: "Votíková",
		image: "/Barbora-Votikova.png",
		position: "LW",
		team: "FC Baník Ostrava",
	},
	{
		name: "Antonie",
		surname: "Starová",
		image: "/Antonie-Starova.png",
		position: "RB",
		team: "SK Slavia Praha",
	},
];

// Duplicate players for seamless loop
const duplicatedPlayers = [...players, ...players];

let gsap: any = null;
let scrollTween: any = null;

// Scroll animation states for collage
let imageSection1: HTMLElement;
let imageSection2: HTMLElement;
let imageSection3: HTMLElement;
let textOverlay1: HTMLElement;
let textOverlay2: HTMLElement;
let textOverlay3: HTMLElement;
let collageTimeline: any = null;

function startCarouselAnimation() {
	if (!gsap) return;

	const carousel = document.querySelector(".carousel-track");
	if (!carousel) return;

	// Create infinite scroll animation
	scrollTween = gsap.to(carousel, {
		x: -1680, // Width of 7 cards (240px each + 24px gap)
		duration: 20,
		ease: "none",
		repeat: -1,
		onRepeat: () => {
			gsap.set(carousel, { x: 0 });
		},
	});
}

function pauseCarousel() {
	if (scrollTween) {
		scrollTween.pause();
	}
}

function resumeCarousel() {
	if (scrollTween) {
		scrollTween.resume();
	}
}

onMount(async () => {
	// Defer all animations until after critical page load
	setTimeout(async () => {
		try {
			await initGSAP();

			// Import GSAP here for carousel with error handling
			const gsapModule = await import("gsap");
			gsap = gsapModule.gsap;

			// Stagger animation initialization for better performance
			// Hero title is now visible from start - no animation needed

			// CTA button is now visible from start - no animation needed

			// Player carousel is now visible from start - no animation needed

			// Start carousel after all critical animations
			setTimeout(() => {
				startCarouselAnimation();
			}, 1500);

			// Defer scroll-based animations until user interaction
			setTimeout(() => {
				animations.staggerFadeInUp(".feature-card");
				animations.scaleOnScroll(".stats-section");
				animations.parallax(".parallax-bg", { distance: -200 });
			}, 2000);
		} catch (error) {
			console.warn("Failed to initialize animations:", error);
		}
	}, 200); // Defer by 200ms to allow critical rendering

	// Initialize GSAP scroll animations for collage
	setTimeout(() => {
		if (!gsap) return;

		// Create master timeline for collage animations
		collageTimeline = gsap.timeline({ paused: true });

		// Set initial states for text overlays
		if (textOverlay1) gsap.set(textOverlay1, { opacity: 0, scale: 0.9 });
		if (textOverlay2) gsap.set(textOverlay2, { opacity: 0, scale: 0.9 });
		if (textOverlay3) gsap.set(textOverlay3, { opacity: 0, scale: 0.9 });

		// Intersection Observer with GSAP animations
		const observerOptions = {
			root: null,
			rootMargin: "0px",
			threshold: 0.5, // Trigger when 50% of element is in view
		};

		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					// Animate in with GSAP
					if (entry.target === imageSection1 && textOverlay1) {
						gsap.to(textOverlay1, {
							opacity: 1,
							scale: 1,
							duration: 0.8,
							ease: "power2.out",
						});
					} else if (entry.target === imageSection2 && textOverlay2) {
						gsap.to(textOverlay2, {
							opacity: 1,
							scale: 1,
							duration: 0.8,
							ease: "power2.out",
						});
					} else if (entry.target === imageSection3 && textOverlay3) {
						gsap.to(textOverlay3, {
							opacity: 1,
							scale: 1,
							duration: 0.8,
							ease: "power2.out",
						});
					}
				} else {
					// Animate out with GSAP
					if (entry.target === imageSection1 && textOverlay1) {
						gsap.to(textOverlay1, {
							opacity: 0,
							scale: 0.9,
							duration: 0.5,
							ease: "power2.in",
						});
					} else if (entry.target === imageSection2 && textOverlay2) {
						gsap.to(textOverlay2, {
							opacity: 0,
							scale: 0.9,
							duration: 0.5,
							ease: "power2.in",
						});
					} else if (entry.target === imageSection3 && textOverlay3) {
						gsap.to(textOverlay3, {
							opacity: 0,
							scale: 0.9,
							duration: 0.5,
							ease: "power2.in",
						});
					}
				}
			});
		}, observerOptions);

		// Observe all image sections
		if (imageSection1) observer.observe(imageSection1);
		if (imageSection2) observer.observe(imageSection2);
		if (imageSection3) observer.observe(imageSection3);

		// Store cleanup function
		return () => {
			observer.disconnect();
			if (collageTimeline) collageTimeline.kill();
		};
	}, 500); // Wait for GSAP to be loaded
});
</script>

<!-- Hero Section -->
<section class="relative h-screen box-border flex items-start justify-center overflow-hidden pt-17 md:pt-24">
	<!-- Hero Content -->
	<div class="relative z-40 text-center text-white px-4 max-w-6xl mx-auto">
		<h1 class="font-test hero-title text-[5rem] md:text-8xl lg:text-9xl font-medium opacity-100 leading-loose tracking-wider relative">
			<div class="text-white" style="text-rendering: optimizeLegibility; -webkit-font-smoothing: antialiased; transform: rotateX(20deg);">OBJEVTE</div>
			<div class="text-white" style="text-rendering: optimizeLegibility; -webkit-font-smoothing: antialiased; transform: translateY(-0.5rem) rotateX(-20deg);">FOTBAL</div>
			<div class="absolute inset-0 flex items-center justify-center z-10 text-[5.5rem] md:text-[6.5rem] lg:text-[8.5rem]">
				<div class="relative bg-gradient-to-r from-pink-500 via-pink-400 via-rose-400 via-pink-300 to-pink-500 bg-clip-text text-transparent" style="text-rendering: optimizeLegibility; -webkit-font-smoothing: antialiased; font-feature-settings: 'kern' 1, 'liga' 1; line-height: 1.5;">&nbsp;ŽENSKÝ&nbsp;</div>
			</div>
		</h1>

		<!-- <div class="hero-cta opacity-100 flex justify-center mb-20">
			<button class="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 px-12 py-6 md:px-16 md:py-8 rounded-lg md:rounded-2xl text-xl md:text-3xl font-semibold md:font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl hover:shadow-pink-500/25">
				SPUSTIT
			</button>
		</div> -->

		<div class="hero-cta opacity-100 flex justify-center mb-20">
			<button class="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 px-12 py-6 md:px-16 md:py-8 rounded-lg md:rounded-2xl text-xl md:text-3xl font-semibold md:font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl hover:shadow-gray-500/25 cursor-not-allowed" disabled>
				<div class="flex items-center gap-3 md:gap-4">
					<LockIcon size={24} color="white" class="md:w-8 md:h-8" />
					<span>JIŽ BRZY</span>
				</div>
			</button>
		</div>

		<!-- Player Cards Carousel -->
		<!-- <div class="player-carousel opacity-100 mb-12 relative z-20">
			<div role="presentation" class="overflow-hidden" on:mouseenter={pauseCarousel} on:mouseleave={resumeCarousel}>
				<div class="carousel-track flex gap-6 pb-4">
					{#each duplicatedPlayers as player, index}
						<PlayerCard {player} />
					{/each}
				</div>
			</div>
		</div> -->

	</div>

	<!-- Player Images at Bottom -->
	<div class="absolute bottom-0 left-0 right-0 pointer-events-none z-30">
		<!-- Left Player - Consistent positioning across all breakpoints -->
		<LazyImage
			src="/RuzickovaBg.png"
			alt="Ruzickova"
			class="absolute bottom-0 lg:-bottom-20 left-0 h-[36rem] md:h-[44rem] lg:h-[46rem] xl:h-[48rem] w-auto object-cover opacity-80 transform -translate-x-50 md:-translate-x-45 lg:-translate-x-40"
			threshold={0.1}
		/>

		<!-- Right Player - Consistent positioning across all breakpoints -->
		<LazyImage
			src="/BgBartonova.png"
			alt="Bartonova"
			class="absolute bottom-0 lg:-bottom-24 right-0 h-[36rem] md:h-[44rem] lg:h-[46rem] xl:h-[48rem] w-auto object-cover opacity-80 transform translate-x-12 md:translate-x-0 lg:-translate-x-10"
			threshold={0.1}
		/>
	</div>
</section>
