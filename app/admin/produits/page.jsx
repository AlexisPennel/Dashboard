import React from "react";
import GetProducts from "@/components/Dashboard/GetProducts/GetProducts";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusIcon } from "@radix-ui/react-icons";
import { cookies } from "next/headers";
import ProductsDash from "@/components/Dashboard/ProductsDash/ProductsDash";

const page = () => {
  const cookieStore = cookies();
  const token = cookieStore.get("access_token");

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <ProductsDash token={token} />
    </main>
  );
};

export default page;
