import Image from "next/image";
import Logo from "@/../public/logo/logo.svg";
export default function Home() {
  return (
    <main
      className="
    mx-auto 
    min-h-svh 
    w-full 
    xl:w-[1580px] 
    p-[20px] 
    grid 
    gap-x-[20px] 
    xl:gap-y-0 
    gap-y-8 
    grid-cols-[160px_1fr] 
    grid-rows-[auto_1fr_auto] 
    xl:grid-cols-10
    xl:grid-rows-[auto_1fr_auto]"
    >
      <div className="col-start-1 col-span-4 row-start-1 self-start xl:col-start-2 xl:row-start- xl:self-start">
        <img
          src="/bird-icon.svg"
          alt="Greencrown mark"
          className="h-auto w-40 xl:w-86"
        />
      </div>
      <div className="col-start-1 col-span-2 row-start-2 self-start xl:col-start-2 xl:row-start-3 xl:self-start">
        <Image
          src={Logo}
          alt="Greencrown Logo"
          width={100}
          className="h-auto w-32"
        />
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
            <a href="#">photography</a>
          </li>
        </ul>
      </nav>
      <div className="col-span-2 max-w-[400px] row-start-3 self-end text-base leading-tight xl:col-start-4 xl:row-start-3 xl:col-span-4 xl:self-start">
        <p>
          Greencrown is a creative and experimental design practice based in
          Bath, Somerset.
        </p>
      </div>
    </main>
  );
}
