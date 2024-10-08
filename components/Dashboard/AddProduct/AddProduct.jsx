"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-dropdown-menu";
import { ReloadIcon } from "@radix-ui/react-icons";
import api from "@/app/api";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AddProduct = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [images, setImages] = useState([]);

  const handleImagesChange = (e) => {
    setImages([...e.target.files]); // Stocke les fichiers sélectionnés
  };

  const handleSubmit = (e) => {
    setIsLoading(true);
    e.preventDefault();

    const data = new FormData();
    data.append("name", name);
    data.append("price", price);
    data.append("status", status);

    // Ajoute chaque image à l'objet FormData
    for (let i = 0; i < images.length; i++) {
      data.append("images", images[i]); // Utilise la clé "images" pour le multer
    }

    api
      .post("api/product", data) // Envoie le FormData
      .then((res) => {
        console.log(res);
        setName("");
        setPrice("");
        setStatus("");
        setImages([]); // Réinitialise le tableau d'images
        setIsLoading(false);
        setIsSuccess(true);
        window.location.reload(); // Recharge la page pour voir le produit ajouté
      })
      .catch((error) => {
        setIsLoading(false);
        console.log(error);
      });
  };

  return (
    <Card className="h-fit w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-xl">Ajouter un produit</CardTitle>
        <CardDescription>Entrez les informations du produit</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Nom du produit
            </Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="price" className="text-sm font-medium">
              Prix du produit
            </Label>
            <Input
              id="price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="images" className="text-sm font-medium">
              Photos du produit
            </Label>
            <Input
              id="images"
              type="file"
              multiple
              onChange={handleImagesChange}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="status" className="text-sm font-medium">
              Statut du produit
            </Label>
            <Select onValueChange={(value) => setStatus(value)}>
              <SelectTrigger id="status" aria-label="Selection du statut">
                <SelectValue placeholder="Statut du produit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Brouillon</SelectItem>
                <SelectItem value="online">En ligne</SelectItem>
                <SelectItem value="archived">Archivé</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {isLoading ? (
            <Button disabled>
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              Envoi en cours
            </Button>
          ) : (
            <Button type="submit" className="w-full" variant="">
              Ajouter le produit
            </Button>
          )}
        </form>
      </CardContent>
      <CardFooter>{isSuccess && <p>Produit ajouté !</p>}</CardFooter>
    </Card>
  );
};

export default AddProduct;
