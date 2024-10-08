import Dashboard from "@/components/Dashboard/Dashboard";
import { cookies } from "next/headers";
import React from "react";

const page = () => {
  const cookieStore = cookies();
  const token = cookieStore.get("access_token");

  return (
    <div>
      <Dashboard token={token} />
    </div>
  );
};

export default page;
