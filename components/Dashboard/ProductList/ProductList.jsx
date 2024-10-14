"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import GetProducts from "../GetProducts/GetProducts";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader/Loader";

const ProductList = ({ token }) => {
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
    <>
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
                  className="text-primary hover:text-primary"
                >
                  Liste des produits
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="font-semibold">Liste des produits</h1>
      </header>
      <div>
        <GetProducts page={"list"} />
      </div>
    </>
  );
};

export default ProductList;
