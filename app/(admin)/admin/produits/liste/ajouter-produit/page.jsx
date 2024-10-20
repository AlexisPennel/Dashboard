import ProductAddPage from "@/components/Dashboard/ProductAddPage/ProductAddPage";
import { cookies } from "next/headers";
import React from "react";

const page = () => {
  const cookieStore = cookies();
  const token = cookieStore.get("access_token");

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <ProductAddPage token={token} />
    </main>
  );
};

export default page;
