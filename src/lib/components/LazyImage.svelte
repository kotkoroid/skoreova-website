<script lang="ts">
import { onMount } from "svelte";
import { browser } from "$app/environment";

interface Props {
	src: string;
	alt: string;
	class?: string;
	threshold?: number;
	placeholder?: string;
}

const { src, alt, class: className = "", threshold = 0.1, placeholder = "" }: Props = $props();

let img: HTMLImageElement;
let loaded = $state(false);
let error = $state(false);
let observer: IntersectionObserver;

function loadImage() {
	if (!browser || loaded || error) return;

	const image = new Image();
	image.onload = () => {
		loaded = true;
	};
	image.onerror = () => {
		error = true;
	};
	image.src = src;
}

onMount(() => {
	if (!browser || !img) return;

	if ('IntersectionObserver' in window) {
		observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						loadImage();
						observer.unobserve(entry.target);
					}
				});
			},
			{
				threshold,
			}
		);

		observer.observe(img);
	} else {
		// Fallback for older browsers
		loadImage();
	}

	return () => {
		if (observer && img) {
			observer.unobserve(img);
		}
	};
});
</script>

<img
	bind:this={img}
	src={loaded ? src : placeholder || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PC9zdmc+'}
	{alt}
	class={`transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'} ${className}`}
	style={loaded ? '' : 'background-color: #f3f4f6;'}
/>
