"use client";
import React, { useEffect, useState, useContext } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { calculateFinalPrice } from "@/lib/calculatePrice";
import { AppContext } from "@/app/context/AppContext";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";

const ProductPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const slug = pathname.split("/").pop();
  const {
    products,
    setProducts,
    categories,
    setCategories,
    fetchLoading,
    loadDatas,
  } = useContext(AppContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCopy, setIsCopy] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url);
    setIsCopy(true);
    setTimeout(() => {
      setIsCopy(false);
    }, 2000);
  };

  useEffect(() => {
    if (products !== null) {
      try {
        const productFind = products.find((product) => product.slug === slug);
        setProduct(productFind);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    } else {
      console.log("fetch");
      loadDatas();
    }
  }, [products, fetchLoading]);

  const getCategorieName = (id) => {
    const categorie = categories.find((categorie) => categorie._id === id);
    if (categorie) {
      return categorie.name;
    } else {
      return "Aucune catégorie";
    }
  };

  const handleDelete = async () => {
    try {
      // Supprimez le produit via l'API
      await api.delete(`/api/product/${slug}`);

      // Mettez à jour le contexte pour retirer le produit de la liste
      setProducts((prevProducts) => {
        if (!prevProducts) return []; // Assurez-vous que prevProducts est défini
        return prevProducts.filter((product) => product.slug !== slug);
      });

      // Mettez à jour les catégories en enlevant l'ID du produit
      setCategories((prevCategories) => {
        if (!prevCategories) return []; // Vérifiez que prevCategories est défini
        return prevCategories.map((category) => {
          // Si la catégorie contient l'ID du produit, l'enlever
          if (category.productIds) {
            return {
              ...category,
              productIds: category.productIds.filter(
                (id) => id !== product._id,
              ),
            };
          }
          return category;
        });
      });
    } catch (error) {
      console.error("Erreur lors de la suppression du produit :", error);
    } finally {
      setIsDialogOpen(false); // Fermer le dialogue après la suppression
      router.push("/admin/produits");
    }
  };

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
      <Breadcrumb className="hidden md:flex">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/admin/produits" className="hover:text-primary">
                Vue d&apos;ensemble
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/admin/produits/liste" className="hover:text-primary">
                Liste des produits
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link
                href={`/admin/produits/liste/${product.slug}`}
                className="text-primary hover:text-primary"
              >
                {product.name}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <header className="flex w-full items-center justify-between">
        {/* Title + slug */}
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-semibold">{product.name}</h1>
          <Badge
            variant={
              product.status === "online"
                ? "online"
                : product.status === "draft"
                  ? "brouillon"
                  : "destructive"
            }
            className="h-fit w-fit"
          >
            {product.status === "online"
              ? "En ligne"
              : product.status === "draft"
                ? "Brouillon"
                : "Archivé"}
          </Badge>
        </div>
        {/* button */}
        <div className="flex gap-2">
          <Button className="flex gap-1">
            <Pencil2Icon />
            Modifier
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              setIsDialogOpen(true);
            }}
          >
            Supprimer
          </Button>
        </div>
      </header>

      {/* Dialog de confirmation */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est
              irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                handleDelete();
              }}
            >
              Confirmer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Catégorie + prix + ventes + CA */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* catégorie */}
        <Card className="w-full">
          <CardHeader className="p-6 pb-2">
            <CardTitle className="text-xl font-medium tracking-tight">
              Catégorie du produit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl text-muted-foreground">
              {getCategorieName(product.category)}
            </p>
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
            {product.discount ? (
              <div className="flex gap-2">
                <p className="text-xl text-muted-foreground line-through">
                  {product.price}€
                </p>
                <p className="text-xl text-muted-foreground">
                  {calculateFinalPrice(product.price, product.discount)}€
                </p>
                <p className="rounded bg-primary px-2 py-1 text-sm text-white">
                  {product.discount}%
                </p>
              </div>
            ) : (
              <p className="text-xl text-muted-foreground">{product.price}€</p>
            )}
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
            <p className="text-xl text-muted-foreground">
              {product.sales} ventes
            </p>
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
            <p className="text-xl text-muted-foreground">{product.revenue}€</p>
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
              {product.images && product.images.length >= 1 && (
                <ul className="flex flex-col gap-4">
                  {product.images.map((image, index) => (
                    <li key={index} className="flex w-full gap-4">
                      <Image
                        src={`http://localhost:3000${image}`}
                        alt={`${product.altDescriptions[index]}`}
                        width={200}
                        height={200}
                        className="h-auto w-20 rounded-md object-cover shadow"
                      />
                      <div className="flex flex-col gap-1">
                        <h3 className="text-base font-medium tracking-tight">
                          Description ALT
                        </h3>
                        <p className="text-base italic text-muted-foreground">
                          {product.altDescriptions[index]}
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
            <CardContent className="flex flex-col gap-4">
              <p className="text-base">{product.description}</p>
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
                <p className="text-base">{product.metaTitle}</p>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-medium tracking-tight">
                  Description de la page
                </h3>
                <p className="text-base">{product.metaDescription}</p>
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
