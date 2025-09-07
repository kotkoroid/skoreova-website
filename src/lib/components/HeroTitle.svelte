<script lang="ts">
  let { text }: { text: string } = $props();
</script>

<span class="font-bold relative z-25 drop-shadow-lg spacemono-bold" style="font-size: clamp(3rem, 8vw, 6rem); text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);">{text}</span>

<style>
  .spacemono-bold {
    font-family: 'SpaceMonoBold';
  }
</style>
