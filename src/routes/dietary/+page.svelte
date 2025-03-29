<script lang="ts">
  import { store, updateStep, markStepComplete } from '$lib/stores/recipeStore';
  import { goto } from '$app/navigation';
  import StepProgress from '$lib/components/StepProgress.svelte';
  
  // Dietary preference options
  const dietaryOptions = [
    { id: 'vegetarian', label: 'Vegetarian', description: 'No meat, poultry, or seafood' },
    { id: 'vegan', label: 'Vegan', description: 'No animal products' },
    { id: 'gluten-free', label: 'Gluten-Free', description: 'No wheat, barley, or rye' },
    { id: 'dairy-free', label: 'Dairy-Free', description: 'No milk, cheese, or other dairy' },
    { id: 'keto', label: 'Keto', description: 'Low carb, high fat' },
    { id: 'paleo', label: 'Paleo', description: 'Whole foods, no grains or processed foods' },
    { id: 'low-carb', label: 'Low-Carb', description: 'Reduced carbohydrate intake' },
    { id: 'nut-free', label: 'Nut-Free', description: 'No nuts or nut products' }
  ];
  
  let selectedDietary: string[] = [];
  
  // Initialize from store
  function loadFromStore() {
    const storedPreferences = store.getCell('recipePreferences', 'preferences', 'dietaryPreferences');
    if (typeof storedPreferences === 'string') {
      try {
        selectedDietary = JSON.parse(storedPreferences);
      } catch (e) {
        selectedDietary = [];
      }
    } else {
      selectedDietary = [];
    }
  }
  
  loadFromStore();
  
  function toggleDietary(option: string) {
    if (selectedDietary.includes(option)) {
      selectedDietary = selectedDietary.filter(item => item !== option);
    } else {
      selectedDietary = [...selectedDietary, option];
    }
    
    store.setCell(
      'recipePreferences', 
      'preferences', 
      'dietaryPreferences', 
      JSON.stringify(selectedDietary)
    );
  }
  
  function finishWizard() {
    markStepComplete('dietary');
    // In a real app, we would navigate to a results page
    // For now, we'll just go back to the home page
    goto('/');
  }
  
  function previousStep() {
    updateStep('cuisine');
    goto('/cuisine');
  }
</script>

<div class="max-w-3xl mx-auto">
  <h1 class="text-3xl font-bold mb-6">Recipe Maestro</h1>
  
  <StepProgress />
  
  <div class="mb-8">
    <h2 class="text-2xl font-semibold mb-4">Any dietary preferences?</h2>
    <p class="text-muted-foreground mb-6">Select any dietary restrictions or preferences (optional).</p>
    
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {#each dietaryOptions as option}
        <button 
          class="flex items-start p-4 border rounded-lg transition-colors
                {selectedDietary.includes(option.id) 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-primary/50'}"
          on:click={() => toggleDietary(option.id)}
        >
          <div class="mr-3 mt-0.5">
            <div class="w-5 h-5 rounded border-2 flex items-center justify-center
                      {selectedDietary.includes(option.id) 
                        ? 'border-primary' 
                        : 'border-muted-foreground'}">
              {#if selectedDietary.includes(option.id)}
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="text-primary">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              {/if}
            </div>
          </div>
          <div class="flex-1 text-left">
            <h3 class="font-medium">{option.label}</h3>
            <p class="text-sm text-muted-foreground">{option.description}</p>
          </div>
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
      class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
      on:click={finishWizard}
    >
      Finish
    </button>
  </div>
</div>
