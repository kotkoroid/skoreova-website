<script lang="ts">
const { text }: { text: string } = $props();
</script>

<span class="font-black -rotate-[4deg] z-[26] relative inline-block" style="font-size: clamp(3.4rem, 10.2vw, 5.1rem);">
  <span class="relative drop-shadow-sm mogra-font tracking-wider" style="color: #ff69b4; text-rendering: optimizeLegibility; -webkit-font-smoothing: antialiased; font-feature-settings: 'kern' 1, 'liga' 1; unicode-bidi: normal; font-variant: normal; text-shadow: 4px 4px 0px rgba(0, 0, 0, 1);">{text}</span>
</span>

<style>
  .mogra-font {
    font-family: 'Mogra', system-ui, -apple-system, sans-serif;
  }
</style>
