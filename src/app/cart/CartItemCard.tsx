'use client';

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Minus, Plus, Trash2, Loader2 } from "lucide-react";
import { useTransition } from "react";
import { updateCartItemQuantity, removeFromCart } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";

type CartItem = {
    id: string;
    name: string;
    price: number;
    quantity: number;
    imageUrl: string;
    imageHint: string;
};

export default function CartItemCard({ item }: { item: CartItem }) {
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();

    const handleQuantityChange = (newQuantity: number) => {
        startTransition(async () => {
            const { error } = await updateCartItemQuantity({ id: item.id, quantity: newQuantity });
            if (error) {
                toast({ variant: 'destructive', title: 'Error', description: 'Failed to update quantity.'});
            }
        });
    };

    const handleRemove = () => {
        startTransition(async () => {
            const { error } = await removeFromCart({ id: item.id });
             if (error) {
                toast({ variant: 'destructive', title: 'Error', description: 'Failed to remove item.'});
            } else {
                toast({ title: 'Removed from Cart', description: `${item.name} removed.`});
            }
        });
    };

    return (
        <Card className="flex items-center p-4 relative">
            {isPending && (
                <div className="absolute inset-0 bg-background/50 flex items-center justify-center rounded-lg">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            )}
            <Image src={item.imageUrl} alt={item.name} data-ai-hint={item.imageHint} width={80} height={80} className="rounded-md" />
            <div className="ml-4 flex-grow">
                <p className="font-bold">{item.name}</p>
                <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleQuantityChange(item.quantity - 1)} disabled={isPending}>
                    <Minus className="h-4 w-4" />
                </Button>
                <span>{item.quantity}</span>
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleQuantityChange(item.quantity + 1)} disabled={isPending}>
                    <Plus className="h-4 w-4" />
                </Button>
            </div>
            <Button variant="ghost" size="icon" className="ml-4 text-muted-foreground hover:text-destructive" onClick={handleRemove} disabled={isPending}>
                <Trash2 className="h-5 w-5" />
            </Button>
        </Card>
    );
}
