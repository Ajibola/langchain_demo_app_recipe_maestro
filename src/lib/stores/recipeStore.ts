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
			dietaryPreferences: JSON.stringify([])
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
