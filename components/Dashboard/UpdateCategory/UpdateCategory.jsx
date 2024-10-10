"use client";
import React, { useState, useEffect, useContext } from "react";
import { usePathname, useRouter } from "next/navigation"; // Utilisé pour obtenir l'ID de l'URL
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Input } from "@/components/ui/input";
import api from "@/app/api";
import { AppContext } from "@/app/context/AppContext";

const UpdateCategory = () => {
  const router = useRouter();
  const pathname = usePathname();
  const categoryId = pathname.split("/").pop(); // Récupère l'ID de la catégorie depuis l'URL
  const { categories, setCategories, loadDatas } = useContext(AppContext);
  const [category, setCategory] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [categoryImage, setCategoryImage] = useState(null); // Nouvelle image
  const [categoryAlt, setCategoryAlt] = useState(""); // État pour la description alt
  const [isLoading, setIsLoading] = useState(false);

  // Vérifier que les catégories sont chargées avant de les utiliser
  useEffect(() => {
    if (categories && categories.length > 0) {
      const foundCategory = categories.find((cat) => cat._id === categoryId);
      if (foundCategory) {
        setCategory(foundCategory);
        setCategoryName(foundCategory.name);
        setCategoryAlt(foundCategory.alt); // Récupérer la description alt
      } else {
        // Si la catégorie n'est pas dans le contexte, on fait un appel API
        loadDatas();
      }
    } else {
      loadDatas();
    }
  }, [categoryId, categories]);

  const handleImageChange = (e) => {
    setCategoryImage(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Création d'un FormData pour l'envoi des données (multipart)
    const formData = new FormData();
    formData.append("name", categoryName);
    formData.append("altDescription", categoryAlt); // Ajoute la description alt
    if (categoryImage) {
      formData.append("image", categoryImage); // Ajoute la nouvelle image si modifiée
    }

    api
      .put(`/api/category/${categoryId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        setIsLoading(false);
        // Met à jour la catégorie dans le contexte
        setCategories((prevCategories) =>
          prevCategories.map((cat) =>
            cat._id === categoryId ? res.data : cat,
          ),
        );
        console.log(categories);
        router.push("/admin/produits/categories");
      })
      .catch((error) => {
        setIsLoading(false);
        console.log(error);
      });
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="p-6">
        <CardTitle className="text-xl font-medium tracking-tight">
          Modifier la catégorie;
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Nom de la catégorie */}
          <div className="grid gap-2">
            <Label htmlFor="categoryName" className="text-sm font-medium">
              Nom de la catégorie
            </Label>
            <Input
              id="categoryName"
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              required
            />
          </div>

          {/* Upload de l'image */}
          <div className="grid gap-2">
            <Label htmlFor="categoryImage" className="text-sm font-medium">
              Image de la catégorie
            </Label>
            <Input
              id="categoryImage"
              type="file"
              onChange={handleImageChange}
              accept="image/*"
              required
            />
          </div>

          {/* Champ pour la description alt */}
          <div className="grid gap-2">
            <Label htmlFor="categoryAlt" className="text-sm font-medium">
              Description alt de l&apos;image
            </Label>
            <Input
              id="categoryAlt"
              type="text"
              value={categoryAlt}
              onChange={(e) => setCategoryAlt(e.target.value)}
              required
            />
          </div>

          {isLoading ? (
            <Button disabled>Envoi en cours...</Button>
          ) : (
            <Button type="submit" className="w-full">
              Modifier la catégorie
            </Button>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default UpdateCategory;
