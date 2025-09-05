<script lang="ts">
import { onDestroy, onMount } from "svelte";
import PlayerCard from "$lib/components/PlayerCard.svelte";
import type { Player, CardPosition } from "$lib/types.js";

let currentPlayer = $state(0);
let carouselInterval: ReturnType<typeof setInterval> | undefined;

const players: Player[] = [
	{
		image: "/Barbora-Votikova.png",
		name: "Barbora Votíková",
		club: "SK Slavia Praha",
		position: "Útočník",
		nationality: "Německo",
		goals: 24,
		assists: 8,
	},
	{
		image: "/Jana-Zufankova.png",
		name: "Jana Žufánková",
		club: "SK Slavia Praha",
		position: "Záložník",
		nationality: "Španělsko",
		goals: 18,
		assists: 15,
	},
	{
		image: "/Kamila-Dubcova.png",
		name: "Kamila Dubcová",
		club: "SK Slavia Praha",
		position: "Křídlo",
		nationality: "Švédsko",
		goals: 12,
		assists: 11,
	},
	{
		image: "/Kristyna-Ruzickova.png",
		name: "Kristýna Růžičková",
		club: "SK Slavia Praha",
		position: "Obránkyně",
		nationality: "Nizozemsko",
		goals: 3,
		assists: 7,
	},
	{
		image: "/Tamara-Moravkova.png",
		name: "Tamara Morávková",
		club: "SK Slavia Praha",
		position: "Brankářka",
		nationality: "Česká republika",
		goals: 0,
		assists: 0,
	},
	{
		image: "/Vanesa-Jilkova.png",
		name: "Vanesa Jílková",
		club: "SK Slavia Praha",
		position: "Záložník",
		nationality: "Německo",
		goals: 14,
		assists: 9,
	},
];

function nextPlayer() {
	currentPlayer = (currentPlayer + 1) % players.length;
}

function goToPlayer(index: number) {
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

function previousPlayer() {
	goToPlayer((currentPlayer - 1 + players.length) % players.length);
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
			previousPlayer();
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

// Get visible players for the 5-card layout (far-left, left, center, right, far-right)
const visiblePlayers = $derived.by(() => {
	const visible: Array<{player: Player, index: number, position: CardPosition}> = [];
	const totalPlayers = players.length;

	// Far left card (behind left)
	const farLeftIndex = (currentPlayer - 2 + totalPlayers) % totalPlayers;
	visible.push({
		player: players[farLeftIndex],
		index: farLeftIndex,
		position: "far-left",
	});

	// Left card
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

	// Right card
	const rightIndex = (currentPlayer + 1) % totalPlayers;
	visible.push({
		player: players[rightIndex],
		index: rightIndex,
		position: "right",
	});

	// Far right card (behind right)
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
	if (typeof window !== "undefined") {
		window.addEventListener("keydown", handleKeydown);
	}
});

onDestroy(() => {
	if (carouselInterval) {
		clearInterval(carouselInterval);
	}
	if (typeof window !== "undefined") {
		window.removeEventListener("keydown", handleKeydown);
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
    font-family: 'Audiowide';
}
</style>

<!-- Hero Section -->
<section class="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-600 flex flex-col justify-start items-center text-white relative overflow-hidden px-4 pt-6">

	<!-- Background decorative elements -->
	<div class="absolute inset-0 overflow-hidden">
		<div class="absolute top-20 left-10 w-32 h-32 bg-white/5 rounded-full blur-xl animate-float"></div>
		<div class="absolute top-1/3 right-16 w-24 h-24 bg-pink-300/10 rounded-full blur-lg animate-float" style="animation-delay: 2s;"></div>
		<div class="absolute bottom-1/4 left-1/4 w-40 h-40 bg-white/5 rounded-full blur-2xl animate-float" style="animation-delay: 4s;"></div>
		<div class="absolute top-1/2 right-8 w-16 h-16 bg-blue-300/10 rounded-full blur-md animate-float" style="animation-delay: 1s;"></div>
	</div>

	<!-- Main Content -->
	<div class="relative z-10 text-center mb-2">
		<!-- Main Headline -->
		<h1 class="fontik text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10rem] font-black mb-6 leading-tight tracking-wider">
			<div class="text-white mb-2">OBJEVTE</div>
			<div class="text-pink-200 mb-2">ŽENSKÝ</div>
			<div class="text-white">FOTBAL</div>
		</h1>
	</div>

	<!-- Player Cards Section -->
	<div class="relative z-10 w-full max-w-4xl mx-auto mb-8 h-80">
		<div class="relative w-full h-full flex justify-center items-center">
			{#each visiblePlayers as { player, index, position } (index)}
				<PlayerCard
					{player}
					{position}
					onClick={() => goToPlayer(index)}
				/>
			{/each}
	</div>

	<div>
	100+ hráček
	20+ týmů
	&infin; statistik
	</div>

	<!-- CTA Button -->
	<div class="absolute -bottom-25 left-1/2 transform -translate-x-1/2 z-10">
		<a
			href="/players"
			class="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 px-16 rounded-full text-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-blue-500/25"
		>
			VSTOUPIT
		</a>
	</div>

	<!-- Side navigation arrows -->
	<button
		onclick={previousPlayer}
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
