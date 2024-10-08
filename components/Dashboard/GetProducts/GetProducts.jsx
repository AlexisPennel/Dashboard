"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import api from "@/app/api"; // Remplace cela par ton API
import Image from "next/image";
import Link from "next/link";

const GetProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fonction pour récupérer les produits depuis l'API
    const fetchProducts = async () => {
      try {
        const response = await api.get("api/product"); // URL à remplacer par ton endpoint
        setProducts(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des produits :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    console.log(products);
  }, [products]);

  if (loading) {
    return <p>Chargement...</p>;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Tous les produits
        </CardTitle>
        <CardDescription>Liste des produits de la boutique</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col gap-4">
          {products.map((product) => (
            <li key={product._id}>
              <Link
                href={`/admin/produits/${product.slug}`}
                className="flex h-fit w-auto justify-between rounded p-2 hover:bg-gray-100"
              >
                <div className="flex gap-2">
                  <Image
                    src={`http://localhost:3000${product.images[0]}`}
                    width={200}
                    height={200}
                    alt="monstera"
                    crossOrigin="anonymous"
                    className="h-12 w-12 rounded"
                  />
                  <div className="flex flex-col justify-between">
                    <h4 className="text-base font-semibold">{product.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {product.price}€
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-center justify-between">
                  <Badge
                    variant={
                      product.status === "online" ? "online" : "brouillon"
                    }
                  >
                    {product.status === "online" ? "En ligne" : "Brouillon"}
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    {product.sales} ventes
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default GetProducts;
