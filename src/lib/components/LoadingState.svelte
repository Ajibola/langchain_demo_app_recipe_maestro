<script lang="ts">
  export let message = 'Loading...';
</script>

<div class="flex flex-col items-center justify-center py-12">
  <div class="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
  <p class="text-muted-foreground">{message}</p>
</div>
