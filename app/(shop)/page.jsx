import BestProducts from "@/components/Shop/BestProducts/BestProducts";
import React from "react";

const page = () => {
  return (
    <main className="flex flex-1 flex-col gap-4 p-2 pt-4 md:gap-8 md:p-8 2xl:p-16 2xl:pt-8">
      <section className="m-auto flex w-fit flex-col gap-6">
        <header className="flex flex-col gap-2">
          <h2 className="text-center">Nos produits vedettes</h2>
          <p className="text-center text-muted-foreground">
            Découvrez les quatre produits les plus appréciés par nos clients.
          </p>
        </header>
        <BestProducts />
      </section>
    </main>
  );
};

export default page;
