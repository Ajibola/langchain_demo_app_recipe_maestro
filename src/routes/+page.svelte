<script lang="ts">
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { store, getCurrentStep, getCompletedSteps } from '$lib/stores/recipeStore';
  
  onMount(() => {
    const currentStep = getCurrentStep();
    const completedSteps = getCompletedSteps();
    
    // If all steps are completed, go to recipe generation
    if (completedSteps.includes('skill') && completedSteps.includes('cuisine') && completedSteps.includes('dietary')) {
      goto('/generate');
    } else if (currentStep) {
      // Redirect to the current step
      goto(`/${currentStep}`);
    } else {
      // Default to the first step
      goto('/skill');
    }
  });
  
  // Get user preferences from store
  function getSkillLevel() {
    const skill = store.getCell('recipePreferences', 'preferences', 'skillLevel');
    return typeof skill === 'string' ? skill : '';
  }
  
  function getCuisineType() {
    const cuisine = store.getCell('recipePreferences', 'preferences', 'cuisineType');
    return typeof cuisine === 'string' ? cuisine : '';
  }
  
  function getDietaryPreferences() {
    const preferences = store.getCell('recipePreferences', 'preferences', 'dietaryPreferences');
    if (typeof preferences === 'string') {
      try {
        return JSON.parse(preferences);
      } catch (e) {
        return [];
      }
    }
    return [];
  }
  
  const completedSteps = getCompletedSteps();
  const showSummary = completedSteps.includes('skill') && completedSteps.includes('cuisine') && completedSteps.includes('dietary');
  
  const skillLevel = getSkillLevel();
  const cuisineType = getCuisineType();
  const dietaryPreferences = getDietaryPreferences();
  
  function startOver() {
    // Clear the store and redirect to the first step
    store.setCell('wizardState', 'currentStep', 'step', 'skill');
    store.setCell('wizardState', 'currentStep', 'completed', JSON.stringify([]));
    store.setCell('recipePreferences', 'preferences', 'skillLevel', '');
    store.setCell('recipePreferences', 'preferences', 'cuisineType', '');
    store.setCell('recipePreferences', 'preferences', 'dietaryPreferences', JSON.stringify([]));
    
    goto('/skill');
  }
</script>

<div class="max-w-3xl mx-auto">
  <h1 class="text-3xl font-bold mb-6">Recipe Maestro</h1>
  
  {#if showSummary}
    <div class="bg-card rounded-lg p-6 shadow-sm mb-8">
      <h2 class="text-2xl font-semibold mb-4">Your Recipe Preferences</h2>
      
      <div class="space-y-4">
        <div>
          <h3 class="font-medium text-lg">Skill Level</h3>
          <p class="text-muted-foreground capitalize">{skillLevel || 'Not specified'}</p>
        </div>
        
        <div>
          <h3 class="font-medium text-lg">Cuisine Type</h3>
          <p class="text-muted-foreground capitalize">{cuisineType || 'Not specified'}</p>
        </div>
        
        <div>
          <h3 class="font-medium text-lg">Dietary Preferences</h3>
          {#if dietaryPreferences.length > 0}
            <ul class="list-disc list-inside text-muted-foreground">
              {#each dietaryPreferences as preference}
                <li class="capitalize">{preference.replace('-', ' ')}</li>
              {/each}
            </ul>
          {:else}
            <p class="text-muted-foreground">No dietary preferences specified</p>
          {/if}
        </div>
      </div>
      
      <div class="mt-6">
        <p class="text-muted-foreground mb-4">
          In a complete application, we would use these preferences to generate personalized recipes.
        </p>
        
        <button 
          class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          on:click={startOver}
        >
          Start Over
        </button>
      </div>
    </div>
  {:else}
    <div class="flex items-center justify-center h-64">
      <p>Redirecting to the wizard...</p>
    </div>
  {/if}
</div>
