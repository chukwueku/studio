'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { addToCart } from '@/lib/actions';
import { Button } from './ui/button';
import { Loader2, ShoppingCart } from 'lucide-react';

type AddToCartButtonProps = {
  name: string;
  price: string;
  imageUrl: string;
  imageHint: string;
};

export default function AddToCartButton({ name, price, imageUrl, imageHint }: AddToCartButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      await addToCart({ name, price, imageUrl, imageHint });
      toast({
        title: 'Added to Cart',
        description: `${name} has been added to your cart.`,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Uh oh!',
        description: 'Could not add item to cart. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={handleAddToCart} disabled={isLoading}>
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <ShoppingCart className="mr-2 h-4 w-4" />
      )}
      Add to Cart
    </Button>
  );
}
