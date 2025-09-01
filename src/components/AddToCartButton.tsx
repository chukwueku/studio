'use client';

import { useTransition } from 'react';
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
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleAddToCart = async () => {
    startTransition(async () => {
      const result = await addToCart({ name, price, imageUrl, imageHint });
      if (result.error) {
        toast({
          variant: 'destructive',
          title: 'Uh oh!',
          description: result.error,
        });
      } else {
        toast({
          title: 'Added to Cart',
          description: `${name} has been added to your cart.`,
        });
      }
    });
  };

  return (
    <Button onClick={handleAddToCart} disabled={isPending}>
      {isPending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <ShoppingCart className="mr-2 h-4 w-4" />
      )}
      Add to Cart
    </Button>
  );
}
