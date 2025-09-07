<script lang="ts">
import { onDestroy, onMount } from "svelte";
import { slide, fade } from "svelte/transition";
import { quintOut, cubicOut } from "svelte/easing";
import PlayerCard from "$lib/components/PlayerCard.svelte";
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

.animate-float {
	animation: float 6s ease-in-out infinite;
}

.fontik {
    font-family: 'SpaceMonoBold';
}

.fontik2 {
    font-family: 'Mogra';
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
		grid-template-rows:
			clamp(300px, 40vh, 500px)
			clamp(100px, 15vh, 150px)
			clamp(400px, 35vh, 600px)
			auto;
		grid-template-columns: 1fr;
		gap: 2rem;
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
		grid-template-rows:
			clamp(350px, 35vh, 500px)
			clamp(120px, 12vh, 150px)
			clamp(450px, 30vh, 600px)
			auto;
		grid-template-columns: 1fr minmax(400px, 700px) 1fr;
		gap: 2.5rem 1rem;
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
		grid-template-rows:
			clamp(400px, 30vh, 600px)
			clamp(120px, 10vh, 180px)
			clamp(500px, 25vh, 700px)
			auto;
		grid-template-columns: 1fr minmax(600px, 1000px) 1fr;
		gap: 3rem 2rem;
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

/* Grid Area Classes */
.hero-text-area {
	grid-area: hero-text;
}

.hero-text-container {
	height: 100%;
	min-height: 400px;
	display: grid;
	grid-template-rows: 1fr 0.8fr 1fr;
	place-items: center;
	position: relative;
	overflow: visible;
	padding-top: 0;
	margin-top: -3.5rem;
	justify-items: center;
}

/* Hero Title Styles */
.hero-title-1, .hero-title-2, .hero-title-3 {
	font-size: clamp(4.5rem, 8vw, 8rem);
	font-weight: 900;
	line-height: 1.1;
	letter-spacing: 0.08em;
	margin: 0;
	text-align: center;
}

/* Base mobile styles */
.hero-title-1 {
	color: white;
	text-shadow: 7px 7px 0 black;
	z-index: 25;
	align-self: end;
	transform: translateY(20px);
}

.hero-title-2 {
	background: linear-gradient(to right, #f9a8d4, #fb7185, #ec4899);
	background-clip: text;
	-webkit-background-clip: text;
	color: transparent;
	filter: drop-shadow(5px 5px 0 black);
	transform: rotate(-5deg) translateY(-8px);
	z-index: 26;
	align-self: center;
	padding: 1rem 2rem;
	overflow: visible;
	line-height: 1.2;
}

.hero-title-3 {
	color: white;
	text-shadow: 7px 7px 0 black;
	z-index: 25;
	align-self: start;
	transform: translateY(-35px);
}

/* Tablet styles */
@media (min-width: 768px) and (max-width: 1023px) {
	.hero-title-1 {
		transform: translateY(25px);
	}

	.hero-title-2 {
		transform: rotate(-5deg) translateY(-10px);
	}

	.hero-title-3 {
		transform: translateY(-50px);
	}
}

/* Desktop styles */
@media (min-width: 1024px) {
	.hero-title-1 {
		transform: translateY(30px);
	}

	.hero-title-2 {
		transform: rotate(-5deg) translateY(-15px);
	}

	.hero-title-3 {
		transform: translateY(-65px);
	}
}
.cta-button-area { grid-area: cta-button; }

.cta-button {
	display: inline-block;
	padding: 1.5rem 4rem;
	background: linear-gradient(to right, #f9a8d4, #fb7185, #ec4899);
	color: white;
	text-decoration: none;
	font-weight: 700;
	font-size: clamp(1.8rem, 2.5vw, 2rem);
	border-radius: 9999px;
	letter-spacing: 0.1em;
	text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
	box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
	transition: all 0.3s ease;
	transform: scale(1);
}

.cta-button:hover {
	transform: scale(1.05);
	box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.player-cards-area { grid-area: player-cards; }

.player-cards-container {
	width: 100%;
	height: 340px;
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
}
.logos-area {
	grid-area: logos;
	background: white;
	z-index: 30;
	margin: 0;
	padding: 0;
}

.logos-container {
	padding: 3rem 2rem;
}
</style>

<!-- OLD HERO SECTION - COMMENTED OUT FOR REFACTOR
<section
	class="min-h-screen flex flex-col justify-start items-center text-white relative overflow-hidden px-4 -mt-20 transition-all duration-1000 ease-out pb-20"
	onmousemove={handleMouseMove}
	role="application"
	style="background:
		radial-gradient(800px circle at {mouseX}px {mouseY}px, rgba(58, 9, 110, 0.4), transparent 70%),
		radial-gradient(600px circle at {mouseX + 200}px {mouseY + 100}px, rgba(58, 9, 110, 0.3), transparent 70%),
		radial-gradient(1000px circle at {mouseX - 150}px {mouseY - 100}px, rgba(58, 9, 110, 0.2), transparent 70%),
		linear-gradient(135deg, #3a096e 0%, #1e0b40 50%, #000000 100%)"
>

	Background images for all screen sizes
	<div class="absolute inset-0 z-0 pointer-events-none">
		RuzickovaBg - left side, fixed size
		<div class="absolute left-0 top-[250px] w-[600px] h-[600px] opacity-55 lg:opacity-100 -z-10 -translate-x-[40%] lg:-translate-x-[35%]">
			<img src="/RuzickovaBg.png" alt="Růžičková background" class="w-full h-full object-contain" />
		</div>

		KoptovaBg - right side, fixed size
		<div class="absolute right-0 top-[250px] w-[600px] h-[600px] opacity-55 lg:opacity-100 -z-10 translate-x-[40%] lg:translate-x-[25%]">
			<img src="/KoptovaBg.png" alt="Koptová background" class="w-full h-full object-contain" />
		</div>
	</div>

	<div class="relative z-10 text-center pt-30">
		<div class="relative h-48 flex items-center justify-center">
			<div class="absolute -top-4 left-1/2 transform -translate-x-1/2">
				<h1 class="fontik text-[4.5rem] sm:text-[5rem] md:text-[6rem] lg:text-[7rem] xl:text-[8rem] font-black text-white leading-none tracking-[0.08em]" style="text-shadow: 7px 7px 0 black;">
					OBJEVTE
				</h1>
			</div>

			<div class="absolute top-1 left-1/2 transform -translate-x-1/2 -rotate-5 z-25 pt-6">
				<h1 class="fontik2 text-[4.5rem] sm:text-[5rem] md:text-[6rem] lg:text-[7rem] xl:text-[8rem] font-black bg-gradient-to-r from-pink-300 via-pink-400 to-pink-500 bg-clip-text text-transparent leading-relaxed tracking-[0.08em] py-4" style="filter: drop-shadow(5px 5px 0 black);">
					ŽENSKÝ
				</h1>
			</div>

			<div class="absolute top-32 left-1/2 transform -translate-x-1/2 z-21">
				<h1 class="fontik text-[4.5rem] sm:text-[5rem] md:text-[6rem] lg:text-[7rem] xl:text-[8rem] font-black text-white leading-none tracking-[0.08em]" style="text-shadow: 7px 7px 0 black;">
					FOTBAL
				</h1>
			</div>
		</div>
	</div>

	CTA Button - positioned between hero text and cards
	<div class="absolute w-full flex justify-center z-10" style="top: 360px; left: 0;">
		<a
			href="/hub"
			class="tracking-wider inline-block font-bold rounded-full transition-all duration-300 transform hover:scale-105 shadow-2xl bg-gradient-to-r from-pink-300 via-pink-400 to-pink-500"
			style="padding: 24px 64px; font-size: 32px; line-height: 1; color: white; text-shadow: 1px 1px 2px rgba(0,0,0,0.3);"
		>
			SPUSTIT
		</a>
	</div>

	<div class="relative z-10 w-full max-w-5xl mx-auto" style="height: 750px;">
		<div class="absolute w-full flex justify-center items-center" style="top: 120px; height: 340px;">
			{#each visiblePlayers as { player, index, position } (position)}
				<PlayerCard
					{player}
					{position}
					onClick={() => goToPlayer(index)}
				/>
			{/each}
		</div>
	</div>

	Logos section - positioned below cards
	<div class="absolute w-full" style="top: 850px; left: 0;">
		<div class="bg-white px-4 py-12">
			<div class="text-center">
				Traditional Brands
				<h2 class="text-2xl md:text-3xl font-bold text-gray-800 mb-8 tracking-wider">
					TRADIČNÍ ZNAČKY
				</h2>
				<div class="flex justify-center gap-8 mb-16 flex-wrap">
					<img src="/BanikLogo.png" alt="Baník" class="w-12 h-12 md:w-16 md:h-16 object-contain" />
					<img src="/SpartaLogo.png" alt="Sparta" class="w-12 h-12 md:w-16 md:h-16 object-contain" />
					<img src="/SlaviaLogo.png" alt="Slavia" class="w-12 h-12 md:w-16 md:h-16 object-contain" />
					<img src="/SlovanLogo.png" alt="Slovan" class="w-12 h-12 md:w-16 md:h-16 object-contain" />
				</div>

				New Stories
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

	Side navigation arrows
	<button
		onclick={previousPlayerNav}
		class="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all duration-300 shadow-md hover:shadow-lg hover:scale-110 z-30"
		aria-label="Předchozí hráčka"
	>
		<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
		</svg>
	</button>

	<button
		onclick={nextPlayerNav}
		class="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all duration-300 shadow-md hover:shadow-lg hover:scale-110 z-30"
		aria-label="Následující hráčka"
	>
		<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
		</svg>
	</button>
</section>
-->

<!-- NEW GRID-BASED HERO SECTION -->
<section class="hero-wrapper">
	<!-- Background layer with mouse-following gradients -->
	<div
		class="hero-background"
		style="z-index: 0; background:
			radial-gradient(800px circle at {mouseX}px {mouseY}px, rgba(58, 9, 110, 0.4), transparent 70%),
			radial-gradient(600px circle at {mouseX + 200}px {mouseY + 100}px, rgba(58, 9, 110, 0.3), transparent 70%),
			radial-gradient(1000px circle at {mouseX - 150}px {mouseY - 100}px, rgba(58, 9, 110, 0.2), transparent 70%),
			linear-gradient(135deg, #3a096e 0%, #1e0b40 50%, #000000 100%)"
		onmousemove={handleMouseMove}
		role="application"
	></div>

	<!-- Grid container for content -->
	<div class="hero-grid-container relative text-white overflow-hidden">
		<!-- Temporary content to establish proper height -->
		<div class="hero-text-area">
			<div class="hero-text-container">
				<h1 class="hero-title-1 fontik">OBJEVTE</h1>
				<h1 class="hero-title-2 fontik2">ŽENSKÝ</h1>
				<h1 class="hero-title-3 fontik">FOTBAL</h1>
			</div>
		</div>
		<div class="cta-button-area">
			<div style="height: 120px; display: flex; align-items: center; justify-content: center; border: 2px dashed rgba(255,255,255,0.3); position: relative;">
				<div style="position: absolute; top: 10px; left: 10px; font-size: 0.8rem; opacity: 0.7; z-index: 30;">CTA BUTTON AREA</div>
				<a
					href="/hub"
					class="cta-button"
				>
					SPUSTIT
				</a>
			</div>
		</div>
		<div class="player-cards-area">
			<div style="height: 500px; display: flex; align-items: center; justify-content: center; border: 2px dashed rgba(255,255,255,0.3); position: relative;">
				<div style="position: absolute; top: 10px; left: 10px; font-size: 0.8rem; opacity: 0.7; z-index: 30;">PLAYER CARDS AREA</div>
				<div class="player-cards-container">
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
		<div class="logos-area">
			<div style="position: relative;">
				<div style="position: absolute; top: 10px; left: 10px; font-size: 0.8rem; opacity: 0.7; z-index: 30; color: #666; border: 2px dashed rgba(0,0,0,0.3); padding: 4px 8px; background: rgba(255,255,255,0.8);">LOGOS AREA</div>
				<div class="logos-container">
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
