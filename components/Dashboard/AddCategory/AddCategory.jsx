"use client";
import React, { useState, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Input } from "@/components/ui/input";
import api from "@/app/api";
import { AppContext } from "@/app/context/AppContext";

const AddCategory = () => {
  const { categories, setCategories } = useContext(AppContext);
  const [categoryName, setCategoryName] = useState("");
  const [categoryImage, setCategoryImage] = useState(null); // Nouvel état pour l'image
  const [altDescription, setAltDescription] = useState(""); // Nouvel état pour la description alt
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (e) => {
    setCategoryImage(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Création d'un FormData pour envoyer les données sous la forme multipart
    const formData = new FormData();
    formData.append("name", categoryName);
    if (categoryImage) {
      formData.append("image", categoryImage);
      formData.append("altDescription", altDescription); // Ajout de la description alt
    }

    api
      .post("/api/category", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        setCategoryName("");
        setCategoryImage(null); // Réinitialise l'image
        setAltDescription(""); // Réinitialise la description alt
        setIsLoading(false);
        setCategories((prevCategories) => [...prevCategories, res.data]);
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
          Ajouter une catégorie
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
              Ajouter la catégorie
            </Button>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default AddCategory;
