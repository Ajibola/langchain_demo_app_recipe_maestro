<script lang="ts">
  import type { Recipe } from '$lib/services/langGraphService';
  
  export let recipe: Recipe;
</script>

<div class="bg-card rounded-lg shadow-sm overflow-hidden">
  <!-- Recipe Header -->
  <div class="p-6 border-b">
    <h2 class="text-2xl font-bold mb-2">{recipe.title}</h2>
    <p class="text-muted-foreground">{recipe.description}</p>
    
    <div class="flex flex-wrap gap-2 mt-4">
      <span class="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
        {recipe.metadata.difficulty}
      </span>
      <span class="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
        {recipe.metadata.cuisineType}
      </span>
      <span class="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
        {recipe.prepTime} min prep
      </span>
      <span class="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
        {recipe.metadata.totalTime} min total
      </span>
      <span class="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
        {recipe.metadata.servings} servings
      </span>
    </div>
  </div>
  
  <!-- Recipe Content -->
  <div class="grid md:grid-cols-2 gap-6 p-6">
    <!-- Ingredients -->
    <div>
      <h3 class="text-lg font-semibold mb-4">Ingredients</h3>
      <ul class="space-y-2">
        {#each recipe.ingredients as ingredient}
          <li class="flex items-start">
            <span class="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs mr-2 mt-0.5">•</span>
            <span>
              <span class="font-medium">{ingredient.quantity} {ingredient.unit || ''}</span> {ingredient.name}
            </span>
          </li>
        {/each}
      </ul>
    </div>
    
    <!-- Instructions -->
    <div>
      <h3 class="text-lg font-semibold mb-4">Instructions</h3>
      <ol class="space-y-4">
        {#each recipe.steps as step}
          <li class="flex items-start">
            <span class="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm mr-3 shrink-0">{step.number}</span>
            <p class="text-muted-foreground">{step.instruction}</p>
          </li>
        {/each}
      </ol>
    </div>
  </div>
  
  <!-- Nutrition Information -->
  <div class="bg-muted/50 p-6 border-t">
    <h3 class="text-lg font-semibold mb-4">Nutrition (per serving)</h3>
    <div class="grid grid-cols-4 gap-4">
      <div class="text-center">
        <div class="text-xl font-bold text-primary">{recipe.macros.calories}</div>
        <div class="text-xs text-muted-foreground">calories</div>
      </div>
      <div class="text-center">
        <div class="text-xl font-bold text-primary">{recipe.macros.protein}g</div>
        <div class="text-xs text-muted-foreground">protein</div>
      </div>
      <div class="text-center">
        <div class="text-xl font-bold text-primary">{recipe.macros.carbs}g</div>
        <div class="text-xs text-muted-foreground">carbs</div>
      </div>
      <div class="text-center">
        <div class="text-xl font-bold text-primary">{recipe.macros.fat}g</div>
        <div class="text-xs text-muted-foreground">fat</div>
      </div>
    </div>
  </div>
</div>
