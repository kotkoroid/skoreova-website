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
</style>

<!-- Hero Section -->
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

	<!-- Background images for all screen sizes -->
	<div class="absolute inset-0 z-0 pointer-events-none">
		<!-- RuzickovaBg - left side, fixed size -->
		<div class="absolute left-0 top-[250px] w-[600px] h-[600px] opacity-55 lg:opacity-100 -z-10 -translate-x-[40%] lg:-translate-x-[35%]">
			<img src="/RuzickovaBg.png" alt="Růžičková background" class="w-full h-full object-contain" />
		</div>

		<!-- KoptovaBg - right side, fixed size -->
		<div class="absolute right-0 top-[250px] w-[600px] h-[600px] opacity-55 lg:opacity-100 -z-10 translate-x-[40%] lg:translate-x-[25%]">
			<img src="/KoptovaBg.png" alt="Koptová background" class="w-full h-full object-contain" />
		</div>
	</div>



	<div class="relative z-10 text-center mb-12 pt-30">
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

	<!-- CTA Button - positioned between hero text and cards -->
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

	<!-- Logos section - positioned below cards -->
	<div class="absolute w-full" style="top: 850px; left: 0;">
		<div class="bg-white px-4 py-12">
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

	<!-- Side navigation arrows -->
	<!-- <button
		onclick={previousPlayerNav}
		class="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all duration-300 shadow-md hover:shadow-lg hover:scale-110 z-30"
		aria-label="Předchozí hráčka"
	>
		<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
		</svg>
	</button> -->

	<!-- <button
		onclick={nextPlayerNav}
		class="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all duration-300 shadow-md hover:shadow-lg hover:scale-110 z-30"
		aria-label="Následující hráčka"
	>
		<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
		</svg>
	</button> -->
</section>
