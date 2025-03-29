<script lang="ts">
  import { store, updateStep, markStepComplete } from '$lib/stores/recipeStore';
  import { goto } from '$app/navigation';
  import StepProgress from '$lib/components/StepProgress.svelte';
  
  // Skill level options
  const skillLevels = [
    { id: 'beginner', label: 'Beginner', description: 'Simple recipes with basic techniques' },
    { id: 'intermediate', label: 'Intermediate', description: 'More complex recipes with some advanced techniques' },
    { id: 'advanced', label: 'Advanced', description: 'Challenging recipes with advanced techniques' }
  ];
  
  let selectedSkill = '';
  
  // Initialize from store
  function loadFromStore() {
    const storedSkill = store.getCell('recipePreferences', 'preferences', 'skillLevel');
    selectedSkill = typeof storedSkill === 'string' ? storedSkill : '';
  }
  
  loadFromStore();
  
  function selectSkill(skill: string) {
    selectedSkill = skill;
    store.setCell('recipePreferences', 'preferences', 'skillLevel', skill);
  }
  
  function nextStep() {
    markStepComplete('skill');
    updateStep('cuisine');
    goto('/cuisine');
  }
</script>

<div class="max-w-3xl mx-auto">
  <h1 class="text-3xl font-bold mb-6">Recipe Maestro</h1>
  
  <StepProgress />
  
  <div class="mb-8">
    <h2 class="text-2xl font-semibold mb-4">What's your cooking skill level?</h2>
    <p class="text-muted-foreground mb-6">This helps us recommend recipes that match your experience.</p>
    
    <div class="grid gap-4">
      {#each skillLevels as level}
        <button 
          class="flex items-start p-4 border rounded-lg transition-colors
                {selectedSkill === level.id 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-primary/50'}"
          on:click={() => selectSkill(level.id)}
        >
          <div class="mr-3 mt-0.5">
            <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center
                      {selectedSkill === level.id 
                        ? 'border-primary' 
                        : 'border-muted-foreground'}">
              {#if selectedSkill === level.id}
                <div class="w-2.5 h-2.5 rounded-full bg-primary"></div>
              {/if}
            </div>
          </div>
          <div class="flex-1">
            <h3 class="font-medium">{level.label}</h3>
            <p class="text-sm text-muted-foreground">{level.description}</p>
          </div>
        </button>
      {/each}
    </div>
  </div>
  
  <div class="flex justify-end">
    <button 
      class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors
             disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={!selectedSkill}
      on:click={nextStep}
    >
      Next
    </button>
  </div>
</div>
