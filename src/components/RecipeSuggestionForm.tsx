'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getRecipeSuggestion } from '@/lib/actions';
import type { SuggestRecipeOutput } from '@/ai/flows/recipe-suggestion';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles } from 'lucide-react';

const formSchema = z.object({
  dietaryRequirements: z.string().min(2, {
    message: 'Please enter at least one dietary requirement.',
  }),
});

export default function RecipeSuggestionForm() {
  const [suggestion, setSuggestion] = useState<SuggestRecipeOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dietaryRequirements: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setSuggestion(null);

    try {
      const result = await getRecipeSuggestion(values);
      if (result) {
        setSuggestion(result);
      } else {
        toast({
          variant: 'destructive',
          title: 'Uh oh! Something went wrong.',
          description: 'Could not generate a recipe. Please try again.',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An unexpected error occurred.',
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <Card className="max-w-2xl mx-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Get a Recipe Suggestion</CardTitle>
              <CardDescription>
                For example: "vegetarian, gluten-free" or "no nuts".
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="dietaryRequirements"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dietary Requirements</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Vegan, low-carb" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Suggest Recipe
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {suggestion && (
        <Card className="max-w-2xl mx-auto animate-in fade-in-50">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">{suggestion.recipeName}</CardTitle>
            <CardDescription>Here's a custom recipe suggestion for you!</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-bold mb-2">Ingredients:</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{suggestion.ingredients}</p>
            </div>
            <div>
              <h3 className="font-bold mb-2">Instructions:</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{suggestion.instructions}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
