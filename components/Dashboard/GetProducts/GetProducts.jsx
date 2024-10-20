"use client";
import React, { useContext, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { calculateFinalPrice } from "@/lib/calculatePrice";
import { ProductContext } from "@/app/context/ProductContext";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Pour les dropdowns
import { ArrowUpRight } from "lucide-react";

const GetProducts = ({ limit, page }) => {
  const [loading, setLoading] = useState(true);
  const { products, categories, loadDatas } = useContext(ProductContext);
  const [filter, setFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Charger les données si nécessaire
  useEffect(() => {
    if (products === null || categories === null) {
      loadDatas();
    } else {
      setLoading(false);
    }
  }, [products, categories]);

  // Fonction pour récupérer les noms des catégories
  const getCategoryNames = (ids) => {
    return ids
      .map((id) => {
        const category = categories.find((category) => category._id === id);
        return category ? category.name : null;
      })
      .filter(Boolean) // Retire les valeurs null
      .join(", "); // Joins les noms avec une virgule
  };

  // Application du filtre sur les produits
  const filteredProducts =
    products?.filter((product) => {
      // Filtrer par statut
      const statusFilterMatch = filter === "all" || product.status === filter;
      // Filtrer par catégorie
      const categoryFilterMatch =
        categoryFilter === "all" || product.category.includes(categoryFilter);

      return statusFilterMatch && categoryFilterMatch;
    }) || [];

  // Limiter le nombre de produits si `limit` est fourni
  const productsToDisplay = limit
    ? filteredProducts.slice(0, limit)
    : filteredProducts;

  // Gestion du chargement et des produits vides
  if (loading) {
    return null;
  }

  return (
    <Card className="w-full">
      {/* Header de la carte, optionnel en fonction de la page */}
      {page !== "list" && (
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="font-medium">Liste des produits</CardTitle>
          <CardDescription>
            Aperçu des 5 derniers produits. Cliquez sur &quot;voir plus&quot;
            pour afficher tous les produits.
          </CardDescription>
        </CardHeader>
      )}

      {/* Contenu de la carte */}
      <CardContent className="flex flex-col gap-4 p-4 lg:p-6">
        {/* Sélecteurs de filtre */}
        <div className="grid max-w-md grid-cols-2 gap-2">
          <div className="flex flex-col gap-2">
            <label className="ml-1 block text-sm font-medium text-muted-foreground">
              Filtrer par statut
            </label>
            <Select
              onValueChange={(value) => setFilter(value)}
              defaultValue="all"
            >
              <SelectTrigger>
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent className="w-fit">
                <SelectItem value="all" className="cursor-pointer">
                  Tous produits
                </SelectItem>
                <SelectItem value="online" className="cursor-pointer">
                  En ligne
                </SelectItem>
                <SelectItem value="draft" className="cursor-pointer">
                  Brouillon
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="ml-1 block text-sm font-medium text-muted-foreground">
              Filtrer par Catégorie
            </label>
            <Select
              onValueChange={(value) => setCategoryFilter(value)}
              defaultValue="all"
            >
              <SelectTrigger>
                <SelectValue placeholder="Filtrer par catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="cursor-pointer">
                  Toutes catégories
                </SelectItem>
                {categories.map((category) => (
                  <SelectItem
                    key={category._id}
                    value={category._id}
                    className="cursor-pointer"
                  >
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tableau des produits */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Catégorie(s)</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="hidden lg:visible">Prix</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {productsToDisplay.map((product) => (
              <TableRow
                key={product._id}
                className="cursor-pointer"
                onClick={() =>
                  (window.location.href = `/admin/produits/liste/${product.slug}`)
                }
              >
                <TableCell>
                  <Image
                    src={`http://localhost:3000${product.images[0]}`}
                    width={80}
                    height={80}
                    alt={product.name}
                    className="h-10 w-10 rounded object-cover lg:h-14 lg:w-14"
                  />
                </TableCell>
                <TableCell>
                  <span className="text-xs font-medium">{product.name}</span>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {getCategoryNames(product.category)}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      product.status === "online" ? "online" : "brouillon"
                    }
                    className="w-fit whitespace-nowrap"
                  >
                    {product.status === "online" ? "En ligne" : "Brouillon"}
                  </Badge>
                </TableCell>
                <TableCell className="hidden lg:visible">
                  {product.discount < 0 ? (
                    <div className="flex gap-1">
                      <span className="font-semibold">
                        {calculateFinalPrice(product.price, product.discount)}€
                      </span>
                      <span className="text-sm text-muted-foreground line-through">
                        {product.price}€
                      </span>
                    </div>
                  ) : (
                    <span className="font-semibold">{product.price}€</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {products.length > 4 && page !== "list" && (
          <span className="text-sm font-medium text-primary md:text-base">
            +{products.length - 4} produit(s)
          </span>
        )}
      </CardContent>

      {/* Footer de la carte */}
      <CardFooter className="gap-2 p-4 md:p-6">
        {page !== "list" && (
          <>
            <Button variant="secondary">
              <Link
                href="/admin/produits/liste/ajouter-produit"
                className="flex items-center gap-1"
              >
                Ajouter un produit
              </Link>
            </Button>
            <Button>
              <Link
                href="/admin/produits/liste"
                className="flex items-center gap-1 font-normal"
              >
                Voir plus
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </>
        )}
        {page === "list" && (
          <Button>
            <Link href="/admin/produits/liste/ajouter-produit">
              Ajouter un produit
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default GetProducts;
