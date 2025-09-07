<script lang="ts">
import type { Player } from '$lib/types.js';

interface Props {
	player: Player;
	position: 'far-left' | 'left' | 'center' | 'right' | 'far-right';
	onClick: () => void;
}

const { player, position, onClick }: Props = $props();
</script>

<button
	class="absolute w-48 h-64 cursor-pointer bg-transparent border-none p-0"
	style="
		transform:
			translate3d({position === 'far-left' ? '-220px' : position === 'left' ? '-110px' : position === 'center' ? '0px' : position === 'right' ? '110px' : '220px'}, 0, 0)
			scale({position === 'center' ? '1' : position === 'left' || position === 'right' ? '0.9' : '0.8'})
			rotateZ({position === 'far-left' ? '-15deg' : position === 'left' ? '-8deg' : position === 'center' ? '0deg' : position === 'right' ? '8deg' : '15deg'});
		z-index: {position === 'center' ? '50' : position === 'left' ? '45' : position === 'right' ? '35' : '20'};
		will-change: transform;
		transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94), z-index 0s linear 0.1s;
	"
	class:animate-card-pulse={position === 'center'}
	onclick={onClick}
	aria-label="Vybrat hráčku {player.name}"
>
	<!-- Card Container -->
	<div class="relative w-full h-full {position === 'center' ? 'bg-white/35' : 'bg-white/80 backdrop-blur-xl'} rounded-2xl border border-white/50 shadow-2xl overflow-hidden transition-[transform,box-shadow] duration-500 ease-in-out carousel-slide-in flex flex-col">

		<!-- Player Image with gradient overlay -->
		<div class="relative h-40 overflow-hidden {position === 'center' ? 'backdrop-blur-xl' : ''} flex-shrink-0">
			<div class="relative w-full h-full">
				<img
					src={player.image}
					alt="{player.name}"
					class="w-full h-full object-cover object-top transition-all duration-700 ease-in-out"
					loading="lazy"
				/>
			</div>
			<!-- Gradient overlay to blend image with content -->
			<div class="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30"></div>

			<!-- Top Badge/Position -->
			<div class="absolute top-3 right-3">
				<span class="px-3 py-1 bg-gradient-to-r from-pink-300 via-pink-400 to-pink-500 text-white text-xs font-bold rounded-full" style="text-shadow: 1px 1px 2px rgba(0,0,0,0.3);">
					{player.position}
				</span>
			</div>
		</div>

		<!-- Player Info -->
		<div class="px-3 py-2 text-center relative z-10 transition-all duration-700 ease-in-out bg-gradient-to-r from-pink-300/80 via-pink-400/80 to-pink-500/80 backdrop-blur-md flex-1 flex flex-col justify-center -mt-px">
			<!-- Player Name -->
			<h3 class="uppercase text-base font-bold text-white mb-1 transition-all duration-500 ease-in-out transform" style="text-shadow: 1px 1px 2px rgba(0,0,0,0.3);">
				{player.name}
			</h3>

			<!-- Club -->
			<p class="text-white font-medium text-xs mb-2 transition-all duration-500 ease-in-out transform" style="text-shadow: 1px 1px 2px rgba(0,0,0,0.3);">
				{player.club}
			</p>


		</div>

		<!-- Card glow effect for main card -->
		{#if position === 'center'}
			<div class="absolute top-52 left-0 right-0 bottom-0 rounded-b-2xl bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 pointer-events-none"></div>
		{/if}
	</div>
</button>

<style>
@keyframes cardPulse {
	0%, 100% { transform: scale(1); }
	50% { transform: scale(1.02); }
}

@keyframes slideInFromRight {
	0% {
		transform: translateX(30px) scale(0.8);
	}
	100% {
		transform: translateX(0px) scale(1);
	}
}

@keyframes slideInFromLeft {
	0% {
		transform: translateX(-30px) scale(0.8);
	}
	100% {
		transform: translateX(0px) scale(1);
	}
}

@keyframes fadeInScale {
	0% {
		transform: scale(0.9);
	}
	100% {
		transform: scale(1);
	}
}

.animate-card-pulse {
	animation: cardPulse 3s ease-in-out infinite;
}

.carousel-slide-in {
	animation: fadeInScale 0.6s ease-out;
}

@keyframes carouselRotate {
	0% {
		transform: scale(0.95) rotateZ(10deg);
	}
	100% {
		transform: scale(1) rotateZ(0deg);
	}
}

.carousel-rotate {
	animation: carouselRotate 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
