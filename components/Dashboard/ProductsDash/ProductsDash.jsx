"use client";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import GetProducts from "../GetProducts/GetProducts";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader/Loader";
import GetCategories from "../GetCategories/GetCategories";

const ProductsDash = ({ token }) => {
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
    <section className="flex flex-col gap-4">
      <header className="flex justify-between">
        <h1 className="text-xl font-semibold md:text-2xl">
          Vue d&apos;ensemble des produits
        </h1>
      </header>
      <div className="grid grid-cols-1 gap-4">
        <GetProducts limit={4} />
        <GetCategories />
      </div>
    </section>
  );
};

export default ProductsDash;
