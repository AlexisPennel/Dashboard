"use client";
import React, { useState, useEffect, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@radix-ui/react-dropdown-menu";
import { ReloadIcon } from "@radix-ui/react-icons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { ProductContext } from "@/app/context/ProductContext";
import Loader from "@/components/Loader/Loader";
import { checkAddProduct } from "@/lib/CheckAddProduct";

const AddProduct = () => {
  const { products, categories, loadDatas, addProduct } =
    useContext(ProductContext);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState(0);
  const [status, setStatus] = useState("");
  const [description, setDescription] = useState("");
  const [tips, setTips] = useState({
    expoContent: "",
    arrosageContent: "",
    humidityContent: "",
  });
  const [categoriesSelected, setCategoriesSelected] = useState([]);
  const [metadata, setMetadata] = useState({
    title: "",
    description: "",
  });
  const [altDescriptions, setAltDescriptions] = useState([]);
  const [images, setImages] = useState([]);
  const [loadingDatas, setLoadingDatas] = useState(true);
  const [formErrorMessage, setFormErrorMessage] = useState([]);

  useEffect(() => {
    if (categories === null) {
      loadDatas();
    } else {
      if (categories !== null && products !== null) {
        setLoadingDatas(false);
      }
    }
  }, [categories]);

  const handleImagesChange = (e) => {
    setImages([...e.target.files]);
    setAltDescriptions(Array.from(e.target.files).map(() => ""));
  };

  const handleAltDescriptionsChange = (index, value) => {
    const updatedAltDescriptions = [...altDescriptions];
    updatedAltDescriptions[index] = value;
    setAltDescriptions(updatedAltDescriptions);
  };

  const handleMetadataChange = (field, value) => {
    setMetadata((prev) => ({ ...prev, [field]: value }));
  };

  const handleCategoryChange = (categoryId) => {
    setCategoriesSelected((prevSelected) => {
      if (prevSelected.includes(categoryId)) {
        return prevSelected.filter((id) => id !== categoryId);
      } else {
        return [...prevSelected, categoryId];
      }
    });
  };

  const handleTipsChange = (name, value) => {
    setTips((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    setIsLoading(true);
    e.preventDefault();

    const data = new FormData();
    data.append("name", name);
    data.append("price", price);
    data.append("discount", discount);
    data.append("status", status);
    data.append("description", description);
    data.append("tips", JSON.stringify(tips));
    data.append("metaTitle", metadata.title);
    data.append("metaDescription", metadata.description);

    // Ajouter chaque catégorie individuellement
    categoriesSelected.forEach((category) => {
      data.append("category", category);
    });

    // Ajout des images
    for (let i = 0; i < images.length; i++) {
      data.append("images", images[i]);
    }

    // Ajoutez altDescriptions une seule fois après les images
    data.append("altDescriptions", JSON.stringify(altDescriptions));

    if (checkAddProduct(data).length > 0) {
      setFormErrorMessage(checkAddProduct(data));
      setIsLoading(false);
      return;
    }

    console.log(tips);

    try {
      addProduct(data, category);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateFinalPrice = () => {
    if (!price || !discount) return price;
    const discountValue = (price * Math.abs(discount)) / 100;
    return discount < 0 ? price - discountValue : price;
  };

  if (loadingDatas) {
    return <Loader />;
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Nom du produit */}
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
          </div>
          {/* Catégories du produit */}
          <div className="grid gap-2">
            <Label className="text-sm font-medium" id="category">
              Catégories du produit
            </Label>
            {categories.map((cat) => (
              <div key={cat._id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`category-${cat._id}`}
                  value={cat._id}
                  onChange={() => handleCategoryChange(cat._id)}
                  checked={categoriesSelected.includes(cat._id)}
                  className="mr-2"
                />
                <Label htmlFor={`category-${cat._id}`}>{cat.name}</Label>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Prix du produit */}
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

            {/* Réduction en pourcentage */}
            <div className="grid gap-2">
              <Label htmlFor="discount" className="text-sm font-medium">
                Réduction (en %)
              </Label>
              <Input
                id="discount"
                type="number"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                placeholder="Ex: -20"
                min={-100}
                max={0}
                required
              />
            </div>

            {/* Affichage du prix final */}
            <div className="grid gap-2">
              <Label htmlFor="finalPrice" className="text-sm font-medium">
                Prix final
              </Label>
              <Input
                id="finalPrice"
                type="text"
                value={calculateFinalPrice() || price}
                disabled
              />
            </div>
          </div>

          {/* Description du produit */}
          <div className="grid gap-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description du produit
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez le produit..."
              required
            />
          </div>

          {/* Conseils du produit */}
          <div className="grid gap-2">
            <p className="text-base font-medium">Conseils d&apos;entretien</p>
            <Label htmlFor="exposition" className="text-sm font-medium">
              Exposition
            </Label>
            <Textarea
              id="exposition"
              value={tips.expoContent}
              onChange={(e) => {
                handleTipsChange("expoContent", e.target.value);
              }}
              required
            />
            <Label htmlFor="arrosage" className="text-sm font-medium">
              Arrosage
            </Label>
            <Textarea
              id="arrosage"
              value={tips.arrosageContent}
              onChange={(e) => {
                handleTipsChange("arrosageContent", e.target.value);
              }}
              required
            />
            <Label htmlFor="humidity" className="text-sm font-medium">
              Humidité
            </Label>
            <Textarea
              id="humidity"
              value={tips.humidityContent}
              onChange={(e) => {
                handleTipsChange("humidityContent", e.target.value);
              }}
              required
            />
          </div>

          {/* Meta Title */}
          <div className="grid gap-2">
            <Label htmlFor="metaTitle" className="text-sm font-medium">
              Meta Title
            </Label>
            <Input
              id="metaTitle"
              type="text"
              value={metadata.title}
              onChange={(e) => handleMetadataChange("title", e.target.value)}
              placeholder="Titre pour le SEO"
            />
          </div>

          {/* Meta Description */}
          <div className="grid gap-2">
            <Label htmlFor="metaDescription" className="text-sm font-medium">
              Meta Description
            </Label>
            <Textarea
              id="metaDescription"
              value={metadata.description}
              onChange={(e) =>
                handleMetadataChange("description", e.target.value)
              }
              placeholder="Description pour le SEO"
            />
          </div>

          {/* Images du produit */}
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

          {/* Prévisualisation des images */}
          {images.length > 0 && (
            <div className="mt-4 grid gap-4">
              <h4 className="text-sm font-medium">Aperçu des images :</h4>
              <div className="flex gap-2 overflow-x-auto">
                {Array.from(images).map((image, index) => (
                  <Image
                    key={index}
                    src={URL.createObjectURL(image)}
                    width={100}
                    height={100}
                    alt={`Aperçu de ${name} - Image ${index + 1}`}
                    className="h-24 w-24 rounded object-cover"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Descriptions alternatives pour les images */}
          {images.length > 0 &&
            images.map((_, index) => (
              <div key={index} className="grid gap-2">
                <Label
                  htmlFor={`altDescription${index}`}
                  className="text-sm font-medium"
                >
                  Description alternative pour l&apos;image {index + 1}
                </Label>
                <Input
                  id={`altDescription${index}`}
                  type="text"
                  value={altDescriptions[index] || ""}
                  onChange={(e) =>
                    handleAltDescriptionsChange(index, e.target.value)
                  }
                  placeholder="Description alternative (SEO)"
                />
              </div>
            ))}

          {/* Statut du produit */}
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
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <Button disabled>
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              Envoi en cours
            </Button>
          ) : (
            <Button type="submit" className="w-full">
              Ajouter le produit
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

export default AddProduct;
