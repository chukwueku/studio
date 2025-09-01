'use server';

import { suggestRecipe, type SuggestRecipeInput } from '@/ai/flows/recipe-suggestion';
import { suggestSpecials } from '@/ai/flows/specials-suggestion';
import { z } from 'zod';
import { revalidateTag } from 'next/cache';
import { unstable_cache as cache } from 'next/cache';
import { redirect } from 'next/navigation';

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

// We use Next.js's caching mechanism to store the cart.
const getCart = cache(
  async () => [] as CartItem[],
  ['cart'],
  { tags: ['cart'] }
)

export async function getCartItems(): Promise<CartItem[]> {
  return await getCart();
}

const addToCartActionSchema = z.object({
    name: z.string(),
    price: z.string(),
    imageUrl: z.string(),
    imageHint: z.string(),
});

export async function addToCart(input: z.infer<typeof addToCartActionSchema>) {
    try {
        const validatedInput = addToCartActionSchema.parse(input);
        const price = parseFloat(validatedInput.price);
        const cart = await getCart();
        const existingItem = cart.find(item => item.name === validatedInput.name);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: (cart.length + 1).toString(),
                name: validatedInput.name,
                price: price,
                quantity: 1,
                imageUrl: validatedInput.imageUrl,
                imageHint: validatedInput.imageHint,
            });
        }
        revalidateTag('cart');
        return { success: true };
    } catch (error) {
        console.error('Error in addToCart action:', error);
        return { success: false, error: 'Could not add item to cart.' };
    }
}


const updateCartItemQuantitySchema = z.object({
    id: z.string(),
    quantity: z.number().min(0),
});

export async function updateCartItemQuantity(input: z.infer<typeof updateCartItemQuantitySchema>) {
    try {
        const { id, quantity } = updateCartItemQuantitySchema.parse(input);
        const cart = await getCart();
        
        if (quantity === 0) {
            const newCart = cart.filter(i => i.id !== id);
            cart.length = 0;
            Array.prototype.push.apply(cart, newCart);
        } else {
            const item = cart.find(i => i.id === id);
            if (item) {
                item.quantity = quantity;
            } else {
              return { success: false, error: 'Item not found in cart.' };
            }
        }
        revalidateTag('cart');
        return { success: true };
    } catch (error) {
        console.error('Error updating cart item quantity:', error);
        return { success: false, error: 'Could not update cart item.' };
    }
}

const removeFromCartSchema = z.object({
    id: z.string(),
});

export async function removeFromCart(input: z.infer<typeof removeFromCartSchema>) {
    try {
        const { id } = removeFromCartSchema.parse(input);
        const cart = await getCart();
        const newCart = cart.filter(i => i.id !== id);
        
        cart.length = 0;
        Array.prototype.push.apply(cart, newCart);
        
        revalidateTag('cart');
        return { success: true };
    } catch (error) {
        console.error('Error removing from cart:', error);
        return { success: false, error: 'Could not remove item from cart.' };
    }
}

type Order = {
    id: string;
    date: string;
    total: number;
    status: 'Processing' | 'Delivered';
    items: CartItem[];
};

const getOrdersCache = cache(
    async () => [] as Order[],
    ['orders'],
    { tags: ['orders'] }
);

export async function getOrders(): Promise<Order[]> {
    return await getOrdersCache();
}

const placeOrderSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    address: z.string().min(1, 'Address is required'),
    cartItems: z.array(z.any()),
});


export async function placeOrder(input: unknown) {
    try {
        const validatedInput = placeOrderSchema.parse(input);
        const cart = await getCart();
        if (cart.length === 0) {
            return { success: false, error: "Your cart is empty." };
        }

        const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
        const tax = subtotal * 0.08;
        const total = subtotal + tax;

        const orders = await getOrdersCache();
        const newOrder: Order = {
            id: (orders.length + 10001).toString(),
            date: new Date().toISOString().split('T')[0],
            total: total,
            status: 'Processing',
            items: [...cart],
        };
        
        orders.unshift(newOrder); // Add to beginning
        
        // Clear cart
        cart.length = 0;
        
        revalidateTag('cart');
        revalidateTag('orders');

    } catch(error) {
        console.error('Error placing order:', error);
        if (error instanceof z.ZodError) {
          return { success: false, error: error.errors.map(e => e.message).join(', ') };
        }
        return { success: false, error: "Could not place order." };
    }

    // Redirect to a success page
    redirect('/order/success');
}