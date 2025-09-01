import Link from "next/link";
import { getCartItems } from "@/lib/actions";
import CartItemCard from "./CartItemCard";
import OrderSummary from "./OrderSummary";
import { Button } from "@/components/ui/button";

export default async function CartPage() {
  const cartItems = await getCartItems();

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  return (
    <div className="container mx-auto px-4 py-12 md:py-24">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-headline font-bold">Your Cart</h1>
      </div>
      {cartItems.length > 0 ? (
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            {cartItems.map(item => (
              <CartItemCard key={item.id} item={item} />
            ))}
          </div>
          <div className="md:col-span-1">
            <OrderSummary subtotal={subtotal} tax={tax} total={total} />
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
