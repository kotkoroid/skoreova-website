<script lang="ts">
  let { text }: { text: string } = $props();
</script>

<span class="font-black -rotate-[5deg] z-[26] relative inline-block" style="font-size: clamp(4rem, 12vw, 8rem);">
  <span class="relative drop-shadow-sm mogra-font tracking-wider" style="color: #ff69b4; text-rendering: optimizeLegibility; -webkit-font-smoothing: antialiased; font-feature-settings: 'kern' 1, 'liga' 1; unicode-bidi: normal; font-variant: normal; text-shadow: 5px 5px 0px rgba(0, 0, 0, 1);">{text}</span>
</span>

<style>
  .mogra-font {
    font-family: 'Mogra', system-ui, -apple-system, sans-serif;
  }
</style>
