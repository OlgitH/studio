import Image from "next/image";
import Link from "next/link";
import Logo from "@/../public/logo/logo.svg";

type PhotographyFooterProps = {
  showFooter: boolean;
};

export default function PhotographyFooter({
  showFooter,
}: PhotographyFooterProps) {
  return (
    <footer
      className={`fixed bottom-0 left-0 right-0 z-40 transition-all duration-500 bg-[rgba(18,13,13,0.9)] backdrop-blur-sm ${
        showFooter ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      }`}
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-5 xl:px-5 xl:py-6">
        <div className="grid gap-x-5 gap-y-8 grid-cols-[160px_1fr] grid-rows-[auto_1fr_auto] xl:gap-y-0 xl:grid-cols-10 xl:grid-rows-[auto_1fr_auto]">
          <div className="col-start-1 col-span-2 row-start-2 self-start xl:row-start-3 xl:self-start">
            <Link href="/" className="underline">
              <Image
                src={Logo}
                alt="Greencrown Logo"
                width={100}
                className="h-auto w-32"
              />
            </Link>
          </div>
          <nav
            className="col-start-2 row-start-2 self-start justify-self-start xl:col-start-3 xl:row-start-3 xl:self-start"
            aria-label="Primary"
          >
            <ul className="flex flex-col gap-1 text-xl leading-none">
              <li>
                <a href="#">projects</a>
              </li>
              <li>
                <a href="#">visual art</a>
              </li>
              <li>
                <Link href="/photography" className="underline">
                  photography
                </Link>
              </li>
            </ul>
          </nav>
          <div className="col-span-2 max-w-100 row-start-3 self-end text-base leading-tight xl:col-start-4 xl:row-start-3 xl:col-span-4 xl:self-start">
            <p>
              Greencrown Studio is a creative and experimental design practice
              based in Bath, Somerset.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
