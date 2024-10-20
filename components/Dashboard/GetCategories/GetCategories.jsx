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
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Pencil2Icon, TrashIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import Link from "next/link";
import { CategoriesContext } from "@/app/context/CategoriesProvider";
import Loader from "../../Loader/Loader";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
    <Card className="w-full max-w-3xl">
      <CardHeader className="p-4 md:p-6">
        <CardTitle className="font-medium tracking-tight">
          Catégories des produits
        </CardTitle>
        <CardDescription>
          Vos catégories de produits. Modifier ou supprimer vos catégories.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 md:p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Produits</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="min-w-xl">
            {categories.length === 0 && (
              <TableRow>
                <TableCell colSpan={4}>Aucune catégorie disponible.</TableCell>
              </TableRow>
            )}
            {categories.map((category) => (
              <TableRow
                key={category._id}
                className="cursor-pointer"
                onClick={() =>
                  (window.location.href = `/admin/produits/categories/${category._id}`)
                }
              >
                <TableCell className="w-24">
                  <Image
                    src={`http://localhost:3000${category.image}`}
                    width={80}
                    height={80}
                    alt={category.altDescription}
                    className="h-12 w-12 rounded object-cover lg:h-14 lg:w-14"
                  />
                </TableCell>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell className="text-muted-foreground">
                  {category.description}
                </TableCell>
                <TableCell className="justify-center text-muted-foreground">
                  x{category.productIds.length}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button>
                      <Link
                        href={`/admin/produits/categories/${category._id}`}
                        className="flex w-fit items-center gap-1"
                        onClick={(e) => e.stopPropagation()} // Prevent redirect on button click
                      >
                        <Pencil2Icon className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent redirect on delete click
                        confirmDeleteCategory(category);
                      }}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

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
