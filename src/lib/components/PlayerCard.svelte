<script lang="ts">
import LazyImage from "./LazyImage.svelte";

interface Player {
	name: string;
	surname: string;
	image: string;
	position?: string;
	team?: string;
}

const { player } = $props<{ player: Player }>();
</script>

<div class="player-card rounded-xl min-w-48 max-w-56 hover:scale-105 transition-all duration-300 transform overflow-hidden relative">
	<div class="bg-white/20 backdrop-blur-xl p-2 h-56 flex items-end justify-center relative">
		<LazyImage
			src={player.image}
			alt={`${player.name} ${player.surname}`}
			class="max-w-full max-h-full object-contain"
			threshold={0.2}
		/>

		{#if player.position}
			<div class="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded">
				{player.position}
			</div>
		{/if}
	</div>

	<div class="bg-gradient-to-r from-pink-500 to-purple-500 text-white text-center p-4 relative -mt-4">
		<h3 class="text-lg font-bold">{player.name}</h3>
		<h4 class="text-base font-semibold">{player.surname}</h4>
	</div>
</div>
