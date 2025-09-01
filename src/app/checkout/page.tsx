import { getCartItems } from "@/lib/actions";
import { redirect } from "next/navigation";
import CheckoutForm from "./CheckoutForm";
import OrderSummary from "@/app/cart/OrderSummary";

export default async function CheckoutPage() {
    const cartItems = await getCartItems();

    if (cartItems.length === 0) {
        redirect('/cart');
    }

    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const tax = subtotal * 0.08;
    const total = subtotal + tax;

    return (
        <div className="container mx-auto px-4 py-12 md:py-24">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-headline font-bold">Checkout</h1>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                   <CheckoutForm cartItems={cartItems} />
                </div>
                <div className="md:col-span-1">
                   <div className="sticky top-24">
                        <OrderSummary subtotal={subtotal} tax={tax} total={total} />
                   </div>
                </div>
            </div>
        </div>
    );
}