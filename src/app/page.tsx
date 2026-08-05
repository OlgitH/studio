import Image from "next/image";
import Link from "next/link";
import Logo from "@/../public/logo/logo-white-no-bird.svg";
export default function Home() {
  return (
    <main className="home-main text-foreground min-h-svh w-full flex flex-col relative overflow-hidden">
      <Image
        src="/bird-blur.png"
        alt=""
        fill
        priority
        aria-hidden="true"
        className="absolute inset-0 z-0 object-contain object-[0%_10%] xl:object-[100%_0%] opacity-90 pointer-events-none scale-75 origin-top-right"
      />
      <div className="relative z-10 mx-auto flex flex-1 flex-col w-full p-[20px] xl:w-[1080px]">
        <div className="flex-1 grid grid-cols-[max-content_max-content] gap-x-10 gap-y-8 grid-rows-[auto_1fr_auto] xl:gap-x-[32px] xl:gap-y-0 xl:grid-cols-10 xl:grid-rows-[auto_1fr_auto]">
          <div className="col-start-1 col-span-4 row-start-1 self-start xl:col-start-1 xl:row-start- xl:self-start">
            <img
              src="/bird-icon.svg"
              alt="Greencrown mark"
              className="brand-icon h-auto w-40 xl:w-86"
            />
          </div>
          <div className="col-start-1 row-start-2 self-start xl:col-start-1 xl:col-span-2 xl:row-start-3 xl:self-start">
            <Image
              src={Logo}
              alt="Greencrown Studio"
              width={140}
              className="brand-logo h-auto w-48"
            />
          </div>
          <nav
            className="primary-nav hidden col-start-2 row-start-2 self-start justify-self-start sm:block xl:col-start-3 xl:col-span-2 xl:row-start-3 xl:self-start"
            aria-label="Primary"
          >
            <ul className="flex flex-col gap-1 text-xl leading-none font-light">
              <li>
                <Link href="/about">about</Link>
              </li>
              <li>
                <Link href="/website-maintenance" className="whitespace-nowrap">
                  website maintenance
                </Link>
              </li>
              <li>
                <Link href="/business-processes" className="whitespace-nowrap">
                  AI business processes
                </Link>
              </li>
              <li>
                <Link href="/training">training</Link>
              </li>
            </ul>
          </nav>
          <div className="col-span-2 max-w-[400px] row-start-3 self-end text-base leading-tight xl:col-start-5 xl:row-start-3 xl:col-span-6 xl:self-start">
            <p className="font-light">
              Greencrown Studio offers creative website development in Bath,
              Somerset. We help small businesses to enhance their website and
              online productivity.
            </p>
          </div>
          <section className="mt-10 row-start-4 xl:col-start-1 font-light">
            <p>
              <a href="mailto:olly@greencrown.studio">olly@greencrown.studio</a>
            </p>
            <p>
              <a href="tel:+01225699150" className="whitespace-nowrap">
                +44 1225 699150
              </a>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
