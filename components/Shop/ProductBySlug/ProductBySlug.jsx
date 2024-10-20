"use client";
import { usePathname } from "next/navigation";
import React from "react";

const ProductBySlug = () => {
  const pathname = usePathname();
  const slug = pathname.split("/").pop();

  return (
    <section>
      <h1>{slug}</h1>
    </section>
  );
};

export default ProductBySlug;
