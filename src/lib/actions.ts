'use server';

import { suggestRecipe, type SuggestRecipeInput } from '@/ai/flows/recipe-suggestion';
import { suggestSpecials } from '@/ai/flows/specials-suggestion';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const recipeActionSchema = z.object({
  dietaryRequirements: z.string(),
});

export async function getRecipeSuggestion(input: z.infer<typeof recipeActionSchema>) {
  try {
    const validatedInput = recipeActionSchema.parse(input);

    const aiInput: SuggestRecipeInput = {
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

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  imageHint: string;
};

// In a real app, this would be a database or a user-specific session.
// For this prototype, we'll use a simple in-memory store.
let cart: CartItem[] = [];

const addToCartActionSchema = z.object({
    name: z.string(),
    price: z.string(),
    imageUrl: z.string().optional(),
    imageHint: z.string().optional(),
});

export async function addToCart(input: z.infer<typeof addToCartActionSchema>) {
    try {
        const validatedInput = addToCartActionSchema.parse(input);
        const price = parseFloat(validatedInput.price);
        const existingItem = cart.find(item => item.name === validatedInput.name);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: (cart.length + 1).toString(),
                name: validatedInput.name,
                price: price,
                quantity: 1,
                imageUrl: validatedInput.imageUrl || `https://picsum.photos/100/100?q=${validatedInput.name}`,
                imageHint: validatedInput.imageHint || validatedInput.name.toLowerCase().split(' ').slice(0,2).join(' '),
            });
        }
        revalidatePath('/cart');
        return { success: true, cart };
    } catch (error) {
        console.error('Error in addToCart action:', error);
        throw new Error('Could not add item to cart.');
    }
}

export async function getCartItems(): Promise<CartItem[]> {
    return Promise.resolve(cart);
}

const updateCartItemQuantitySchema = z.object({
    id: z.string(),
    quantity: z.number().min(1),
});

export async function updateCartItemQuantity(input: z.infer<typeof updateCartItemQuantitySchema>) {
    try {
        const { id, quantity } = updateCartItemQuantitySchema.parse(input);
        const item = cart.find(i => i.id === id);
        if (item) {
            item.quantity = quantity;
        }
        revalidatePath('/cart');
        return { success: true };
    } catch (error) {
        console.error('Error updating cart item quantity:', error);
        throw new Error('Could not update cart item.');
    }
}

const removeFromCartSchema = z.object({
    id: z.string(),
});

export async function removeFromCart(input: z.infer<typeof removeFromCartSchema>) {
    try {
        const { id } = removeFromCartSchema.parse(input);
        cart = cart.filter(i => i.id !== id);
        revalidatePath('/cart');
        return { success: true };
    } catch (error) {
        console.error('Error removing from cart:', error);
        throw new Error('Could not remove item from cart.');
    }
}
