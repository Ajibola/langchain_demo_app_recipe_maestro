<script lang="ts">
  import { store, getCompletedSteps } from '$lib/stores/recipeStore';
  import { onMount, onDestroy } from 'svelte';
  
  let currentStep = '';
  let completedSteps: string[] = [];
  
  const steps = [
    { id: 'skill', label: 'Skill Level' },
    { id: 'cuisine', label: 'Cuisine' },
    { id: 'dietary', label: 'Dietary Preferences' }
  ];
  
  let currentIndex = 0;
  
  function updateState() {
    const stepValue = store.getCell('wizardState', 'currentStep', 'step');
    currentStep = typeof stepValue === 'string' ? stepValue : 'skill';
    completedSteps = getCompletedSteps();
    currentIndex = steps.findIndex(step => step.id === currentStep);
  }
  
  let listenerId: string | null = null;
  
  onMount(() => {
    updateState();
    listenerId = store.addCellListener('wizardState', 'currentStep', 'step', updateState);
  });
  
  onDestroy(() => {
    if (listenerId) {
      store.delListener(listenerId);
    }
  });
</script>

<div class="flex items-center justify-between mb-8">
  {#each steps as step, i}
    <div class="flex items-center">
      <div class="w-8 h-8 rounded-full flex items-center justify-center
                  {i < currentIndex || completedSteps.includes(step.id) 
                    ? 'bg-primary text-primary-foreground' 
                    : i === currentIndex 
                      ? 'bg-primary/20 text-primary'
                      : 'bg-muted text-muted-foreground'}">
        {i + 1}
      </div>
      <span class="ml-2 {i === currentIndex ? 'font-medium' : 'text-muted-foreground'}">
        {step.label}
      </span>
    </div>
    
    {#if i < steps.length - 1}
      <div class="flex-1 h-0.5 mx-4 
                  {i < currentIndex || (completedSteps.includes(step.id) && completedSteps.includes(steps[i+1].id))
                    ? 'bg-primary' 
                    : 'bg-muted'}">
      </div>
    {/if}
  {/each}
</div>
