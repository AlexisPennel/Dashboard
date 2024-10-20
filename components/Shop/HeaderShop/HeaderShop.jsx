import React from "react";
import plant from "../../../public/icons/plant.svg";
import Image from "next/image";

const HeaderShop = () => {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background px-4 md:px-8 2xl:px-16">
      <div className="flex gap-2">
        <Image
          src={plant}
          width={284}
          height={50}
          alt="Logo du magasin de plantes GreenNest"
          className="h-auto w-32"
        />
      </div>
    </header>
  );
};

export default HeaderShop;
