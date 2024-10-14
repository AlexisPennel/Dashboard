import ProductUpdatePage from "@/components/Dashboard/ProductUpdatePage/ProductUpdatePage";
import { cookies } from "next/headers";
import React from "react";

const page = () => {
  const cookieStore = cookies();
  const token = cookieStore.get("access_token");

  return (
    <main className="flex flex-col gap-4 p-2 pt-4 md:p-6 lg:p-8">
      <header className="flex flex-col gap-2">
        <h1>Modifier le produit</h1>
        <p>Modifez votre produit en remplissant le formulaire.</p>
      </header>
      <ProductUpdatePage token={token} />
    </main>
  );
};

export default page;
