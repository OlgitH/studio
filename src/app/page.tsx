import Image from "next/image";
import Link from "next/link";
import Logo from "@/../public/logo/logo.svg";
export default function Home() {
  return (
    <main className="mx-auto min-h-svh w-full p-[20px] grid gap-x-[20px] gap-y-8 grid-cols-[160px_1fr] grid-rows-[auto_1fr_auto] xl:w-[1580px] xl:gap-y-0 xl:grid-cols-10 xl:grid-rows-[auto_1fr_auto]">
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
          alt="Greencrown Studio"
          width={100}
          className="h-auto w-32"
        />
      </div>
      <nav
        className="col-start-2 row-start-2 self-start justify-self-start xl:col-start-3 xl:row-start-3 xl:self-start"
        aria-label="Primary"
      >
        <ul className="flex flex-col gap-1 text-xl leading-none font-light">
          <li>
            <Link href="/data-visualisation" className="underline whitespace-nowrap">data visualisation</Link>
          </li>
          <li>
            <a href="#">visual art</a>
          </li>
          <li>
            <Link href="/photography" className="underline">
              photography
            </Link>
          </li>
          <li>
            <Link href="/about" className="underline">about</Link>
          </li>
        </ul>
      </nav>
      <div className="col-span-2 max-w-[400px] row-start-3 self-end text-base leading-tight xl:col-start-5 xl:row-start-3 xl:col-span-4 xl:self-start">
        <p className="font-light">
          Greencrown Studio is a design practice based in Bath, Somerset. We specialise in data visualisation, making your data meaningful so your story can be told effectively.
        </p>
      </div>
      <section className="mt-10 row-start-4 xl:col-start-2 font-light">
        <p>
          <a href="mailto:olly@greencrown.studio">olly@greencrown.studio</a>
        </p>
        <p>
          <a href="tel:+01225699150">+44 1225 699150</a>
        </p>
      </section>
    </main>
  );
}
