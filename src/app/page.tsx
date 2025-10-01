import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import MealCard from '@/components/MealCard';
import RecipeSuggestionForm from '@/components/RecipeSuggestionForm';
import { Utensils, Soup, Cookie, GlassWater } from 'lucide-react';

const featuredMeals = [
  {
    name: 'Jollof Rice Fiesta',
    description: 'A classic West African dish, our Jollof is made with long-grain rice, tomatoes, onions, spices, and your choice of protein.',
    price: '15.99',
    imageUrl: 'https://picsum.photos/seed/jollof-rice/600/400',
    imageHint: 'jollof rice',
    category: 'Rice',
  },
  {
    name: 'Egusi Soup Delight',
    description: 'A rich and savory soup made from ground melon seeds, leafy vegetables, and a blend of traditional spices.',
    price: '18.50',
    imageUrl: 'https://picsum.photos/seed/egusi-soup/600/400',
    imageHint: 'egusi soup',
    category: 'Soups',
  },
  {
    name: 'Spicy Beef Suya',
    description: 'Grilled skewers of beef, marinated in a spicy peanut and ginger blend. A popular Nigerian street food snack.',
    price: '12.00',
    imageUrl: 'https://picsum.photos/seed/beef-suya/600/400',
    imageHint: 'beef suya',
    category: 'Snacks',
  },
];

const categories = [
  { name: 'Rice', icon: <Utensils className="h-8 w-8" /> },
  { name: 'Soups', icon: <Soup className="h-8 w-8" /> },
  { name: 'Snacks', icon: <Cookie className="h-8 w-8" /> },
  { name: 'Drinks', icon: <GlassWater className="h-8 w-8" /> },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <section className="relative w-full h-[60vh] md:h-[80vh]">
        <Image
          src="https://picsum.photos/seed/food-spread/1920/1080"
          alt="A spread of delicious food"
          data-ai-hint="food spread"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="relative container mx-auto px-4 h-full flex flex-col items-center justify-center text-center text-white">
          <h1 className="text-4xl md:text-6xl font-headline font-bold text-shadow-lg">
            Savor the Flavor of Home
          </h1>
          <p className="mt-4 max-w-2xl text-lg md:text-xl">
            Experience authentic, home-cooked meals from David's kitchen, delivered right to your doorstep.
          </p>
          <Button asChild size="lg" className="mt-8 bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href="/menu">Explore Menu</Link>
          </Button>
        </div>
      </section>

      <section id="featured" className="py-12 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-headline font-bold text-center mb-12">
            Featured Meals
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredMeals.map((meal) => (
              <MealCard key={meal.name} meal={meal} />
            ))}
          </div>
        </div>
      </section>
      
      <section id="categories" className="py-12 md:py-24 bg-secondary/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-headline font-bold text-center mb-12">
            Browse by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {categories.map((category) => (
              <Link href="/menu" key={category.name} className="group">
                <div className="flex justify-center items-center h-24 w-24 bg-background rounded-full mx-auto mb-4 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg">
                  {category.icon}
                </div>
                <h3 className="text-xl font-bold font-headline">{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      <section id="ai-chef" className="py-12 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-headline font-bold mb-4">
              Can't Decide?
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Let our AI Chef suggest a new dish based on your tastes. Just tell us your dietary needs!
            </p>
          </div>
          <RecipeSuggestionForm />
        </div>
      </section>

      <section id="contact" className="py-12 md:py-24 bg-secondary/50">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-headline">Contact Us</CardTitle>
              <CardDescription>Have a question or a special request? Drop us a line.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input placeholder="Your Name" />
                  <Input type="email" placeholder="Your Email" />
                </div>
                <Textarea placeholder="Your Message" rows={5} />
              </form>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                Send Message
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>
    </div>
  );
}
