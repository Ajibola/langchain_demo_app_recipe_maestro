<script lang="ts">
  import { store, updateStep, markStepComplete } from '$lib/stores/recipeStore';
  import { goto } from '$app/navigation';
  import StepProgress from '$lib/components/StepProgress.svelte';
  
  // Cuisine type options
  const cuisineTypes = [
    { id: 'italian', label: 'Italian', emoji: '🍝' },
    { id: 'mexican', label: 'Mexican', emoji: '🌮' },
    { id: 'indian', label: 'Indian', emoji: '🍛' },
    { id: 'chinese', label: 'Chinese', emoji: '🥡' },
    { id: 'japanese', label: 'Japanese', emoji: '🍣' },
    { id: 'thai', label: 'Thai', emoji: '🍜' },
    { id: 'mediterranean', label: 'Mediterranean', emoji: '🫒' },
    { id: 'american', label: 'American', emoji: '🍔' },
    { id: 'french', label: 'French', emoji: '🥐' }
  ];
  
  let selectedCuisine = '';
  
  // Initialize from store
  function loadFromStore() {
    const storedCuisine = store.getCell('recipePreferences', 'preferences', 'cuisineType');
    selectedCuisine = typeof storedCuisine === 'string' ? storedCuisine : '';
  }
  
  loadFromStore();
  
  function selectCuisine(cuisine: string) {
    selectedCuisine = cuisine;
    store.setCell('recipePreferences', 'preferences', 'cuisineType', cuisine);
  }
  
  function nextStep() {
    markStepComplete('cuisine');
    updateStep('dietary');
    goto('/dietary');
  }
  
  function previousStep() {
    updateStep('skill');
    goto('/skill');
  }
</script>

<div class="max-w-3xl mx-auto">
  <h1 class="text-3xl font-bold mb-6">Recipe Maestro</h1>
  
  <StepProgress />
  
  <div class="mb-8">
    <h2 class="text-2xl font-semibold mb-4">What cuisine are you in the mood for?</h2>
    <p class="text-muted-foreground mb-6">Select a cuisine type to find recipes you'll love.</p>
    
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {#each cuisineTypes as cuisine}
        <button 
          class="flex flex-col items-center justify-center p-4 border rounded-lg transition-colors
                {selectedCuisine === cuisine.id 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-primary/50'}"
          on:click={() => selectCuisine(cuisine.id)}
        >
          <span class="text-3xl mb-2">{cuisine.emoji}</span>
          <span class="font-medium">{cuisine.label}</span>
        </button>
      {/each}
    </div>
  </div>
  
  <div class="flex justify-between">
    <button 
      class="px-4 py-2 bg-muted text-muted-foreground rounded-md hover:bg-muted/90 transition-colors"
      on:click={previousStep}
    >
      Back
    </button>
    
    <button 
      class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors
             disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={!selectedCuisine}
      on:click={nextStep}
    >
      Next
    </button>
  </div>
</div>
