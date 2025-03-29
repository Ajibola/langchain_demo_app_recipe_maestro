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
