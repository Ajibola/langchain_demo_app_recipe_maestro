# Core UI Framework Implementation Plan

This plan outlines the implementation of the first step in the Recipe Maestro setup progress: building the core UI framework with TinyBase state management and SvelteKit routing.

## 1. TinyBase State Management Setup

### 1.1 Install Dependencies
```bash
npm install tinybase @tinybase/svelte
```

### 1.2 Create Basic Store (src/lib/stores/recipeStore.ts)
```typescript
import { createStore } from 'tinybase';
import { createLocalPersister } from 'tinybase/persisters';

// Create the core store structure
export const store = createStore()
  // Wizard state for step tracking
  .setTable('wizardState', {
    currentStep: { 
      id: 'currentStep',
      step: 'skill',
      completed: JSON.stringify([])
    }
  })
  // User preferences
  .setTable('recipePreferences', {
    preferences: {
      id: 'preferences',
      skillLevel: '',
      cuisineType: '',
      dietaryPreferences: JSON.stringify([])
    }
  });

// Setup local persistence
if (typeof window !== 'undefined') {
  const persister = createLocalPersister(store, 'recipe-maestro-state');
  persister.startAutoSave(500);
}

// Core helper functions
export function updateStep(step: string) {
  store.setCell('wizardState', 'currentStep', 'step', step);
}

export function markStepComplete(step: string) {
  const currentCompleted = getCompletedSteps();
  if (!currentCompleted.includes(step)) {
    store.setCell(
      'wizardState', 
      'currentStep', 
      'completed', 
      JSON.stringify([...currentCompleted, step])
    );
  }
}

export function getCompletedSteps(): string[] {
  return JSON.parse(store.getCell('wizardState', 'currentStep', 'completed') || '[]');
}

export function getCurrentStep(): string {
  return store.getCell('wizardState', 'currentStep', 'step') || 'skill';
}
```

### 1.3 Create Svelte Bindings (src/lib/stores/tinybaseHooks.ts)
```typescript
import { store } from './recipeStore';
import { createSvelteHooks } from '@tinybase/svelte';

export const {
  useCell,
  useTable
} = createSvelteHooks(store);
```

## 2. Route Structure Implementation

### 2.1 Base Layout (src/routes/+layout.svelte)
```svelte
<script lang="ts">
  import '../app.postcss';
  // Import the store to ensure it's initialized
  import '$lib/stores/recipeStore';
</script>

<div class="min-h-screen bg-background text-foreground">
  <main class="container mx-auto px-4 py-8">
    <slot />
  </main>
</div>
```

### 2.2 Basic Route Files Structure

```
src/routes/
├── +page.svelte               # Landing page
├── skill/
│   ├── +page.svelte           # Skill selection step
│   └── +page.ts               # Load function
├── cuisine/
│   ├── +page.svelte           # Cuisine selection step 
│   └── +page.ts               # Load function with validation
└── dietary/
    ├── +page.svelte           # Dietary preferences step
    └── +page.ts               # Load function with validation
```

### 2.3 Route Protection Example (src/routes/cuisine/+page.ts)

```typescript
import { redirect } from '@sveltejs/kit';
import { getCompletedSteps } from '$lib/stores/recipeStore';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
  const completedSteps = getCompletedSteps();
  
  // Redirect if the skill step hasn't been completed
  if (!completedSteps.includes('skill')) {
    throw redirect(303, '/skill');
  }
  
  return {};
};
```

## 3. Navigation Flow Implementation

Create a simple navigation system using SvelteKit's `goto` function in conjunction with the TinyBase store:

```typescript
// Example navigation function (to be used in components)
import { goto } from '$app/navigation';
import { updateStep, markStepComplete } from '$lib/stores/recipeStore';

function navigateToStep(step: string) {
  updateStep(step);
  markStepComplete(currentStep); // Mark the current step as completed
  goto(`/${step}`);
}
```

## 4. Step Progress Tracking

Add a reusable progress indicator component that reads from the TinyBase store:

```svelte
<!-- src/lib/components/StepProgress.svelte -->
<script lang="ts">
  import { useCell } from '$lib/stores/tinybaseHooks';
  import { getCompletedSteps } from '$lib/stores/recipeStore';
  
  const currentStep = useCell('wizardState', 'currentStep', 'step');
  
  const steps = [
    { id: 'skill', label: 'Skill Level' },
    { id: 'cuisine', label: 'Cuisine' },
    { id: 'dietary', label: 'Dietary Preferences' }
  ];
  
  let completedSteps = $derived.by(getCompletedSteps());
  const currentIndex = $derived.by(steps.findIndex(step => step.id === $currentStep));
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
```

## 5. Development Timeline (Core UI Framework Only)

| Task | Time Estimate |
|------|---------------|
| Setup TinyBase dependencies | 15 min |
| Create core state management store | 25 min |
| Set up route structure | 20 min |
| Implement route protection | 20 min |
| Create step progress component | 20 min |
| **Total** | **1.5 hours** |

## 6. Implementation Benefits

- **Persistent State**: TinyBase's local persistence ensures the wizard state is maintained across page refreshes
- **Step Validation**: Route protection prevents users from skipping steps
- **Bookmarkable URLs**: Each step has its own URL, making steps shareable and bookmarkable
- **Clean Separation**: State logic is separated from UI components
- **Progress Tracking**: Visual indicators show completed and current steps

This implementation provides the foundation for the wizard interface components that will be built in subsequent steps.
