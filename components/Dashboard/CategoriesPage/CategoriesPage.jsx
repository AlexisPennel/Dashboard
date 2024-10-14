"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import AddCategory from "../AddCategory/AddCategory";
import GetCategories from "../GetCategories/GetCategories";
import Loader from "@/components/Loader/Loader";

const CategoriesPage = ({ token }) => {
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
    <section className="flex flex-col gap-4 lg:gap-8">
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
                  href="/admin/categories"
                  className="text-primary hover:text-primary"
                >
                  Catégories des produits
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="font-semibold">Catégories des produits</h1>
        <p className="text-muted-foreground">
          Utilisez des catégories pour organiser vos produits.
        </p>
      </header>
      <div className="flex flex-col gap-4 lg:flex-row lg:gap-8">
        <AddCategory />
        <GetCategories />
      </div>
    </section>
  );
};

export default CategoriesPage;
