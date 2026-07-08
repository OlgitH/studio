"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const NAV_LINKS = [
  { href: "/about", label: "about" },
  { href: "/website-maintenance", label: "website maintenance" },
  { href: "/data-visualisation", label: "data visualisation" },
  { href: "/photography", label: "photography" },
];

export default function BurgerMenu() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <div className="fixed top-4 right-4 z-[60] xl:top-5 xl:right-5">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="site-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        className="relative z-20 flex h-9 w-9 items-center justify-center"
      >
        <span className="relative block h-4 w-6">
          <span
            className={`absolute inset-x-0 top-0 h-0.5 bg-current transition-all duration-300 ${
              open ? "top-1/2 -translate-y-1/2 rotate-45" : ""
            }`}
          />
          <span
            className={`absolute top-1/2 left-0 h-0.5 w-4 -translate-y-1/2 bg-current transition-all duration-200 ${
              open ? "-translate-x-2 opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`absolute inset-x-0 bottom-0 h-0.5 bg-current transition-all duration-300 ${
              open ? "bottom-1/2 translate-y-1/2 -rotate-45" : ""
            }`}
          />
        </span>
      </button>

      {/* Mobile: full-screen overlay menu */}
      <div
        className={`fixed inset-0 z-10 bg-[#120d0d] transition-opacity duration-300 md:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <nav
          id="site-menu"
          aria-label="Primary"
          className="flex h-full w-full items-center justify-center"
        >
          <ul className="flex flex-col items-center gap-6 text-2xl font-light">
            {NAV_LINKS.map((link, index) => (
              <li
                key={link.href}
                className={`transition-all duration-500 ease-out ${
                  open
                    ? "translate-x-0 opacity-100"
                    : "translate-x-8 opacity-0"
                }`}
                style={{
                  transitionDelay: open ? `${index * 80 + 150}ms` : "0ms",
                }}
              >
                <Link href={link.href} onClick={() => setOpen(false)}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Desktop: menu sits below the icon, no overlay */}
      <nav
        aria-label="Primary"
        className={`absolute top-full right-0 mt-4 hidden md:block ${
          open ? "" : "pointer-events-none"
        }`}
      >
        <ul className="flex flex-col items-end gap-2 text-lg font-light">
          {NAV_LINKS.map((link, index) => (
            <li
              key={link.href}
              className={`transition-all duration-500 ease-out ${
                open ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"
              }`}
              style={{
                transitionDelay: open ? `${index * 80 + 100}ms` : "0ms",
              }}
            >
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                className="whitespace-nowrap"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
