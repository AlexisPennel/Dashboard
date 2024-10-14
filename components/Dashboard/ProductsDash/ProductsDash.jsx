"use client";
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
    <section className="flex flex-col gap-4 md:gap-8">
      <header className="flex justify-between">
        <h1 className="font-semibold">Vue d&apos;ensemble des produits</h1>
      </header>
      <section className="grid grid-cols-1 gap-4 md:gap-8">
        <GetProducts limit={4} />
        <GetCategories page={"dashboard"} />
      </section>
    </section>
  );
};

export default ProductsDash;
