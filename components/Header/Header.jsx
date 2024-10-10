"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CircleUser, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const Header = () => {
  const pathname = usePathname();
  const [currentPath, setCurrentPath] = useState("");

  useEffect(() => {
    setCurrentPath(pathname);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background px-4 md:px-8">
      {/* Menubar Navigation for Desktop */}
      <Menubar className="hidden w-fit gap-2 text-sm font-medium md:flex">
        {/* Lien direct pour Vue d'ensemble */}
        <MenubarMenu>
          <MenubarTrigger asChild>
            <Link
              href="/admin/dashboard"
              className={`w-full cursor-pointer rounded transition-colors ${
                currentPath === "/admin/dashboard"
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-muted"
              }`}
            >
              Vue d&apos;ensemble
            </Link>
          </MenubarTrigger>
        </MenubarMenu>

        {/* Produits */}
        <MenubarMenu>
          <MenubarTrigger
            className={`cursor-pointer rounded transition-colors ${
              currentPath === "/admin/produits" ||
              currentPath === "/admin/produits/ajouter-produit" ||
              currentPath === "/admin/produits/categories"
                ? "bg-accent text-accent-foreground"
                : "hover:bg-muted"
            }`}
          >
            Produits
          </MenubarTrigger>
          <MenubarContent>
            <MenubarItem className="cursor-pointer">
              <Link href="/admin/produits" className="w-full">
                Vue d&apos;ensemble
              </Link>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem>
              <Link href="/admin/produits/liste" className="w-full">
                Liste des produits
              </Link>
            </MenubarItem>
            <MenubarItem>
              <Link href="/admin/produits/categories" className="w-full">
                Catégories
              </Link>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        {/* Commandes */}
        <MenubarMenu>
          <MenubarTrigger className="hover:text-primary">
            Commandes
          </MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              <Link href="/admin/commandes">Liste des commandes</Link>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem>
              <Link href="#">Ajouter une commande</Link>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        {/* Clients */}
        <MenubarMenu>
          <MenubarTrigger className="hover:text-primary">
            Clients
          </MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              <Link href="/admin/clients">Liste des clients</Link>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem>
              <Link href="#">Ajouter un client</Link>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>

      {/* Mobile Navigation */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
            <Link href="/admin/dashboard" className="hover:text-foreground">
              Dashboard
            </Link>
            <Link href="/admin/produits" className="hover:text-foreground">
              Produits
            </Link>
            <Link href="/admin/commandes" className="hover:text-foreground">
              Commandes
            </Link>
            <Link href="/admin/clients" className="hover:text-foreground">
              Clients
            </Link>
          </nav>
        </SheetContent>
      </Sheet>

      {/* User Menu */}
      <div className="flex w-auto items-center gap-4 md:ml-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <CircleUser className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Mon Compte</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Paramètres</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Se déconnecter</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
