import MealCard from "@/components/MealCard";
import { getCartItems } from "@/lib/actions";
import images from '@/lib/placeholder-images.json';

const menuItems = [
    {
      id: '1',
      name: 'Jollof Rice Fiesta',
      description: 'A classic West African dish, our Jollof is made with long-grain rice, tomatoes, onions, spices, and your choice of protein.',
      price: '15.99',
      imageUrl: images['jollof-rice'].url,
      imageHint: images['jollof-rice'].hint,
      category: 'Rice',
    },
    {
      id: '2',
      name: 'Egusi Soup Delight',
      description: 'A rich and savory soup made from ground melon seeds, leafy vegetables, and a blend of traditional spices.',
      price: '18.50',
      imageUrl: images['egusi-soup'].url,
      imageHint: images['egusi-soup'].hint,
      category: 'Soups',
    },
    {
      id: '3',
      name: 'Spicy Beef Suya',
      description: 'Grilled skewers of beef, marinated in a spicy peanut and ginger blend. A popular Nigerian street food snack.',
      price: '12.00',
      imageUrl: images['beef-suya'].url,
      imageHint: images['beef-suya'].hint,
      category: 'Snacks',
    },
    {
        id: '4',
        name: 'Plantain Medley',
        description: 'Sweet, ripe plantains fried to golden perfection. A perfect side or a delicious snack on its own.',
        price: '7.50',
        imageUrl: images['plantain'].url,
        imageHint: images['plantain'].hint,
        category: 'Snacks',
    },
    {
        id: '5',
        name: 'Zobo Drink',
        description: 'A refreshing hibiscus iced tea, infused with ginger and pineapple for a sweet and tangy flavor.',
        price: '4.00',
        imageUrl: images['zobo-drink'].url,
        imageHint: images['zobo-drink'].hint,
        category: 'Drinks',
    },
    {
        id: '6',
        name: 'Okra Soup',
        description: 'A flavorful and mucilaginous soup made with fresh okra, fish, and assorted meats.',
        price: '17.00',
        imageUrl: images['okra-soup'].url,
        imageHint: images['okra-soup'].hint,
        category: 'Soups',
    },
  ];

export default async function MenuPage() {
  const cartItems = await getCartItems();
  
  const menuItemsWithCartQuantity = menuItems.map(menuItem => {
    const cartItem = cartItems.find(item => item.name === menuItem.name);
    return {
      ...menuItem,
      quantityInCart: cartItem ? cartItem.quantity : 0,
    }
  });

  return (
    <div className="container mx-auto px-4 py-12 md:py-24">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-headline font-bold">Our Menu</h1>
        <p className="mt-4 text-lg text-muted-foreground">Explore our wide range of delicious, home-cooked meals.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {menuItemsWithCartQuantity.map((meal) => (
          <MealCard key={meal.name} meal={meal} />
        ))}
      </div>
    </div>
  );
}
