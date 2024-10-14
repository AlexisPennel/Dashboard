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
import {
  CheckIcon,
  CopyIcon,
  Pencil2Icon,
  TrashIcon,
} from "@radix-ui/react-icons";
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
import { ProductContext } from "@/app/context/ProductContext";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import Loader from "@/components/Loader/Loader";

const ProductBySlug = ({ token }) => {
  const router = useRouter();
  const pathname = usePathname();
  const slug = pathname.split("/").pop();
  const { products, categories, fetchLoading, loadDatas, deleteProduct } =
    useContext(ProductContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCopy, setIsCopy] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLogged, setIsLoged] = useState(false);

  useEffect(() => {
    if (token) {
      setIsLoged(true);
      return;
    }
    router.push("/admin/login");
  }, []);

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
      loadDatas();
    }
  }, [products, fetchLoading]);

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url);
    setIsCopy(true);
    setTimeout(() => {
      setIsCopy(false);
    }, 2000);
  };

  const getCategorieName = (id) => {
    const categorie = categories.find((categorie) => categorie._id === id);
    if (categorie) {
      return categorie.name;
    } else {
      return "Aucune catégorie";
    }
  };

  const handleDelete = async () => {
    deleteProduct(product.slug, product._id, product.category);
  };

  if (!isLogged) {
    return <Loader />;
  }

  if (loading) {
    return <Loader />;
  }

  if (!product) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg font-semibold">Produit non trouvé.</p>
      </div>
    );
  }

  return (
    <section className="flex flex-col gap-4">
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
        {/* Title + badge */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
          <h1 className="font-semibold">{product.name}</h1>
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
          <Button className="flex gap-1" size="sm">
            <Link
              href={`/admin/produits/liste/modifier/${product.slug}`}
              className="flex items-center gap-2"
            >
              <Pencil2Icon />
            </Link>
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              setIsDialogOpen(true);
            }}
          >
            <TrashIcon />
          </Button>
        </div>
      </header>

      {/* Dialog de confirmation */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-5/6 rounded p-4">
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est
              irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col gap-2">
            <Button
              variant="destructive"
              onClick={() => {
                handleDelete();
              }}
            >
              Confirmer
            </Button>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Annuler
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Catégorie + prix + ventes + CA */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* catégorie */}
        <Card className="w-full">
          <CardHeader className="p-4 pb-0">
            <CardTitle className="text-xl font-medium tracking-tight">
              Catégorie du produit
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <p className="text-lg text-muted-foreground">
              {getCategorieName(product.category)}
            </p>
          </CardContent>
        </Card>
        {/* Prix */}
        <Card className="w-full">
          <CardHeader className="p-4 pb-0">
            <CardTitle className="text-xl font-medium tracking-tight">
              Prix du produit
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {product.discount ? (
              <div className="flex gap-2">
                <p className="text-lg font-medium">
                  {calculateFinalPrice(product.price, product.discount)}€
                </p>
                <p className="text-base text-muted-foreground line-through">
                  {product.price}€
                </p>
                <p className="rounded bg-primary px-2 py-1 text-xs text-white">
                  {product.discount}%
                </p>
              </div>
            ) : (
              <p className="text-lg text-muted-foreground">{product.price}€</p>
            )}
          </CardContent>
        </Card>
        {/* ventes */}
        <Card className="w-full">
          <CardHeader className="p-4 pb-0">
            <CardTitle className="text-xl font-medium tracking-tight">
              Nombre de ventes
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {/* product.stats.sells */}
            <p className="text-lg text-muted-foreground">
              {product.sales} ventes
            </p>
          </CardContent>
        </Card>
        {/* Chiffre d'affaires du produit */}
        <Card className="w-full">
          <CardHeader className="p-4 pb-0">
            <CardTitle className="text-xl font-medium tracking-tight">
              Chiffre d&apos;affaires
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {/* product.stats.ca */}
            <p className="text-xl text-muted-foreground">{product.revenue}€</p>
          </CardContent>
        </Card>
      </div>

      {/* Description + Photos */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2">
        {/* Photos */}
        <Card className="w-full max-w-4xl">
          <CardHeader className="p-4">
            <CardTitle className="text-xl font-medium tracking-tight">
              {" "}
              Photos du produit
            </CardTitle>
            <CardDescription>
              Photos du produit et descriptions alternatives pour les personnes
              malvoyantes.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <div>
              {product.images && product.images.length >= 1 && (
                <ul className="flex flex-col gap-2">
                  {product.images.map((image, index) => (
                    <li key={index} className="flex w-full gap-2">
                      <Image
                        src={`http://localhost:3000${image}`}
                        alt={`${product.altDescriptions[index]}`}
                        width={200}
                        height={200}
                        className="h-16 w-16 rounded-md object-cover shadow lg:h-20 lg:w-20"
                      />
                      <div className="flex flex-col gap-1">
                        <h3 className="text-base font-medium tracking-tight">
                          Description ALT
                        </h3>
                        <p className="text-sm italic text-muted-foreground">
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
            <CardHeader className="p-4 pb-0">
              <CardTitle className="text-xl font-medium tracking-tight">
                Description du produit
              </CardTitle>
              <CardDescription>
                Description affichée sur la page du produit.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 p-4">
              <p className="text-sm">{product.description}</p>
            </CardContent>
          </Card>

          {/* Meta datas*/}
          <Card className="h-fit w-full max-w-4xl">
            <CardHeader className="p-4 pb-0">
              <CardTitle className="text-xl font-medium tracking-tight">
                Meta datas
              </CardTitle>
              <CardDescription>
                Titre et description affichés sur les moteurs de recherche.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 p-4">
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-medium tracking-tight">
                  Titre de la page
                </h3>
                <p className="text-sm">{product.metaTitle}</p>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-medium tracking-tight">
                  Description de la page
                </h3>
                <p className="text-sm">{product.metaDescription}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Card>
        <CardHeader className="p-4 pb-0">
          <CardTitle className="text-xl">Adresse URL du produit</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <p className="text-muted-foreground">{`http://localhost:3001/produits/${product.slug}`}</p>
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
                  <CheckIcon className="mr-1" />
                  <p className="text-sm">Copié</p>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <CopyIcon className="mr-1" />
                  <p className="text-sm">Copier</p>
                </div>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
      <div className="flex w-full flex-col justify-center gap-2 pb-4">
        <Button className="lg:w-fit">
          <Link
            href={`/admin/produits/liste/modifier/${product.slug}`}
            className="flex items-center gap-2"
          >
            <Pencil2Icon />
            Modifier le produit
          </Link>
        </Button>
        <Button
          variant="destructive"
          onClick={() => {
            setIsDialogOpen(true);
          }}
          className="flex gap-2 lg:w-fit"
        >
          <TrashIcon />
          Supprimer le produit
        </Button>
      </div>
    </section>
  );
};

export default ProductBySlug;
