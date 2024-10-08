"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CircleUser, Menu, Package2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Header = () => {
  const pathname = usePathname();
  const [currentPath, setCurrentPath] = useState("");

  useEffect(() => {
    setCurrentPath(pathname);
  }, [pathname]);

  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          href="#"
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          <Package2 className="h-6 w-6" />
          <span className="sr-only">Acme Inc</span>
        </Link>
        <Link
          href="/admin/dashboard"
          className={`transition-colors hover:text-foreground ${
            currentPath === "/admin/dashboard"
              ? "text-primary"
              : "text-muted-foreground"
          }`}
        >
          Accueil
        </Link>
        <Link
          href="/admin/commandes"
          className={`transition-colors hover:text-foreground ${
            currentPath === "/admin/commandes"
              ? "text-primary"
              : "text-muted-foreground"
          }`}
        >
          Commandes
        </Link>
        <Link
          href="/admin/produits"
          className={`transition-colors hover:text-foreground ${
            currentPath === "/admin/produits"
              ? "text-primary"
              : "text-muted-foreground"
          }`}
        >
          Produits
        </Link>
        <Link
          href="/admin/clients"
          className={`transition-colors hover:text-foreground ${
            currentPath === "/admin/clients"
              ? "text-primary"
              : "text-muted-foreground"
          }`}
        >
          Clients
        </Link>
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="#"
              className="flex items-center gap-2 text-lg font-semibold"
            >
              <Package2 className="h-6 w-6" />
              <span className="sr-only">Acme Inc</span>
            </Link>
            <Link
              href="/admin/dashboard"
              className={`hover:text-foreground ${
                currentPath === "/admin/dashboard"
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/admin/commandes"
              className={`hover:text-foreground ${
                currentPath === "/admin/commandes"
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              Orders
            </Link>
            <Link
              href="/admin/produits"
              className={`hover:text-foreground ${
                currentPath === "/admin/produits"
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              Products
            </Link>
            <Link
              href="/admin/clients"
              className={`hover:text-foreground ${
                currentPath === "/admin/clients"
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              Customers
            </Link>
            <Link
              href="/admin/analytics"
              className="text-muted-foreground hover:text-foreground"
            >
              Analytics
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex w-auto items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <CircleUser className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
