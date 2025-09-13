<script lang="ts">
const { text }: { text: string } = $props();
</script>

<span class="font-bold relative z-25 drop-shadow-lg spacemono-bold tracking-wider" style="font-size: clamp(3rem, 9vw, 4.5rem); text-shadow: 5px 5px 0px rgba(0, 0, 0, 1);">{text}</span>

<style>
  .spacemono-bold {
    font-family: 'SpaceMonoBold';
  }
</style>
