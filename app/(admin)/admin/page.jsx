import Login from "@/components/Login/Login";
import React from "react";

const page = () => {
  return (
    <main className="flex flex-1 flex-col gap-4 p-2 pt-4 md:gap-8 md:p-8 2xl:p-16 2xl:pt-8">
      <Login />
    </main>
  );
};

export default page;
