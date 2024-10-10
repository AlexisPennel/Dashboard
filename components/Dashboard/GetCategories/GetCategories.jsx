"use client";
import React, { useState, useEffect, useContext } from "react";
import api from "@/app/api";
import { AppContext } from "@/app/context/AppContext"; // Assurez-vous que ce chemin est correct
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil2Icon, TrashIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import Link from "next/link";

const GetCategories = () => {
  const { categories, setCategories, loadDatas } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null); // Store the category to delete

  useEffect(() => {
    if (categories === null) {
      console.log("fetch datas");
      loadDatas();
    } else if (categories !== null) {
      setIsLoading(false);
    }
  }, [categories]);

  // Handle delete category
  const handleDeleteCategory = async () => {
    try {
      await api.delete(`/api/category/${categoryToDelete._id}`);
      setCategories((prevCategories) =>
        prevCategories.filter(
          (category) => category._id !== categoryToDelete._id,
        ),
      );
      setDialogOpen(false);
      setCategoryToDelete(null); // Réinitialiser après la suppression
    } catch (error) {
      console.error("Erreur lors de la suppression de la catégorie", error);
      setDialogOpen(false);
    }
  };

  // Open confirmation dialog
  const confirmDeleteCategory = (category) => {
    setCategoryToDelete(category);
    setDialogOpen(true);
  };

  return (
    <Card className="w-full">
      <CardHeader className="p-6">
        <CardTitle className="text-xl font-medium tracking-tight">
          Catégories des produits
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          ""
        ) : (
          <ul className="flex flex-col gap-2">
            {categories.length === 0 && <p>Aucune catégorie disponible.</p>}
            {categories.map((category) => (
              <li
                key={category._id}
                className="flex items-center justify-between rounded border bg-gray-50 p-2 px-4"
              >
                <div className="flex items-center gap-2">
                  <Image
                    src={`http://localhost:3000${category.image}`}
                    width={200}
                    height={200}
                    alt={category.altDescription}
                    crossOrigin="anonymous"
                    className="h-12 w-12 rounded object-cover"
                  />
                  <div className="flex items-center gap-4">
                    <h3 className="text-lg font-medium">{category.name}</h3>
                    {category.productIds.length >= 0 && (
                      <p className="text-sm text-muted-foreground">
                        {category.productIds.length} Produit(s)
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button>
                    <Link
                      href={`/admin/produits/categories/${category._id}`}
                      className="flex w-fit items-center gap-1"
                    >
                      <Pencil2Icon className="mr-2 h-4 w-4" />
                      <p>Modifier</p>
                    </Link>
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => confirmDeleteCategory(category)}
                    className="h-fit w-fit"
                  >
                    <TrashIcon className="mr-2 h-4 w-4" /> Supprimer
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
    </Card>
  );
};

export default GetCategories;
