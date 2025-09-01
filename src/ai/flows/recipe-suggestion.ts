// Recipe suggestion AI agent.
//
// - suggestRecipe - A function that handles the recipe suggestion process.
// - SuggestRecipeInput - The input type for the suggestRecipe function.
// - SuggestRecipeOutput - The return type for the suggestRecipe function.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

const SuggestRecipeInputSchema = z.object({
  viewingHistory: z
    .string()
    .describe(
      'A comma separated list of names of recipes the user has previously viewed.'
    ),
  dietaryRequirements: z
    .string()
    .describe(
      'A comma separated list of dietary requirements of the user, such as vegetarian, vegan, gluten-free, etc.'
    ),
});
export type SuggestRecipeInput = z.infer<typeof SuggestRecipeInputSchema>;

const SuggestRecipeOutputSchema = z.object({
  recipeName: z.string().describe('The name of the suggested recipe.'),
  ingredients: z.string().describe('The ingredients of the suggested recipe.'),
  instructions: z.string().describe('The instructions of the suggested recipe.'),
});
export type SuggestRecipeOutput = z.infer<typeof SuggestRecipeOutputSchema>;

export async function suggestRecipe(input: SuggestRecipeInput): Promise<SuggestRecipeOutput> {
  return suggestRecipeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestRecipePrompt',
  input: {schema: SuggestRecipeInputSchema},
  output: {schema: SuggestRecipeOutputSchema},
  prompt: `You are a recipe suggestion AI. You will suggest a recipe based on the user's viewing history and dietary requirements.

Viewing history: {{{viewingHistory}}}
Dietary requirements: {{{dietaryRequirements}}}

Suggest a recipe that the user might enjoy, based on their viewing history and dietary requirements. Provide the recipe name, ingredients, and instructions. Make sure the recipe matches their dietary requirements.

Recipe Name:
Ingredients:
Instructions:`,
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const suggestRecipeFlow = ai.defineFlow(
  {
    name: 'suggestRecipeFlow',
    inputSchema: SuggestRecipeInputSchema,
    outputSchema: SuggestRecipeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
