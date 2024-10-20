"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Separator } from "../ui/separator";
import api from "@/app/api";

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [currentPath, setCurrentPath] = useState("");
  const [isOpen, setIsOpen] = useState(false); // État pour contrôler l'ouverture du Sheet

  useEffect(() => {
    setCurrentPath(pathname);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      // Call the logout endpoint
      await api.get("/api/auth/logout");

      // Optionally, remove any session data (like clearing cookies or local storage)
      document.cookie =
        "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/admin;";
      document.cookie =
        "userID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/admin;";

      // Redirect to the login page or homepage
      router.push("/admin/login");
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  // Fonction pour fermer le Sheet
  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background px-4 md:px-8 2xl:px-16">
      {/* Menubar Navigation for Desktop */}
      <Menubar className="hidden w-fit gap-2 text-sm font-medium md:flex">
        <MenubarMenu>
          <MenubarTrigger asChild>
            <Link
              href="/admin/dashboard"
              className={`w-full cursor-pointer rounded transition-colors ${
                currentPath === "/admin/dashboard"
                  ? "bg-muted text-accent-foreground"
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
              currentPath === "/admin/produits/liste" ||
              currentPath === "/admin/produits/categories"
                ? "bg-muted text-accent-foreground"
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
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <SheetHeader className="mb-8 hidden text-left">
            <SheetTitle>Menu de navigation</SheetTitle>
            <SheetDescription>Pages du tableau de bord</SheetDescription>
          </SheetHeader>
          <nav className="grid gap-4 text-lg font-medium">
            <Link
              href="/admin/dashboard"
              className={`hover:text-foreground ${
                currentPath === "/admin/dashboard" ? "text-primary" : ""
              }`}
              onClick={closeMenu}
            >
              Dashboard
            </Link>
            <Separator />
            <Link
              href="/admin/produits"
              className={`hover:text-foreground ${
                currentPath === "/admin/produits" ? "text-primary" : ""
              }`}
              onClick={closeMenu}
            >
              Produits
            </Link>
            <div className="flex flex-col gap-2">
              <Link
                href="/admin/produits/liste"
                className={`text-base font-normal text-muted-foreground hover:text-foreground ${
                  currentPath === "/admin/produits/liste" ? "text-primary" : ""
                }`}
                onClick={closeMenu}
              >
                Liste des produits
              </Link>
              <Link
                href="/admin/produits/categories"
                className={`text-base font-normal text-muted-foreground hover:text-foreground ${
                  currentPath === "/admin/produits/categories"
                    ? "text-primary"
                    : ""
                }`}
                onClick={closeMenu}
              >
                Catégories
              </Link>
            </div>
            <Separator />
            <Link
              href="/admin/commandes"
              className={`hover:text-foreground ${
                currentPath === "/admin/commandes" ? "text-primary" : ""
              }`}
              onClick={closeMenu}
            >
              Commandes
            </Link>
            <Separator />
            <Link
              href="/admin/clients"
              className={`hover:text-foreground ${
                currentPath === "/admin/clients" ? "text-primary" : ""
              }`}
              onClick={closeMenu}
            >
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
            <DropdownMenuItem onClick={handleLogout}>
              Se déconnecter
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
