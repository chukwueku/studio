'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { addToCart } from '@/lib/actions';

type Meal = {
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  imageHint: string;
};

type MealCardProps = {
  meal: Meal;
};

export default function MealCard({ meal }: MealCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      await addToCart({ name: meal.name, price: meal.price });
      toast({
        title: 'Added to Cart',
        description: `${meal.name} has been added to your cart.`,
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
    <Card className="flex flex-col overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl">
      <CardHeader className="p-0">
        <div className="aspect-video relative">
          <Image
            src={meal.imageUrl}
            alt={meal.name}
            data-ai-hint={meal.imageHint}
            fill
            className="object-cover"
          />
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-6">
        <CardTitle className="font-headline text-2xl mb-2">{meal.name}</CardTitle>
        <CardDescription>{meal.description}</CardDescription>
      </CardContent>
      <CardFooter className="flex justify-between items-center p-6 pt-0">
        <p className="text-xl font-bold text-primary">${meal.price}</p>
        <Button onClick={handleAddToCart} disabled={isLoading}>
          {isLoading ? (
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
