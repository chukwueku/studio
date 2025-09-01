import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Utensils } from "lucide-react";

type Special = {
    name: string;
    description: string;
    price: string;
    originalPrice: string;
    imageUrl: string;
    imageHint: string;
    tag: string;
};

// In a real application, this data would come from your backend.
const getSpecials = async (): Promise<Special[]> => {
    return [
        {
            name: "Jollof & Chicken Combo",
            description: "A hearty portion of our signature Jollof Rice served with a succulent grilled chicken leg.",
            price: "18.00",
            originalPrice: "22.00",
            imageUrl: "https://picsum.photos/600/400",
            imageHint: "jollof chicken",
            tag: "Today's Special"
        },
        {
            name: "Egusi Soup Family Deal",
            description: "A large pot of Egusi Soup with assorted meats, perfect for a family of four. Includes fufu.",
            price: "45.00",
            originalPrice: "55.00",
            imageUrl: "https://picsum.photos/600/400",
            imageHint: "egusi soup family",
            tag: "Family Deal"
        },
        {
            name: "Lunch-Time Suya",
            description: "Two skewers of our spicy beef suya with a side of onions. The perfect midday kick.",
            price: "10.00",
            originalPrice: "12.00",
            imageUrl: "https://picsum.photos/600/400",
            imageHint: "beef suya lunch",
            tag: "Lunch Only"
        },
    ];
};

export default async function SpecialsPage() {
    const specials = await getSpecials();

    return (
        <div className="container mx-auto px-4 py-12 md:py-24">
            <div className="text-center mb-12">
                <div className="inline-block bg-primary/10 text-primary p-3 rounded-full mb-4">
                    <Utensils className="h-8 w-8" />
                </div>
                <h1 className="text-4xl md:text-5xl font-headline font-bold">Daily Specials</h1>
                <p className="mt-4 text-lg text-muted-foreground">Amazing deals on your favorite dishes, available for a limited time!</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {specials.map((special) => (
                    <Card key={special.name} className="flex flex-col overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl">
                        <CardHeader className="p-0 relative">
                            <Badge className="absolute top-2 right-2">{special.tag}</Badge>
                            <div className="aspect-video relative">
                                <Image
                                    src={special.imageUrl}
                                    alt={special.name}
                                    data-ai-hint={special.imageHint}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </CardHeader>
                        <CardContent className="flex-grow p-6">
                            <CardTitle className="font-headline text-2xl mb-2">{special.name}</CardTitle>
                            <CardDescription>{special.description}</CardDescription>
                        </CardContent>
                        <div className="flex justify-between items-center p-6 pt-0">
                            <div className="flex items-baseline gap-2">
                                <p className="text-2xl font-bold text-primary">${special.price}</p>
                                <p className="text-md font-medium text-muted-foreground line-through">${special.originalPrice}</p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
