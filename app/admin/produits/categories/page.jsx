import AddCategory from "@/components/Dashboard/AddCategory/AddCategory";
import GetCategories from "@/components/Dashboard/GetCategories/GetCategories";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
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
        <h1 className="text-2xl font-semibold">Catégories des produits</h1>
      </header>
      <div className="flex gap-4">
        <AddCategory />
        <GetCategories />
      </div>
    </main>
  );
};

export default page;
