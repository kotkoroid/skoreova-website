<script lang="ts">
import { onDestroy, onMount } from "svelte";
import { slide, fade } from "svelte/transition";
import { quintOut, cubicOut } from "svelte/easing";
import PlayerCard from "$lib/components/PlayerCard.svelte";
import HeroTitle from "$lib/components/HeroTitle.svelte";
import HeroTitleAccent from "$lib/components/HeroTitleAccent.svelte";
import type { Player, CardPosition } from "$lib/types.js";

// Mouse tracking for cursor-following background
let mouseX = $state(0);
let mouseY = $state(0);
let targetX = $state(0);
let targetY = $state(0);

function handleMouseMove(event: MouseEvent) {
	targetX = event.clientX;
	targetY = event.clientY + window.scrollY;
}

// Smooth animation loop
function animate() {
	mouseX += (targetX - mouseX) * 0.1;
	mouseY += (targetY - mouseY) * 0.1;
	requestAnimationFrame(animate);
}

// Start animation on mount
if (typeof window !== "undefined") {
	animate();
}

let currentPlayer = $state(0);
let isTransitioning = $state(false);
let carouselInterval: ReturnType<typeof setInterval> | undefined;

const players: Player[] = [
	{
		image: "/Barbora-Votikova.png",
		name: "Barbora Votíková",
		club: "SK Slavia Praha",
		position: "GK",
		nationality: "Německo",
		goals: 24,
		assists: 8,
	},
	{
		image: "/Jana-Zufankova.png",
		name: "Jana Žufánková",
		club: "SK Slavia Praha",
		position: "CM",
		nationality: "Španělsko",
		goals: 18,
		assists: 15,
	},
	{
		image: "/Kamila-Dubcova.png",
		name: "Kamila Dubcová",
		club: "SK Slavia Praha",
		position: "LW",
		nationality: "Švédsko",
		goals: 12,
		assists: 11,
	},
	{
		image: "/Kristyna-Ruzickova.png",
		name: "Kristýna Růžičková",
		club: "SK Slavia Praha",
		position: "CB",
		nationality: "Nizozemsko",
		goals: 3,
		assists: 7,
	},
	{
		image: "/Tamara-Moravkova.png",
		name: "Tamara Morávková",
		club: "SK Slavia Praha",
		position: "CB",
		nationality: "Česká republika",
		goals: 0,
		assists: 0,
	},
	{
		image: "/Vanesa-Jilkova.png",
		name: "Vanesa Jílková",
		club: "SK Slavia Praha",
		position: "RM",
		nationality: "Německo",
		goals: 14,
		assists: 9,
	},
];

function nextPlayer() {
	currentPlayer = (currentPlayer + 1) % players.length;
}

function goToPlayer(index: number) {
	previousPlayer = currentPlayer;
	// Calculate shortest path direction
	const totalPlayers = players.length;
	const diff = index - currentPlayer;
	const wrappedDiff = ((diff + totalPlayers) % totalPlayers);

	if (wrappedDiff <= totalPlayers / 2) {
		direction = wrappedDiff > 0 ? 1 : 0;
	} else {
		direction = -1;
	}

	currentPlayer = index;
	resetCarouselTimer();
}

function startCarouselTimer() {
	carouselInterval = setInterval(nextPlayer, 4000);
}

function resetCarouselTimer() {
	if (carouselInterval) {
		clearInterval(carouselInterval);
	}
	startCarouselTimer();
}

function previousPlayerNav() {
	previousPlayer = currentPlayer;
	currentPlayer = (currentPlayer - 1 + players.length) % players.length;
	direction = -1;
	resetCarouselTimer();
}

function nextPlayerNav() {
	goToPlayer((currentPlayer + 1) % players.length);
	resetCarouselTimer();
}

function handleKeydown(event: KeyboardEvent) {
	switch (event.key) {
		case "ArrowLeft":
			event.preventDefault();
			previousPlayerNav();
			break;
		case "ArrowRight":
			event.preventDefault();
			nextPlayerNav();
			break;
		case "Home":
			event.preventDefault();
			goToPlayer(0);
			resetCarouselTimer();
			break;
		case "End":
			event.preventDefault();
			goToPlayer(players.length - 1);
			resetCarouselTimer();
			break;
		case " ":
		case "Enter":
			event.preventDefault();
			resetCarouselTimer();
			break;
	}
}

// Responsive screen size tracking
let screenSize = $state('desktop'); // 'mobile', 'tablet', 'desktop'

function updateScreenSize() {
	if (typeof window !== 'undefined') {
		const width = window.innerWidth;
		if (width < 768) {
			screenSize = 'mobile';
		} else if (width < 1024) {
			screenSize = 'tablet';
		} else {
			screenSize = 'desktop';
		}
	}
}

