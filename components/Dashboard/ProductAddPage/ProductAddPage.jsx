"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import AddProduct from "../AddProduct/AddProduct";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader/Loader";

const ProductAddPage = ({ token }) => {
  const router = useRouter();
  const [isLogged, setIsLoged] = useState(false);

  useEffect(() => {
    if (token) {
      setIsLoged(true);
      return;
    }
    router.push("/admin/login");
  }, []);

  if (!isLogged) {
    return <Loader />;
  }

  return (
    <section className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
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
                <Link
                  href="/admin/produits/liste"
                  className="hover:text-primary"
                >
                  Liste des produits
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  href="/admin/ajouter-produit"
                  className="text-primary hover:text-primary"
                >
                  Ajouter un produit
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-2xl font-semibold">Ajouter un produit</h1>
      </header>
      <AddProduct />
    </section>
  );
};

export default ProductAddPage;
