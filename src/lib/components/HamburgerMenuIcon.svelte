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
	<path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/>
</svg>
