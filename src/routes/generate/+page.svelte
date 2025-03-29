<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { goto } from '$app/navigation';
  import { 
    store, 
    getCompletedSteps, 
    getCurrentStep,
    getRecipeData,
    setRecipeData,
    setRecipeLoading,
    getRecipeLoading,
    setRecipeError,
    getRecipeError,
    getMaxTime
  } from '$lib/stores/recipeStore';
  import { recipeService, type Recipe } from '$lib/services/langGraphService';
  import LoadingState from '$lib/components/LoadingState.svelte';
  import RecipeCard from '$lib/components/RecipeCard.svelte';
  import StepProgress from '$lib/components/StepProgress.svelte';
  
  // Reactive state with Svelte 5 runes
  let recipe = $state<Recipe | null>(null);
  let isLoading = $state(false);
  let error = $state('');
  let generationProgress = $state('');
  
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
      } catch (_) {
        return [];
      }
    }
    return [];
  }
  
  // Check if all required steps are completed
  const completedSteps = getCompletedSteps();
  const allStepsCompleted = completedSteps.includes('skill') && 
                           completedSteps.includes('cuisine') && 
                           completedSteps.includes('dietary');
  
  // Redirect if steps are not completed
  onMount(() => {
    if (!allStepsCompleted) {
      const currentStep = getCurrentStep();
      goto(`/${currentStep || 'skill'}`);
      return;
    }
    
    // Check if we already have a recipe
    const existingRecipe = getRecipeData();
    if (existingRecipe) {
      recipe = existingRecipe as Recipe;
      return;
    }
    
    // Generate recipe
    generateRecipe();
  });
  
  // Generate recipe based on user preferences
  async function generateRecipe() {
    try {
      isLoading = true;
      setRecipeLoading(true);
      error = '';
      setRecipeError('');
      generationProgress = 'Preparing your personalized recipe...';
      
      const skillLevel = getSkillLevel();
      const cuisineType = getCuisineType();
      const dietaryPreferences = getDietaryPreferences();
      const maxTime = getMaxTime();
      
      const result = await recipeService.generateRecipe(
        {
          cuisine_type: cuisineType,
          skill_level: skillLevel,
          max_time: maxTime,
          dietary_preferences: dietaryPreferences
        },
        (node, data) => {
          // Update progress based on node updates
          if (node === 'generate_recipe') {
            generationProgress = 'Creating your perfect recipe...';
          } else if (node === 'format_recipe') {
            generationProgress = 'Formatting your recipe...';
          } else if (node === 'calculate_nutrition') {
            generationProgress = 'Calculating nutritional information...';
          }
        }
      );
      
      if (result) {
        recipe = result;
        setRecipeData(result as Record<string, unknown>);
      } else {
        throw new Error('Failed to generate recipe');
      }
    } catch (err) {
      console.error('Error generating recipe:', err);
      error = err instanceof Error ? err.message : 'An unknown error occurred';
      setRecipeError(error);
    } finally {
      isLoading = false;
      setRecipeLoading(false);
    }
  }
  
  function startOver() {
    // Clear the store and redirect to the first step
    store.setCell('wizardState', 'currentStep', 'step', 'skill');
    store.setCell('wizardState', 'currentStep', 'completed', JSON.stringify([]));
    store.setCell('recipePreferences', 'preferences', 'skillLevel', '');
    store.setCell('recipePreferences', 'preferences', 'cuisineType', '');
    store.setCell('recipePreferences', 'preferences', 'dietaryPreferences', JSON.stringify([]));
    store.setCell('recipeData', 'recipe', 'data', JSON.stringify(null));
    
    goto('/skill');
  }
</script>

<div class="max-w-4xl mx-auto">
  <h1 class="text-3xl font-bold mb-6">Recipe Maestro</h1>
  
  <StepProgress />
  
  <div class="mb-8">
    <h2 class="text-2xl font-semibold mb-4">Your Personalized Recipe</h2>
    
    {#if isLoading}
      <div class="bg-card rounded-lg p-8 shadow-sm">
        <LoadingState message={generationProgress} />
      </div>
    {:else if error}
      <div class="bg-destructive/10 text-destructive rounded-lg p-6 mb-6">
        <h3 class="font-semibold mb-2">Error</h3>
        <p>{error}</p>
        <button 
          class="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          on:click={generateRecipe}
        >
          Try Again
        </button>
      </div>
    {:else if recipe}
      <RecipeCard {recipe} />
    {:else}
      <div class="bg-card rounded-lg p-8 shadow-sm">
        <p class="text-center text-muted-foreground">No recipe generated yet.</p>
      </div>
    {/if}
  </div>
  
  <div class="flex justify-between">
    <button 
      class="px-4 py-2 bg-muted text-muted-foreground rounded-md hover:bg-muted/80 transition-colors"
      on:click={startOver}
    >
      Start Over
    </button>
    
    {#if recipe && !isLoading}
      <button 
        class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        on:click={generateRecipe}
      >
        Generate Another Recipe
      </button>
    {/if}
  </div>
</div>