// Get visible players - always show 5 cards on all screen sizes
const visiblePlayers = $derived.by(() => {
	const visible: Array<{player: Player, index: number, position: CardPosition}> = [];
	const totalPlayers = players.length;

	// Always show 5 cards (far-left, left, center, right, far-right)
	const farLeftIndex = (currentPlayer - 2 + totalPlayers) % totalPlayers;
	visible.push({
		player: players[farLeftIndex],
		index: farLeftIndex,
		position: "far-left",
	});

	const leftIndex = (currentPlayer - 1 + totalPlayers) % totalPlayers;
	visible.push({
		player: players[leftIndex],
		index: leftIndex,
		position: "left",
	});

	// Center card (main)
	visible.push({
		player: players[currentPlayer],
		index: currentPlayer,
		position: "center",
	});

	const rightIndex = (currentPlayer + 1) % totalPlayers;
	visible.push({
		player: players[rightIndex],
		index: rightIndex,
		position: "right",
	});

	const farRightIndex = (currentPlayer + 2) % totalPlayers;
	visible.push({
		player: players[farRightIndex],
		index: farRightIndex,
		position: "far-right",
	});

	return visible;
});

onMount(() => {
	startCarouselTimer();
	updateScreenSize(); // Initial screen size check
	if (typeof window !== "undefined") {
		window.addEventListener("keydown", handleKeydown);
		window.addEventListener("resize", updateScreenSize);
	}
});

onDestroy(() => {
	if (carouselInterval) {
		clearInterval(carouselInterval);
	}
	if (typeof window !== "undefined") {
		window.removeEventListener("keydown", handleKeydown);
		window.removeEventListener("resize", updateScreenSize);
	}
});
</script>

<style>
@keyframes float {
	0%, 100% { transform: translateY(0px) rotate(0deg); }
	33% { transform: translateY(-8px) rotate(1deg); }
	66% { transform: translateY(4px) rotate(-0.5deg); }
}

@keyframes breathe {
	0%, 100% { transform: scale(1); }
	50% { transform: scale(1.02); }
}

.animate-float {
	animation: float 6s ease-in-out infinite;
}

.animate-breathe {
	animation: breathe 3s ease-in-out infinite;
}





/* Hero Grid Layout */
.hero-wrapper {
	position: relative;
	margin-bottom: 0;
}

.hero-background {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	pointer-events: none;
}

.hero-grid-container {
	display: grid;
	z-index: 20;
	margin: 0;
	padding: 0;
}

/* Mobile Grid Layout */
@media (max-width: 767px) {
	.hero-grid-container {
		grid-template-areas:
			"hero-text"
			"cta-button"
			"player-cards"
			"logos";
		grid-template-rows: auto auto auto auto;
		grid-template-columns: 1fr;
	}
}

/* Tablet Grid Layout */
@media (min-width: 768px) and (max-width: 1023px) {
	.hero-grid-container {
		grid-template-areas:
			". hero-text ."
			". cta-button ."
			". player-cards ."
			"logos logos logos";
		grid-template-rows: auto auto auto auto;
		grid-template-columns: 1fr minmax(400px, 700px) 1fr;
	}
}

/* Desktop Grid Layout */
@media (min-width: 1024px) {
	.hero-grid-container {
		grid-template-areas:
			". hero-text ."
			". cta-button ."
			". player-cards ."
			"logos logos logos";
		grid-template-rows: auto auto auto auto;
		grid-template-columns: 1fr minmax(600px, 1000px) 1fr;
	}

	/* Side image pseudo-elements for desktop */
	.hero-grid-container::before {
		content: '';
		position: absolute;
		left: 0;
		top: 40%;
		width: 600px;
		height: 600px;
		background: url('/RuzickovaBg.png') no-repeat center;
		background-size: contain;
		transform: translateX(-35%);
		z-index: 10;
		pointer-events: none;
	}

	.hero-grid-container::after {
		content: '';
		position: absolute;
		right: 0;
		top: 40%;
		width: 600px;
		height: 600px;
		background: url('/KoptovaBg.png') no-repeat center;
		background-size: contain;
		transform: translateX(25%);
		z-index: 10;
		pointer-events: none;
	}
}

/* Remaining CSS classes that are still needed for complex responsive grid layouts */
</style>

