"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import BackHomeLink from "../../components/BackHomeLink";
import BrandFooter from "../../components/BrandFooter";

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
      <BackHomeLink />
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
        <section className="mx-auto max-w-6xl w-full py-10">
          <div className="max-w-2xl">
            <h2 className="text-lg font-bold mb-4">Bespoke photography</h2>
            <p className="pb-20 font-light">
              We are able to do bespoke photography for your website or project.
              We analyse the tone, style and messaging needed, then plan and
              execute photography to high standards, tailoring to it&apos;s final use
              case (e.g. website splash banner, social media post, brochure
              etc.). With unique photography being increasingly important for
              SEO and to appear in AI generated search results, we know you may
              not have the time or expertise to achieve this. If you would like
              to discuss how we can help, please send us an email.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
