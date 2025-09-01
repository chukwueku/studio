'use server';

import { suggestRecipe, type SuggestRecipeInput } from '@/ai/flows/recipe-suggestion';
import { suggestSpecials } from '@/ai/flows/specials-suggestion';
import { z } from 'zod';

const recipeActionSchema = z.object({
  dietaryRequirements: z.string(),
});

export async function getRecipeSuggestion(input: z.infer<typeof recipeActionSchema>) {
  try {
    const validatedInput = recipeActionSchema.parse(input);

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

export async function getSpecials() {
  try {
    const specials = await suggestSpecials();
    return specials;
  }
  catch (error) {
    console.error('Error in getSpecials action:', error);
    // Return some default specials if the AI fails
    return [
        {
            name: "Jollof & Chicken Combo",
            description: "A hearty portion of our signature Jollof Rice served with a succulent grilled chicken leg.",
            price: "18.00",
            originalPrice: "22.00",
            imageUrl: "https://picsum.photos/600/400",
            imageHint: "jollof chicken",
            tag: "Today's Special"
        },
        {
            name: "Egusi Soup Family Deal",
            description: "A large pot of Egusi Soup with assorted meats, perfect for a family of four. Includes fufu.",
            price: "45.00",
            originalPrice: "55.00",
            imageUrl: "https://picsum.photos/600/400",
            imageHint: "egusi soup family",
            tag: "Family Deal"
        },
        {
            name: "Lunch-Time Suya",
            description: "Two skewers of our spicy beef suya with a side of onions. The perfect midday kick.",
            price: "10.00",
            originalPrice: "12.00",
            imageUrl: "https://picsum.photos/600/400",
            imageHint: "beef suya lunch",
            tag: "Lunch Only"
        },
    ];
  }
}

const addToCartActionSchema = z.object({
    name: z.string(),
    price: z.string(),
});

export async function addToCart(input: z.infer<typeof addToCartActionSchema>) {
    try {
        const validatedInput = addToCartActionSchema.parse(input);
        // In a real app, you would add the item to a database or session.
        // For now, we'll just log it to the console.
        console.log(`Added to cart: ${validatedInput.name} - $${validatedInput.price}`);
        return { success: true };
    } catch (error) {
        console.error('Error in addToCart action:', error);
        throw new Error('Could not add item to cart.');
    }
}
