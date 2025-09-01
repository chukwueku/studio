import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type OrderSummaryProps = {
    subtotal: number;
    tax: number;
    total: number;
};

export default function OrderSummary({ subtotal, tax, total }: OrderSummaryProps) {
    return (
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
    );
}
