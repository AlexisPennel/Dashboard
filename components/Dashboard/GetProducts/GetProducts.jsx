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
import { AppContext } from "@/app/context/AppContext";
import { Button } from "@/components/ui/button";

const GetProducts = ({ limit, page }) => {
  const [loading, setLoading] = useState(true);
  const { products, categories, loadDatas } = useContext(AppContext);

  useEffect(() => {
    if (products === null && categories === null) {
      console.log("fetch datas");
      loadDatas();
    } else if (products !== null && categories !== null) {
      setLoading(false);
    }
  }, [products, categories]);

  const getCategorieName = (id) => {
    const categorie = categories.find((categorie) => categorie._id === id);
    if (categorie) {
      return categorie.name;
    } else {
      return "Aucune catégorie";
    }
  };

  if (loading) {
    return "";
  }

  if (products.length === 0) {
    return <p>Aucun produit trouvé</p>;
  }

  // Limiter le nombre de produits si `limit` est fourni
  const productsToDisplay = limit ? products.slice(0, limit) : products;

  return (
    <Card className="w-full">
      {page !== "list" && (
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="text-xl font-medium tracking-tight">
            Liste des produits
          </CardTitle>
          <CardDescription>
            Aperçu des produits. Cliquez sur voir plus pour afficher tous les
            produits
          </CardDescription>
        </CardHeader>
      )}
      <CardContent className="p-4 md:p-6">
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
          {productsToDisplay.map((product) => (
            <li key={product._id} className="w-fit">
              <Link
                href={`/admin/produits/liste/${product.slug}`}
                className="relative flex h-fit max-w-52 flex-col justify-between gap-2 rounded border bg-gray-50 p-2 transition hover:bg-gray-100"
              >
                <div className="flex flex-col gap-2">
                  <Image
                    src={`http://localhost:3000${product.images[0]}`}
                    width={200}
                    height={200}
                    alt={product.name}
                    crossOrigin="anonymous"
                    className="w-full rounded object-cover"
                  />
                  <div className="flex flex-col justify-between gap-2">
                    <h4 className="text-base font-semibold">{product.name}</h4>
                    <Badge
                      variant={
                        product.status === "online" ? "online" : "brouillon"
                      }
                      className="w-fit"
                    >
                      {product.status === "online" ? "En ligne" : "Brouillon"}
                    </Badge>
                    <p className="text-muted-foreground">
                      {getCategorieName(product.category)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {product.discount < 0 ? (
                    <>
                      <p className="text-lg font-semibold">
                        {calculateFinalPrice(product.price, product.discount)}€
                      </p>
                      <p className="text-sm text-muted-foreground line-through">
                        {product.price}€
                      </p>
                    </>
                  ) : (
                    <p className="text-lg font-semibold">{product.price}€</p>
                  )}
                  {product.discount < 0 && (
                    <p className="absolute left-4 top-4 rounded bg-primary px-2 py-1 text-sm text-white">
                      {product.discount}%
                    </p>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="gap-2 p-4 md:p-6">
        {page !== "list" && (
          <>
            <Button variant="outline">
              <Link href="/admin/produits/ajouter-produit">
                Ajouter un produit
              </Link>
            </Button>
            <Button>
              <Link href="/admin/produits/liste">Voir plus</Link>
            </Button>
          </>
        )}
        {page === "list" && (
          <Button>
            <Link href="/admin/produits/ajouter-produit">
              Ajouter un produit
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default GetProducts;
