'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ShoppingCart } from 'lucide-react';
import { useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';
import { addToCart } from '@/lib/actions';
import { Badge } from './ui/badge';

type Meal = {
  id: string;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  imageHint: string;
  quantityInCart?: number;
};

type MealCardProps = {
  meal: Meal;
};

export default function MealCard({ meal }: MealCardProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleAddToCart = async () => {
    startTransition(async () => {
      const result = await addToCart({ 
        name: meal.name, 
        price: meal.price,
        imageUrl: meal.imageUrl,
        imageHint: meal.imageHint,
      });

      if (result?.error) {
        toast({
          variant: 'destructive',
          title: 'Uh oh!',
          description: result.error,
        });
      } else {
        toast({
          title: 'Added to Cart',
          description: `${meal.name} has been added to your cart.`,
        });
      }
    });
  };

  return (
    <Card className="flex flex-col overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl">
      <CardHeader className="p-0 relative">
        <div className="aspect-video relative">
          <Image
            src={meal.imageUrl}
            alt={meal.name}
            data-ai-hint={meal.imageHint}
            fill
            className="object-cover"
          />
           {meal.quantityInCart && meal.quantityInCart > 0 && (
            <Badge variant="secondary" className="absolute top-2 right-2 text-lg">
              {meal.quantityInCart}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-6">
        <CardTitle className="font-headline text-2xl mb-2">{meal.name}</CardTitle>
        <CardDescription>{meal.description}</CardDescription>
      </CardContent>
      <CardFooter className="flex justify-between items-center p-6 pt-0">
        <p className="text-xl font-bold text-primary">${meal.price}</p>
        <Button onClick={handleAddToCart} disabled={isPending}>
          {isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <ShoppingCart className="mr-2 h-4 w-4" />
          )}
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
