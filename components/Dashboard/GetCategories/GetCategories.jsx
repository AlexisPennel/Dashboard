/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useState, useEffect, useContext } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Pencil2Icon, TrashIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import Link from "next/link";
import { CategoriesContext } from "@/app/context/CategoriesProvider";
import Loader from "../../Loader/Loader";

const GetCategories = ({ page }) => {
  const { categories, fetchCategories, deleteCategory } =
    useContext(CategoriesContext);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null); // Store the category to delete

  useEffect(() => {
    if (categories === null) {
      fetchCategories();
    } else if (categories !== null) {
      setIsLoading(false);
    }
  }, [categories]);

  const handleDeleteCategory = () => {
    if (categoryToDelete) {
      deleteCategory(categoryToDelete._id);
      setDialogOpen(false);
      setCategoryToDelete(null);
    }
  };

  // Open confirmation dialog
  const confirmDeleteCategory = (category) => {
    setCategoryToDelete(category);
    setDialogOpen(true);
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader className="p-4 md:p-6">
        <CardTitle className="font-medium tracking-tight">
          Catégories des produits
          <br />
          {categories.length >= 0 && (
            <span className="text-base text-primary">
              {categories.length} catégorie(s)
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 md:p-6">
        {isLoading ? (
          ""
        ) : (
          <ul className="flex flex-col gap-2">
            {categories.length === 0 && <p>Aucune catégorie disponible.</p>}
            {categories.map((category) => (
              <li
                key={category._id}
                className="flex justify-between gap-2 rounded border bg-gray-50 p-2 px-2"
              >
                <div className="flex gap-2">
                  <Image
                    src={`http://localhost:3000${category.image}`}
                    width={200}
                    height={200}
                    alt={category.altDescription}
                    crossOrigin="anonymous"
                    className="h-20 w-14 rounded object-cover lg:h-36 lg:w-24"
                  />
                  <div className="flex h-full flex-col">
                    <h3 className="font-medium">{category.name}</h3>
                    {category.productIds.length >= 0 && (
                      <p className="text-muted-foreground">
                        {category.productIds.length} Produit(s)
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button size="sm">
                    <Link
                      href={`/admin/produits/categories/${category._id}`}
                      className="flex w-fit items-center gap-1"
                    >
                      <Pencil2Icon className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => confirmDeleteCategory(category)}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {dialogOpen && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Suppression de la catégorie</DialogTitle>
                <DialogDescription>
                  Supprimer la catégorie {categoryToDelete?.name}
                </DialogDescription>
              </DialogHeader>
              <p>
                Voulez-vous vraiment supprimer la catégorie &quot;
                {categoryToDelete?.name}&quot; ?
              </p>
              <DialogFooter>
                <Button
                  onClick={() => setDialogOpen(false)}
                  variant="secondary"
                >
                  Annuler
                </Button>
                <Button onClick={handleDeleteCategory} variant="destructive">
                  Confirmer
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
      {page === "dashboard" && (
        <CardFooter className="p-4 md:p-6">
          <Button>
            <Link href="/admin/produits/categories">Ajouter une catégorie</Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default GetCategories;
