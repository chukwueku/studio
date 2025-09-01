import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { getOrders } from "@/lib/actions";

export default async function ProfilePage() {
  const pastOrders = await getOrders();

  return (
    <div className="container mx-auto px-4 py-12 md:py-24">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-headline font-bold">My Profile</h1>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">My Details</CardTitle>
                    <CardDescription>Update your information here.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" defaultValue="John Doe" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue="john.doe@example.com" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" type="tel" defaultValue="+1234567890" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input id="address" defaultValue="123 Main St, Anytown, USA" />
                    </div>
                    <Button className="w-full">Save Changes</Button>
                    <Button variant="outline" className="w-full">Logout</Button>
                </CardContent>
            </Card>
        </div>
        <div className="md:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Order History</CardTitle>
                    <CardDescription>View your past orders.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {pastOrders.length > 0 ? (
                            pastOrders.map((order, index) => (
                                <div key={order.id}>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-bold">Order #{order.id}</p>
                                            <p className="text-sm text-muted-foreground">{new Date(order.date).toLocaleDateString()}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold">${order.total.toFixed(2)}</p>
                                            <p className={`text-sm font-medium ${order.status === 'Delivered' ? 'text-green-600' : 'text-yellow-600'}`}>{order.status}</p>
                                        </div>
                                    </div>
                                    <div className="my-4">
                                        <ul className="text-sm text-muted-foreground space-y-1 pl-4">
                                            {order.items.map(item => (
                                                <li key={item.id} className="flex justify-between">
                                                   <span>{item.name} x {item.quantity}</span>
                                                   <span>${(item.price * item.quantity).toFixed(2)}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    {index < pastOrders.length -1 && <Separator />}
                                </div>
                            ))
                        ) : (
                            <p className="text-muted-foreground text-center">You have no past orders.</p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
