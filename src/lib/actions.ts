'use server';

import { suggestRecipe, type SuggestRecipeInput } from '@/ai/flows/recipe-suggestion';
import { z } from 'zod';

const actionSchema = z.object({
  dietaryRequirements: z.string(),
});

export async function getRecipeSuggestion(input: z.infer<typeof actionSchema>) {
  try {
    const validatedInput = actionSchema.parse(input);

    const aiInput: SuggestRecipeInput = {
      // For demonstration, we'll use a hardcoded viewing history.
      // In a real app, this would come from the user's profile.
      viewingHistory: 'Jollof Rice, Egusi Soup',
      dietaryRequirements: validatedInput.dietaryRequirements,
    };
    
    const suggestion = await suggestRecipe(aiInput);
    return suggestion;
  } catch (error) {
    console.error('Error in getRecipeSuggestion action:', error);
    return null;
  }
}
