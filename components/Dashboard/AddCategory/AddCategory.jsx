"use client";
import React, { useState, useContext } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Input } from "@/components/ui/input";
import { CategoriesContext } from "@/app/context/CategoriesProvider";
import { checkAddCategory } from "@/lib/CheckAddCategory";
import { Textarea } from "@/components/ui/textarea";

const AddCategory = () => {
  const { addCategory } = useContext(CategoriesContext);
  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryImage, setCategoryImage] = useState([]);
  const [altDescription, setAltDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formErrorMessage, setFormErrorMessage] = useState([]);

  const handleImageChange = (e) => {
    setCategoryImage([...e.target.files]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setFormErrorMessage([]);

    // Création d'un FormData pour envoyer les données sous la forme multipart
    const formData = new FormData();
    formData.append("name", categoryName);
    formData.append("description", description);

    // Ajout des images
    for (let i = 0; i < categoryImage.length; i++) {
      formData.append("images", categoryImage[i]);
    }

    formData.append("altDescription", altDescription);

    if (checkAddCategory(formData).length > 0) {
      setFormErrorMessage(checkAddCategory(formData));
      console.log(checkAddCategory(formData));
      setIsLoading(false);
      return;
    }

    try {
      addCategory(formData);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      setCategoryName("");
      setCategoryImage(null);
      setAltDescription("");
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="p-4 md:p-6">
        <CardTitle className="font-medium tracking-tight">
          Créer une catégorie
        </CardTitle>
        <CardDescription>
          Remplissez le formulaire ci-dessous pour créer une catégorie. Tous les
          champs sont obligatoires.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 md:p-6">
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
              className=""
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
            </Label>
            <Input
              id="categoryImage"
              type="file"
              onChange={handleImageChange}
            />
          </div>

          {/* Description alt de l'image */}
          <div className="grid gap-2">
            <Label htmlFor="altDescription" className="text-sm font-medium">
              Description alternative de l&apos;image
            </Label>
            <Input
              id="altDescription"
              type="text"
              value={altDescription}
              onChange={(e) => setAltDescription(e.target.value)}
              placeholder="Décrivez brièvement l'image"
            />
          </div>

          {isLoading ? (
            <Button disabled>Envoi en cours...</Button>
          ) : (
            <Button type="submit" className="w-full">
              Créer la catégorie
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

export default AddCategory;
