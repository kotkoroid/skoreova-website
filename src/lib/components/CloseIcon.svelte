<script lang="ts">
interface Props {
	size?: number;
	color?: string;
	class?: string;
}

const { size = 24, color = "currentColor", class: className = "" }: Props = $props();
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	height="{size}px"
	viewBox="0 -960 960 960"
	width="{size}px"
	fill="{color}"
	class="{className}"
>
	<path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
</svg>
