import CategoriesPage from "@/components/Dashboard/CategoriesPage/CategoriesPage";
import { cookies } from "next/headers";
import React from "react";

const page = () => {
  const cookieStore = cookies();
  const token = cookieStore.get("access_token");

  return (
    <main className="flex flex-1 flex-col gap-4 p-2 pt-4 md:gap-8 md:p-8 2xl:p-16 2xl:pt-8">
      <CategoriesPage token={token} />
    </main>
  );
};

export default page;
