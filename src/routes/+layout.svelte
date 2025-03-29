<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { store } from '$lib/stores/recipeStore';
	import { createIndexedDbPersister } from 'tinybase/persisters/persister-indexed-db';
	
	let { children } = $props();
	
	// Initialize store persistence in the layout
	onMount(() => {
	});
</script>
<svelte:head>
  <title>Recipe Maestro</title>
</svelte:head>
<div class="min-h-screen bg-background text-foreground">
  <main class="container mx-auto px-4 py-8">
    {@render children()}
  </main>
</div>
