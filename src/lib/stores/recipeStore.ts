import { createStore } from 'tinybase';

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
			dietaryPreferences: JSON.stringify([]),
			maxTime: 60 // Default max time in minutes
		}
	})
	// Recipe data
	.setTable('recipeData', {
		recipe: {
			id: 'recipe',
			isLoading: false,
			error: '',
			data: JSON.stringify(null)
		}
	});

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
	const completedStr = store.getCell('wizardState', 'currentStep', 'completed');
	return JSON.parse(typeof completedStr === 'string' ? completedStr : '[]');
}

export function getCurrentStep(): string {
	const step = store.getCell('wizardState', 'currentStep', 'step');
	return typeof step === 'string' ? step : 'skill';
}

// Get recipe data
export function getRecipeData() {
	const recipeData = store.getCell('recipeData', 'recipe', 'data');
	if (typeof recipeData === 'string') {
		try {
			return JSON.parse(recipeData);
		} catch {
			return null;
		}
	}
	return null;
}

// Set recipe data
export function setRecipeData(data: Record<string, unknown>) {
	store.setCell('recipeData', 'recipe', 'data', JSON.stringify(data));
}

// Set recipe loading state
export function setRecipeLoading(isLoading: boolean) {
	store.setCell('recipeData', 'recipe', 'isLoading', isLoading);
}

// Get recipe loading state
export function getRecipeLoading(): boolean {
	return !!store.getCell('recipeData', 'recipe', 'isLoading');
}

// Set recipe error
export function setRecipeError(error: string) {
	store.setCell('recipeData', 'recipe', 'error', error);
}

// Get recipe error
export function getRecipeError(): string {
	const error = store.getCell('recipeData', 'recipe', 'error');
	return typeof error === 'string' ? error : '';
}

// Set max time
export function setMaxTime(time: number) {
	store.setCell('recipePreferences', 'preferences', 'maxTime', time);
}

// Get max time
export function getMaxTime(): number {
	const time = store.getCell('recipePreferences', 'preferences', 'maxTime');
	return typeof time === 'number' ? time : 60;
}
