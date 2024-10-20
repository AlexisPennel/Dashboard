"use client";
import React, { useState, useEffect, useContext } from "react";
import { usePathname } from "next/navigation"; // Utilisé pour obtenir l'ID de l'URL
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Input } from "@/components/ui/input";
import { CategoriesContext } from "@/app/context/CategoriesProvider";
import Loader from "@/components/Loader/Loader";
import { checkAddCategory } from "@/lib/CheckAddCategory";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";

const UpdateCategory = () => {
  const pathname = usePathname();
  const categoryId = pathname.split("/").pop(); // Récupère l'ID de la catégorie depuis l'URL
  const { categories, fetchCategories, updateCategory } =
    useContext(CategoriesContext);
  const [category, setCategory] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryImage, setCategoryImage] = useState([]);
  const [categoryAlt, setCategoryAlt] = useState("");
  const [loadingDatas, setLoadingDatas] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formErrorMessage, setFormErrorMessage] = useState([]);

  useEffect(() => {
    if (categories && categories.length > 0) {
      const foundCategory = categories.find((cat) => cat._id === categoryId);
      if (foundCategory) {
        setCategory(foundCategory);
        setCategoryName(foundCategory.name);
        setDescription(foundCategory.description);
        setCategoryAlt(foundCategory.altDescription);
        setLoadingDatas(false);
      } else {
        fetchCategories();
      }
    } else {
      fetchCategories();
    }
  }, [categoryId, categories]);

  const handleImageChange = (e) => {
    setCategoryAlt("");
    setCategoryImage([...e.target.files]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormErrorMessage([]);
    setIsLoading(true);

    // Création d'un FormData pour l'envoi des données (multipart)
    const formData = new FormData();
    formData.append("_id", category._id);
    formData.append("name", categoryName);
    formData.append("description", description);
    formData.append("altDescription", categoryAlt); // Ajoute la description alt

    if (categoryImage) {
      for (let i = 0; i < categoryImage.length; i++) {
        formData.append("images", categoryImage[i]);
      }
    }

    if (checkAddCategory(formData).length > 0) {
      setFormErrorMessage(checkAddCategory(formData));
      setIsLoading(false);
      return;
    }

    try {
      updateCategory(formData);
    } catch (error) {
      console.log(error);
      setFormErrorMessage(["Erreur lors de l'envoi du formulaire"]);
    } finally {
      setIsLoading(false);
      setCategoryName("");
      setCategoryImage(null);
      setCategoryAlt("");
    }
  };

  if (loadingDatas) {
    return <Loader />;
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="p-6">
        <CardTitle className="text-xl font-medium tracking-tight">
          Modifier la catégorie
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
              value={categoryName || ""}
              onChange={(e) => setCategoryName(e.target.value)}
              required
            />
          </div>

          {/* Description de la catégorie */}
          <div className="grid gap-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description de la catégorie
            </Label>
            <Textarea
              id="description"
              value={description}
              required
              onChange={(e) => {
                setDescription(e.target.value);
              }}
            />
          </div>

          {/* Upload de l'image */}
          <div className="grid gap-2">
            <Label htmlFor="categoryImage" className="text-sm font-medium">
              Image de la catégorie
              <br />
              <span className="text-sm font-normal text-muted-foreground">
                *Modification optionnelle
              </span>
            </Label>
            {categoryImage?.length > 0 ? (
              <div className="flex gap-2 overflow-x-auto">
                {Array.from(categoryImage).map((image, index) => (
                  <Image
                    key={index}
                    src={URL.createObjectURL(image)}
                    width={100}
                    height={100}
                    alt={`Aperçu de ${name} - Image ${index + 1}`}
                    className="h-14 w-14 rounded object-cover"
                  />
                ))}
              </div>
            ) : (
              <Image
                src={`http://localhost:3000${category.image}`}
                alt={`${categoryAlt}`}
                width={200}
                height={200}
                className="h-14 w-14 rounded-md object-cover shadow"
              />
            )}
            <Input
              id="categoryImage"
              type="file"
              onChange={handleImageChange}
              accept="image/*"
            />
          </div>

          {/* Champ pour la description alt */}
          <div className="grid gap-2">
            <Label htmlFor="altDescription" className="text-sm font-medium">
              Description alt de l&apos;image
            </Label>
            <Input
              id="altDescription"
              type="text"
              value={categoryAlt || ""}
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
      <CardFooter>
        {formErrorMessage.length >= 1 && (
          <ul>
            {formErrorMessage.map((error, index) => (
              <li key={index} className="font-semibold text-red-600">
                {error}
              </li>
            ))}
          </ul>
        )}
      </CardFooter>
    </Card>
  );
};

export default UpdateCategory;
