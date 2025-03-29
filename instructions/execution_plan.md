# Recipe Maestro: Front-End Implementation Plan

## Overview
Recipe Maestro is an AI-powered recipe generator app featuring a wizard-style UI that guides users through simple steps to create personalized recipes based on their preferences, skill level, and dietary restrictions.

## Tech Stack

| Component | Technology | Justification |
|-----------|------------|---------------|
| **Framework** | Svelte 5 | Latest version with rune-based reactivity for efficient state management |
| **UI Library** | shadcn/svelte | Pre-built accessible components to speed up development |
| **Styling** | Tailwind CSS | Comes with shadcn/svelte; allows rapid UI development |
| **State Management** | Svelte signals | Built-in state management with createSignal |
| **Routing** | File-based routing | Svelte's built-in routing for simple navigation |

## Feature Implementation Roadmap

### 1. Core UI Framework
- **Project Initialization**
  - Setup Svelte 5 project
  - Configure shadcn/svelte components
  - Setup file-based routing

- **State Management**
  - Create stores for user preferences
  - Setup reactivity for wizard steps
  - Implement mock recipe generation service

### 2. Wizard Interface Implementation
- **Wizard Container**
  - Step navigation system
  - Progress indicator
  - Next/Previous buttons
  - Form submission handling

- **Step 1: Cooking Proficiency**
  - 3 selectable skill levels with descriptions
  - Visual card-based UI with selection state
  - Store selected value in state

- **Step 2: Cuisine Selection**
  - Grid layout with 6-8 cuisine options
  - Visual selection indicators
  - Store selected cuisine in state

- **Step 3: Dietary Preferences**
  - Multi-select checkbox interface
  - Common dietary restrictions
  - Store selected restrictions in state

### 3. Recipe Display
- **Recipe Card Component**
  - Title and description display
  - Ingredients list
  - Step-by-step instructions
  - Basic nutritional information
  - Save recipe functionality

- **UI Polish**
  - Loading states
  - Error handling
  - Responsive design
  - Visual consistency across components

## Component Structure

```
src/
├── lib/
│   ├── components/
│   │   ├── ui/               # shadcn components
│   │   ├── RecipeForm.svelte # Main wizard container
│   │   ├── SkillLevel.svelte # Skill level selection
│   │   ├── CuisineSelect.svelte # Cuisine selection grid
│   │   ├── DietaryOptions.svelte # Dietary preferences
│   │   ├── RecipeCard.svelte # Recipe display
│   │   └── LoadingState.svelte # Loading indicator
│   ├── stores/
│   │   └── recipeStore.js    # User preferences & recipe data
│   └── services/
│       └── recipeService.js  # Mock LLM service
├── routes/
│   ├── +page.svelte         # Home page with wizard
│   └── recipe/+page.svelte  # Recipe display page
└── app.html
```

## Implementation Timeline (3-4 Hour Hackathon)

| Time | Task | Description |
|------|------|-------------|
| **0:00 - 0:30** | Project Setup | Initialize project, install dependencies |
| **0:30 - 1:00** | Store & Service Setup | Create state management and mock service |
| **1:00 - 1:30** | Wizard Container | Implement step navigation system |
| **1:30 - 2:00** | Skill & Cuisine Steps | Create first two form steps |
| **2:00 - 2:30** | Dietary Preferences & Submit | Complete form implementation |
| **2:30 - 3:00** | Recipe Card | Implement recipe display |
| **3:00 - 3:30** | Polish & Testing | Improve UI, fix bugs, test user flow |
| **3:30 - 4:00** | Presentation Prep | Prepare demo script and highlights |

## MVP Feature Prioritization

### Must-Have (Implement First)
- Cooking proficiency selection
- Cuisine type selection
- Recipe generation & display
- Basic navigation between steps

### Should-Have (Implement If Time Permits)
- Dietary preferences selection
- Save recipe functionality
- Loading states & error handling

### Nice-to-Have (Post-Hackathon)
- Cooking time constraints
- Appliance selection
- Recipe history
- Sharing functionality

## Presentation Guidelines

### Demo Flow
1. Start at the home page
2. Select a cooking skill level
3. Choose a cuisine type
4. Select dietary preferences (if implemented)
5. Generate recipe
6. Show the recipe details
7. Demonstrate save functionality (if implemented)

### Key Selling Points
- User-friendly wizard interface (easier than chat)
- Personalized recipe generation
- Visual design using modern component library
- Modern stack with Svelte 5's cutting-edge reactivity

## Technical Implementation Notes

### Signals (State Management)
```javascript
// Example store implementation
import { createSignal } from 'svelte';

export const skillLevel = createSignal('intermediate');
export const cuisineType = createSignal('italian');
export const dietaryPreferences = createSignal([]);
export const recipe = createSignal(null);
```

### Mock Recipe Generation
For the hackathon, implement a mock recipe service that returns pre-defined recipes based on selected preferences. This avoids the complexity of actual LLM integration.

### Local Storage
Use browser localStorage to implement the recipe saving functionality:
```javascript
// Save recipe
function saveRecipe(recipeData) {
  const savedRecipes = JSON.parse(localStorage.getItem('savedRecipes') || '[]');
  savedRecipes.push(recipeData);
  localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes));
}
```

## Post-Hackathon Development Path
1. Integrate with actual LLM API
2. Add missing wizard steps (time constraints, appliances)
3. Implement user accounts and recipe history
4. Add recipe sharing functionality
5. Create mobile optimized version