"use client";
import api from "@/app/api";
import { CategoriesContext } from "@/app/context/CategoriesProvider";
import Loader from "@/components/Loader/Loader";
import { Badge } from "@/components/ui/badge";
import { calculateFinalPrice } from "@/lib/calculatePrice";
import Image from "next/image";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";

const BestProducts = () => {
  const { categories, fetchCategories } = useContext(CategoriesContext);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await api.get(
          `/api/category/populateCategory/vedette`,
        );
        setCategory(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    if (category.length === 0 || categories === null) {
      fetch();
      fetchCategories();
    }
  }, [category, categories]);

  const getCategoryNames = (categoryIds) => {
    if (!Array.isArray(categoryIds) || categoryIds.length === 0) {
      return "aucune-categorie";
    }

    // Liste des catégories prioritaires (en minuscules pour comparaison)
    const priorityCategories = ["plantes", "cactus"];

    const categoryNames = categoryIds.map((id) => {
      const category = categories.find((category) => category._id === id);
      return category ? category.name : null;
    });

    // Trouver la première occurrence de "plantes" ou "cactus", en ignorant la casse
    const matchedCategory = categoryNames.find((name) =>
      priorityCategories.includes(name?.toLowerCase()),
    );

    return matchedCategory ? matchedCategory.toLowerCase() : "aucune-categorie"; // Retourne en minuscule pour l'URL ou 'aucune-categorie'
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <ul className="grid w-fit grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
      {category.productIds
        .filter((product) => product.status === "online")
        .map((product, index) => (
          <li
            key={product._id}
            className="relative flex max-w-[164px] flex-col gap-2"
          >
            <Link
              href={`/produits/${getCategoryNames(product.category)}/${product.slug}`}
              className="transition hover:scale-[0.98]"
            >
              <div className="relative">
                <Image
                  src={`http://localhost:3000${product.images[0]}`}
                  alt={product.altDescriptions[0]}
                  width={1920}
                  height={1080}
                  className="h-[196px] w-full max-w-[164px] rounded bg-muted-foreground object-cover"
                  priority
                />
                {product.discount !== 0 && (
                  <Badge className="absolute bottom-2 left-2 w-fit">
                    Promotion
                  </Badge>
                )}
              </div>
              <div className="flex flex-col gap-0">
                <h3 className="max-w-[164px] text-base font-medium">
                  {product.name}
                </h3>
                {product.discount !== 0 ? (
                  <p className="text-base font-medium">
                    {calculateFinalPrice(product.price, product.discount)}€
                    <span className="ml-2 font-light line-through">
                      {product.price}€
                    </span>
                  </p>
                ) : (
                  <p className="text-base font-normal">{product.price}€</p>
                )}
              </div>
            </Link>
          </li>
        ))}
    </ul>
  );
};

export default BestProducts;
