import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";

const cartItems = [
    {
        id: 1,
        name: 'Jollof Rice Fiesta',
        price: 15.99,
        quantity: 1,
        imageUrl: 'https://picsum.photos/100/100',
        imageHint: 'jollof rice'
    },
    {
        id: 2,
        name: 'Spicy Beef Suya',
        price: 12.00,
        quantity: 2,
        imageUrl: 'https://picsum.photos/100/100',
        imageHint: 'beef suya'
    }
];

const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
const tax = subtotal * 0.08;
const total = subtotal + tax;

export default function CartPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-24">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-headline font-bold">Your Cart</h1>
      </div>
      {cartItems.length > 0 ? (
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            {cartItems.map(item => (
              <Card key={item.id} className="flex items-center p-4">
                <Image src={item.imageUrl} alt={item.name} data-ai-hint={item.imageHint} width={80} height={80} className="rounded-md" />
                <div className="ml-4 flex-grow">
                  <p className="font-bold">{item.name}</p>
                  <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" className="h-8 w-8"><Minus className="h-4 w-4" /></Button>
                  <span>{item.quantity}</span>
                  <Button variant="outline" size="icon" className="h-8 w-8"><Plus className="h-4 w-4" /></Button>
                </div>
                <Button variant="ghost" size="icon" className="ml-4 text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-5 w-5" />
                </Button>
              </Card>
            ))}
          </div>
          <div className="md:col-span-1">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Taxes</span>
                        <span>${tax.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                    <Button className="w-full mt-4">Proceed to Checkout</Button>
                </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-lg text-muted-foreground mb-4">Your cart is empty.</p>
          <Button asChild>
            <Link href="/menu">Start an Order</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
