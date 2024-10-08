import React from "react";
import AddProduct from "@/components/Dashboard/AddProduct/AddProduct";
import GetProducts from "@/components/Dashboard/GetProducts/GetProducts";

const page = () => {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <h1 className="text-2xl font-semibold">Produits</h1>
      <div className="flex w-full gap-4">
        <GetProducts />
        <AddProduct />
      </div>
    </main>
  );
};

export default page;
