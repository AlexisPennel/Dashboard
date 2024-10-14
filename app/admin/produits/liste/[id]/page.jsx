import React from "react";
import ProductBySlug from "@/components/Dashboard/ProductBySlug/ProductBySlug";
import { cookies } from "next/headers";

const ProductPage = () => {
  const cookieStore = cookies();
  const token = cookieStore.get("access_token");

  return (
    <main className="flex flex-col gap-4 p-2 pt-4 md:p-6 lg:p-8">
      <ProductBySlug token={token} />
    </main>
  );
};

export default ProductPage;