<!-- NEW GRID-BASED HERO SECTION -->
<section class="hero-wrapper pt-20 w-full overflow-x-hidden">
	<!-- Background layer with mouse-following gradients -->
	<div
		class="absolute top-0 left-0 w-full h-full pointer-events-none"
		style="z-index: 0; background:
			radial-gradient(800px circle at {mouseX}px {mouseY}px, rgba(58, 9, 110, 0.4), transparent 70%),
			radial-gradient(600px circle at {mouseX + 200}px {mouseY + 100}px, rgba(58, 9, 110, 0.3), transparent 70%),
			radial-gradient(1000px circle at {mouseX - 150}px {mouseY - 100}px, rgba(58, 9, 110, 0.2), transparent 70%),
			linear-gradient(135deg, #3a096e 0%, #1e0b40 50%, #000000 100%)"
		onmousemove={handleMouseMove}
		role="application"
	></div>

	<!-- Background images as actual elements -->
	<div class="absolute -left-12 top-32 w-56 h-56 z-10 pointer-events-none opacity-50 lg:w-[600px] lg:h-[600px] lg:-left-52 lg:top-[40%] lg:opacity-100">
		<img src="/RuzickovaBg.png" alt="" class="w-full h-full object-contain" />
	</div>
	<div class="absolute -right-12 top-32 w-56 h-56 z-10 pointer-events-none opacity-50 lg:w-[600px] lg:h-[600px] lg:-right-40 lg:top-[40%] lg:opacity-100">
		<img src="/KoptovaBg.png" alt="" class="w-full h-full object-contain" />
	</div>

	<!-- Grid container for content -->
	<div class="hero-grid-container relative text-white overflow-visible grid m-0 p-0 z-20 gap-0
		max-md:grid-cols-1 max-md:[grid-template-areas:'hero-text''cta-button''player-cards''logos'] max-md:[grid-template-rows:auto_auto_clamp(400px,35vh,600px)_auto]
		md:max-lg:[grid-template-areas:'.hero-text.''.cta-button.''.player-cards.''logos_logos_logos'] md:max-lg:[grid-template-rows:auto_auto_clamp(450px,30vh,600px)_auto] md:max-lg:[grid-template-columns:1fr_minmax(400px,700px)_1fr]
		lg:[grid-template-areas:'.hero-text.''.cta-button.''.player-cards.''logos_logos_logos'] lg:[grid-template-rows:auto_auto_clmp(500px,25vh,700px)_auto] lg:[grid-template-columns:1fr_minmax(600px,1000px)_1fr]">
		<!-- Hero text section -->
		<div class="[grid-area:hero-text]">
			<div class="flex flex-col items-center justify-center relative overflow-visible -space-y-8 border-2 border-dashed border-white/30">
				<HeroTitle text="OBJEVTE" />
				<div class="animate-breathe relative z-26">
					<HeroTitleAccent text="ŽENSKÝ" />
				</div>
				<div class="-mt-2">
					<HeroTitle text="FOTBAL" />
				</div>
			</div>
		</div>
		<!-- CTA button section -->
		<div class="[grid-area:cta-button]">
			<div class="h-30 flex items-center justify-center border-2 border-dashed border-white/30 relative">
				<div class="absolute top-2.5 left-2.5 text-xs opacity-70 z-30">CTA BUTTON AREA</div>
				<a
					href="/hub"
					class="inline-block py-4 px-12 bg-gradient-to-r from-pink-300 via-pink-400 to-pink-500 text-white no-underline font-bold text-[clamp(1.2rem,2vw,1.5rem)] rounded-full tracking-widest shadow-[1px_1px_2px_rgba(0,0,0,0.3)] drop-shadow-[0_20px_25px_rgba(0,0,0,0.1)] transition-all duration-300 hover:scale-105 hover:drop-shadow-[0_25px_50px_rgba(0,0,0,0.25)]"
				>
					SPUSTIT
				</a>
			</div>
		</div>
		<div class="[grid-area:player-cards]">
			<div class="h-[500px] flex items-center justify-center border-2 border-dashed border-white/30 relative">
				<div class="absolute top-2.5 left-2.5 text-xs opacity-70 z-30">PLAYER CARDS AREA</div>
				<div class="w-full h-[340px] flex items-center justify-center relative">
					{#each visiblePlayers as { player, index, position } (position)}
						<PlayerCard
							{player}
							{position}
							onClick={() => goToPlayer(index)}
						/>
					{/each}
				</div>
			</div>
		</div>
		<div class="[grid-area:logos] bg-white z-30">
			<div class="relative">
				<div class="absolute top-2.5 left-2.5 text-xs opacity-70 z-30 text-gray-600 border-2 border-dashed border-black/30 px-2 py-1 bg-white/80">LOGOS AREA</div>
				<div class="py-12 px-8">
					<div class="text-center">
						<!-- Traditional Brands -->
						<h2 class="text-2xl md:text-3xl font-bold text-gray-800 mb-8 tracking-wider">
							TRADIČNÍ ZNAČKY
						</h2>
						<div class="flex justify-center gap-8 mb-16 flex-wrap">
							<img src="/BanikLogo.png" alt="Baník" class="w-12 h-12 md:w-16 md:h-16 object-contain" />
							<img src="/SpartaLogo.png" alt="Sparta" class="w-12 h-12 md:w-16 md:h-16 object-contain" />
							<img src="/SlaviaLogo.png" alt="Slavia" class="w-12 h-12 md:w-16 md:h-16 object-contain" />
							<img src="/SlovanLogo.png" alt="Slovan" class="w-12 h-12 md:w-16 md:h-16 object-contain" />
						</div>

						<!-- New Stories -->
						<h2 class="text-2xl md:text-3xl font-bold text-gray-800 mb-8 tracking-wider">
							NOVÉ PŘÍBĚHY
						</h2>
						<div class="flex justify-center gap-8 mb-8 flex-wrap">
							<img src="/RaptorsLogo.png" alt="Raptors" class="w-12 h-12 md:w-16 md:h-16 object-contain" />
							<img src="/LokomotivaLogo.png" alt="Lokomotiva" class="w-12 h-12 md:w-16 md:h-16 object-contain" />
							<img src="/PrahaLogo.png" alt="Praha" class="w-12 h-12 md:w-16 md:h-16 object-contain" />
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
