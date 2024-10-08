"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import api from "@/app/api";
import Image from "next/image";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckIcon, CopyIcon, Pencil2Icon } from "@radix-ui/react-icons";
import { Car } from "lucide-react";

const ProductPage = () => {
  const pathname = usePathname();
  const slug = pathname.split("/").pop(); // Extraire le slug de l'URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCopy, setIsCopy] = useState(false);

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url);
    setIsCopy(true);
    setTimeout(() => {
      setIsCopy(false);
    }, 2000);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/api/product/${slug}`); // Utiliser le slug pour faire l'appel à l'API
        setProduct(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération du produit :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg font-semibold">Chargement...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg font-semibold">Produit non trouvé.</p>
      </div>
    );
  }

  return (
    <main className="flex flex-col gap-4 p-8">
      <header className="flex w-full items-center justify-between">
        {/* Title + slug */}
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold">{product.name}</h1>
        </div>
        {/* button */}
        <div className="flex gap-2">
          <Button className="flex gap-1">
            <Pencil2Icon />
            Modifier
          </Button>
          <Button variant="destructive">Supprimer</Button>
        </div>
      </header>
      {/* Statut + prix + ventes + CA */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Statut */}
        <Card className="w-full">
          <CardHeader className="p-6 pb-2">
            <CardTitle className="text-xl font-medium tracking-tight">
              Statut du produit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge
              variant={
                product.status === "online"
                  ? "online"
                  : product.status === "draft"
                    ? "brouillon"
                    : "destructive"
              }
              className="w-fit"
            >
              {product.status === "online"
                ? "En ligne"
                : product.status === "draft"
                  ? "Brouillon"
                  : "Archivé"}
            </Badge>
          </CardContent>
        </Card>
        {/* Prix */}
        <Card className="w-full">
          <CardHeader className="p-6 pb-2">
            <CardTitle className="text-xl font-medium tracking-tight">
              Prix du produit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl text-muted-foreground">{product.price}€</p>
          </CardContent>
        </Card>
        {/* ventes */}
        <Card className="w-full">
          <CardHeader className="p-6 pb-2">
            <CardTitle className="text-xl font-medium tracking-tight">
              Nombre de ventes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* product.stats.sells */}
            <p className="text-xl text-muted-foreground">23 ventes</p>
          </CardContent>
        </Card>
        {/* Chiffre d'affaires du produit */}
        <Card className="w-full">
          <CardHeader className="p-6 pb-2">
            <CardTitle className="text-xl font-medium tracking-tight">
              Chiffre d&apos;affaires
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* product.stats.ca */}
            <p className="text-xl text-muted-foreground">136€</p>
          </CardContent>
        </Card>
      </div>

      {/* Description + Photos */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2">
        {/* Photos */}
        <Card className="w-full max-w-4xl">
          <CardHeader className="p-6">
            <CardTitle className="text-xl font-medium tracking-tight">
              {" "}
              Photos du produit
            </CardTitle>
            <CardDescription>
              Photos du produit et descriptions pour les personnes malvoyantes
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <div className="flex w-full flex-col gap-4">
              {product.images && product.images.length > 1 && (
                <ul className="flex flex-col gap-4">
                  {product.images.map((image, index) => (
                    <li key={index} className="flex w-full gap-4">
                      <Image
                        src={`http://localhost:3000${image}`}
                        alt={`${product.name} - ${index + 1}`}
                        width={200}
                        height={200}
                        className="h-auto w-20 rounded-md object-cover shadow"
                      />
                      <div className="flex flex-col gap-1">
                        <h3 className="text-base font-medium tracking-tight">
                          Description ALT
                        </h3>
                        <p className="text-base italic text-muted-foreground">
                          6 Secrets to Maximize Your Monstera&apos;s Size
                          Indoors
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </CardContent>
        </Card>
        <div className="flex flex-col gap-4">
          {/* Description du produit */}
          <Card className="h-fit w-full max-w-4xl">
            <CardHeader className="p-6">
              <CardTitle className="text-xl font-medium tracking-tight">
                Description du produit
              </CardTitle>
              <CardDescription>
                Description affichée sur la page du produit.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              <p className="text-base text-muted-foreground">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Voluptas voluptatum, maiores nulla possimus sit libero
                cupiditate soluta voluptatem minima, ab, dicta deleniti sequi
                aut voluptatibus nemo eum sint fuga? Recusandae!
              </p>
            </CardContent>
          </Card>

          {/* Meta datas*/}
          <Card className="h-fit w-full max-w-4xl">
            <CardHeader className="p-6">
              <CardTitle className="text-xl font-medium tracking-tight">
                Meta datas
              </CardTitle>
              <CardDescription>
                Titre et description affichés sur les moteurs de recherche.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-medium tracking-tight">
                  Titre de la page
                </h3>
                <p className="text-base">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit !
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-medium tracking-tight">
                  Description de la page
                </h3>
                <p className="text-base">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Maxime distinctio vitae quo explicabo nemo reprehenderit enim
                  voluptatibus odio labore placeat.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Card>
        <CardHeader className="p-6">
          <CardTitle className="text-lg">Adresse URL du produit</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <p className="text-base text-muted-foreground">{`http://localhost:3001/produits/${product.slug}`}</p>
            <Button
              size="sm"
              onClick={() => {
                copyToClipboard(
                  `http://localhost:3001/produits/${product.slug}`,
                );
              }}
            >
              {isCopy ? (
                <div className="flex items-center gap-1">
                  <CheckIcon />
                  <p className="text-sm">Copié</p>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <CopyIcon />
                  <p className="text-sm">Copier</p>
                </div>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default ProductPage;
