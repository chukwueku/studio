import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function OrderSuccessPage() {
    return (
        <div className="container mx-auto px-4 py-12 md:py-24">
            <Card className="max-w-lg mx-auto text-center">
                <CardHeader>
                    <div className="mx-auto bg-green-100 text-green-700 rounded-full h-16 w-16 flex items-center justify-center">
                        <CheckCircle2 className="h-10 w-10" />
                    </div>
                    <CardTitle className="font-headline text-3xl mt-4">Order Placed Successfully!</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                        Thank you for your order. We've received it and will start preparing it right away. You can check the status of your order on your profile page.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Button asChild>
                            <Link href="/profile">View My Orders</Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/menu">Continue Shopping</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}