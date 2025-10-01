// Daily specials suggestion AI agent.
//
// - suggestSpecials - A function that handles the specials suggestion process.
// - SpecialsSuggestionOutput - The return type for the suggestSpecials function.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SpecialSchema = z.object({
    name: z.string().describe('The name of the special meal.'),
    description: z.string().describe('A brief, enticing description of the meal.'),
    price: z.string().describe("The special price of the meal as a string, e.g., '18.00'."),
    originalPrice: z.string().describe("The original price of the meal as a string, e.g., '22.00'."),
    imageUrl: z.string().url().describe("A placeholder image URL for the meal. Should be in the format https://picsum.photos/seed/your-seed/600/400."),
    imageHint: z.string().describe("One or two keywords for the meal image, e.g., 'jollof chicken'."),
    tag: z.string().describe("A short tag for the special, e.g., 'Today's Deal' or 'Family Combo'."),
});

const SpecialsSuggestionOutputSchema = z.array(SpecialSchema);

export type SpecialsSuggestionOutput = z.infer<typeof SpecialsSuggestionOutputSchema>;

export async function suggestSpecials(): Promise<SpecialsSuggestionOutput> {
  return suggestSpecialsFlow();
}

const prompt = ai.definePrompt({
  name: 'suggestSpecialsPrompt',
  output: {schema: SpecialsSuggestionOutputSchema},
  prompt: `You are an AI for a Nigerian restaurant called "David's Dishes". Your task is to generate a list of 3 daily specials.

The menu includes items like Jollof Rice, Egusi Soup, Beef Suya, Plantains, and Zobo drink.

Please generate 3 creative and appealing daily specials based on the menu. For each special, provide:
- A creative name.
- An enticing description.
- A special price and an original price. The special price should be lower.
- A placeholder image URL from picsum.photos using a unique seed for each meal (e.g., https://picsum.photos/seed/jollof-combo/600/400).
- A 1-2 word hint for the image.
- A short tag (e.g., "Today's Special", "Family Deal", "Lunch Only").

Ensure the response is a valid JSON array of 3 special objects.`,
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

const suggestSpecialsFlow = ai.defineFlow(
  {
    name: 'suggestSpecialsFlow',
    outputSchema: SpecialsSuggestionOutputSchema,
  },
  async () => {
    const {output} = await prompt();
    return output || [];
  }
);
