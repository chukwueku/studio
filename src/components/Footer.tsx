import Link from "next/link";
import { ChefHat, Twitter, Instagram, Facebook } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <ChefHat className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold font-headline">David's Dishes</span>
          </div>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-primary transition-colors">
              <Twitter />
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              <Instagram />
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              <Facebook />
            </Link>
          </div>
        </div>
        <div className="mt-8 text-center text-sm text-muted-foreground border-t border-border pt-4">
          <p>&copy; {new Date().getFullYear()} David's Dishes. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
