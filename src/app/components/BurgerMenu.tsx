"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type NavEntry =
  | { type: "link"; href: string; label: string }
  | {
      type: "submenu";
      label: string;
      links: { href: string; label: string }[];
    };

const NAV_ENTRIES: NavEntry[] = [
  { type: "link", href: "/about", label: "about" },
  { type: "link", href: "/approach", label: "approach" },
  {
    type: "submenu",
    label: "website maintenance",
    links: [
      { href: "/website-maintenance", label: "website maintenance" },
      { href: "/website-maintenance/content", label: "content" },
      {
        href: "/website-maintenance/monitoring-progress",
        label: "monitoring progress",
      },
      { href: "/website-maintenance/photography", label: "photography" },
    ],
  },
  { type: "link", href: "/data-visualisation", label: "data visualisation" },
  { type: "link", href: "/business-processes", label: "AI business processes" },
  { type: "link", href: "/training", label: "training" },
];

export default function BurgerMenu() {
  const [open, setOpen] = useState(false);
  const [maintenanceOpen, setMaintenanceOpen] = useState(false);

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

  useEffect(() => {
    if (!open) setMaintenanceOpen(false);
  }, [open]);

  const closeMenu = () => setOpen(false);

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
            {NAV_ENTRIES.map((entry, index) => {
              const itemClassName = `transition-all duration-500 ease-out ${
                open ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"
              }`;
              const itemStyle = {
                transitionDelay: open ? `${index * 80 + 150}ms` : "0ms",
              };

              if (entry.type === "link") {
                return (
                  <li key={entry.href} className={itemClassName} style={itemStyle}>
                    <Link href={entry.href} onClick={closeMenu}>
                      {entry.label}
                    </Link>
                  </li>
                );
              }

              return (
                <li
                  key={entry.label}
                  className={`flex flex-col items-center ${itemClassName}`}
                  style={itemStyle}
                >
                  <button
                    type="button"
                    onClick={() => setMaintenanceOpen((value) => !value)}
                    aria-expanded={maintenanceOpen}
                    aria-controls="website-maintenance-submenu-mobile"
                    className="flex items-center gap-2"
                  >
                    {entry.label}
                    <span className="relative block h-2 w-2">
                      <span
                        className={`absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 bg-current transition-transform duration-300 ${
                          maintenanceOpen ? "rotate-90" : "rotate-0"
                        }`}
                      />
                      <span className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 bg-current" />
                    </span>
                  </button>

                  <div
                    id="website-maintenance-submenu-mobile"
                    className={`grid w-full justify-items-center overflow-hidden transition-all duration-500 ease-out ${
                      maintenanceOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="min-h-0 flex flex-col items-center overflow-hidden pt-4">
                      <div
                        aria-hidden="true"
                        className={`h-px self-center bg-white transition-all duration-500 ease-out ${
                          maintenanceOpen ? "w-24 opacity-100" : "w-0 opacity-0"
                        }`}
                      />
                      <ul className="mt-4 flex flex-col items-center gap-6">
                        {entry.links.map((link, subIndex) => (
                          <li
                            key={link.href}
                            className={`transition-all duration-500 ease-out ${
                              maintenanceOpen && open
                                ? "translate-x-0 opacity-100"
                                : "translate-x-8 opacity-0"
                            }`}
                            style={{
                              transitionDelay:
                                maintenanceOpen && open
                                  ? `${subIndex * 80 + 150}ms`
                                  : "0ms",
                            }}
                          >
                            <Link
                              href={link.href}
                              onClick={closeMenu}
                              className="font-light text-[#e3ffb3]"
                            >
                              {link.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </li>
              );
            })}
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
          {NAV_ENTRIES.map((entry, index) => {
            const itemClassName = `transition-all duration-500 ease-out ${
              open ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"
            }`;
            const itemStyle = {
              transitionDelay: open ? `${index * 80 + 100}ms` : "0ms",
            };

            if (entry.type === "link") {
              return (
                <li key={entry.href} className={itemClassName} style={itemStyle}>
                  <Link href={entry.href} onClick={closeMenu} className="whitespace-nowrap">
                    {entry.label}
                  </Link>
                </li>
              );
            }

            return (
              <li
                key={entry.label}
                className={`flex flex-col items-end ${itemClassName}`}
                style={itemStyle}
              >
                <button
                  type="button"
                  onClick={() => setMaintenanceOpen((value) => !value)}
                  aria-expanded={maintenanceOpen}
                  aria-controls="website-maintenance-submenu-desktop"
                  className="flex items-center gap-2 whitespace-nowrap"
                >
                  {entry.label}
                  <span className="relative block h-2 w-2 shrink-0">
                    <span
                      className={`absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 bg-current transition-transform duration-300 ${
                        maintenanceOpen ? "rotate-90" : "rotate-0"
                      }`}
                    />
                    <span className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 bg-current" />
                  </span>
                </button>

                <div
                  id="website-maintenance-submenu-desktop"
                  className={`grid w-full justify-items-end overflow-hidden transition-all duration-500 ease-out ${
                    maintenanceOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="min-h-0 flex flex-col items-end overflow-hidden pt-2">
                    <div
                      aria-hidden="true"
                      className={`h-px self-end bg-white transition-all duration-500 ease-out ${
                        maintenanceOpen ? "w-24 opacity-100" : "w-0 opacity-0"
                      }`}
                    />
                    <ul className="mt-2 flex flex-col items-end gap-2">
                      {entry.links.map((link, subIndex) => (
                        <li
                          key={link.href}
                          className={`transition-all duration-500 ease-out ${
                            maintenanceOpen && open
                              ? "translate-x-0 opacity-100"
                              : "translate-x-4 opacity-0"
                          }`}
                          style={{
                            transitionDelay:
                              maintenanceOpen && open ? `${subIndex * 80 + 150}ms` : "0ms",
                          }}
                        >
                          <Link
                            href={link.href}
                            onClick={closeMenu}
                            className="whitespace-nowrap font-light text-[#e3ffb3]"
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
