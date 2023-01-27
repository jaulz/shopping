import React from "react";
import Image from "next/image";

export default function Logo({}: {}) {
  return (
    <Image
      src="https://www.jacando.com/wp-content/uploads/2021/01/jacando_logo_neg-768x169.png"
      alt="Jacando"
      width={187}
      height={41}
    />
  );
}
