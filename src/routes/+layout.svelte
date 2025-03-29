<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { store } from '$lib/stores/recipeStore';
	import { createIndexedDbPersister } from 'tinybase/persisters/persister-indexed-db';
	
	let { children } = $props();
	
	// Initialize store persistence in the layout
	onMount(() => {
		if (typeof window !== 'undefined') {
			const persister = createIndexedDbPersister(store, 'recipe-maestro-state');
			
			// Load existing data if available
			persister.load()
				.catch(error => {
					console.error('Failed to load from IndexedDB:', error);
				});
			
			// Start auto-saving
			persister.startAutoSave();
			
			return () => {
				// Clean up on unmount
				persister.stopAutoSave();
			};
		}
	});
</script>

<div class="min-h-screen bg-background text-foreground">
  <main class="container mx-auto px-4 py-8">
    {@render children()}
  </main>
</div>
