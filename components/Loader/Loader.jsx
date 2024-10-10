import React from "react";

const Loader = () => {
  return (
    <div class="flex h-screen items-center justify-center bg-white">
      <div class="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500"></div>
    </div>
  );
};

export default Loader;
