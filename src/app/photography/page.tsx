"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import BrandFooter from "../components/BrandFooter";

export default function Photography() {
  const [showFooter, setShowFooter] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setShowFooter(window.scrollY > 200);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <>
      <Link href="/" className="back-home-link" aria-label="Back home">
        <Image
          src="/bird-icon.svg"
          alt="Greencrown mark"
          width={160}
          height={94}
          priority
        />
        <span>back home</span>
      </Link>
      <main className="p-4 pb-52 w-full xl:pb-40">
        <section className="mx-auto w-full max-w-6xl flex flex-col gap-4">
          <Image
            src="/scrapbook/abstract1.png"
            alt="Abstract image"
            width={1800}
            height={1800}
            className="h-auto w-full"
          />
          <Image
            src="/scrapbook/abstract2.png"
            alt="Abstract image"
            width={1800}
            height={1800}
            className="h-auto w-full"
          />
          <Image
            src="/scrapbook/abstract3.png"
            alt="Abstract image"
            width={1800}
            height={1800}
            className="h-auto w-full"
          />
        </section>
        <BrandFooter showFooter={showFooter} />
      </main>
    </>
  );
}
