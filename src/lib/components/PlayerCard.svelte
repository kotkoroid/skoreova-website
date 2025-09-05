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
	class="absolute w-52 h-72 transition-all duration-700 ease-in-out cursor-pointer bg-transparent border-none p-0"
	style="
		transform:
			translateX({position === 'far-left' ? '-200px' : position === 'left' ? '-100px' : position === 'center' ? '0px' : position === 'right' ? '100px' : '200px'})
			scale({position === 'center' ? '1' : position === 'left' || position === 'right' ? '0.9' : '0.8'})
			rotate({position === 'far-left' ? '-15deg' : position === 'left' ? '-8deg' : position === 'center' ? '0deg' : position === 'right' ? '8deg' : '15deg'});
		z-index: {position === 'center' ? '50' : position === 'left' || position === 'right' ? '30' : '10'};
		opacity: {position === 'center' ? '1' : position === 'left' || position === 'right' ? '0.8' : '0.5'};
	"
	class:animate-card-pulse={position === 'center'}
	onclick={onClick}
	aria-label="Vybrat hráčku {player.name}"
>
	<!-- Card Container -->
	<div class="relative w-full h-full bg-white/20 backdrop-blur-lg rounded-2xl border border-white/40 shadow-2xl overflow-hidden">

		<!-- Player Image -->
		<div class="relative h-40 overflow-hidden">
			<img
				src={player.image}
				alt="{player.name}"
				class="w-full h-full object-cover object-top"
			/>

			<!-- Top Badge/Position -->
			<div class="absolute top-4 left-4">
				<span class="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full">
					{player.position}
				</span>
			</div>

			<!-- Rating indicator (only for main card) -->
			{#if position === 'center'}
				<div class="absolute top-4 right-4">
					<div class="flex">
						<div class="w-3 h-3 bg-green-400 rounded-full mr-1"></div>
						<div class="text-xs text-white font-bold bg-black/30 px-2 py-1 rounded">
							{player.goals}G
						</div>
					</div>
				</div>
			{/if}
		</div>

		<!-- Player Info -->
		<div class="p-6 text-center">
			<!-- Player Name -->
			<h3 class="text-xl font-bold text-white mb-1">
				{player.name}
			</h3>

			<!-- Club -->
			<p class="text-white/80 font-semibold text-sm mb-3">
				{player.club}
			</p>

			<!-- Stats (only for main card) -->
			{#if position === 'center'}
				<div class="flex justify-center space-x-4 text-xs">
					<div class="text-center">
						<div class="flex items-center justify-center mb-1">
							<div class="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
							<span class="font-bold">{player.goals}</span>
						</div>
						<div class="text-white/60">{player.goals}G</div>
					</div>
					<div class="text-center">
						<div class="flex items-center justify-center mb-1">
							<div class="w-2 h-2 bg-blue-400 rounded-full mr-1"></div>
							<span class="font-bold">{player.assists}</span>
						</div>
						<div class="text-white/60">{player.assists}A</div>
					</div>
					<div class="text-center">
						<div class="text-white/60">{player.nationality}</div>
					</div>
				</div>

				<!-- Star Rating -->
				<div class="flex justify-center mt-3 space-x-1">
					{#each Array(5) as _, i}
						<svg class="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
							<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
						</svg>
					{/each}
				</div>
			{/if}
		</div>

		<!-- Card glow effect for main card -->
		{#if position === 'center'}
			<div class="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 opacity-50 pointer-events-none"></div>
		{/if}
	</div>
</button>

<style>
@keyframes cardPulse {
	0%, 100% { transform: scale(1); }
	50% { transform: scale(1.02); }
}

.animate-card-pulse {
	animation: cardPulse 3s ease-in-out infinite;
}
</style>
