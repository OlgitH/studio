"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import MenuShape from "@/../public/SVG/menu-overlay.svg";

type NavEntry =
	| { type: "link"; href: string; label: string }
	| {
			type: "submenu";
			label: string;
			links: { href: string; label: string }[];
	  };

const NAV_ENTRIES: NavEntry[] = [
	{ type: "link", href: "/", label: "home" },
	{ type: "link", href: "/about", label: "about" },
	{ type: "link", href: "/approach", label: "approach" },
	{
		type: "submenu",
		label: "website maintenance",
		links: [
			{ href: "/website-maintenance", label: "website maintenance" },
			{ href: "/website-maintenance/plan", label: "maintenance plan" },
			{ href: "/website-maintenance/content", label: "content" },
			{
				href: "/website-maintenance/monitoring-progress",
				label: "monitoring progress",
			},
			{ href: "/website-maintenance/photography", label: "photography" },
		],
	},
	// { type: "link", href: "/data-visualisation", label: "data visualisation" },
	{ type: "link", href: "/business-processes", label: "AI business processes" },
	{ type: "link", href: "/training", label: "training" },
	{ type: "link", href: "/blog", label: "blog" },
	{ type: "link", href: "/contact", label: "contact" },
];

export default function BurgerMenu() {
	const [open, setOpen] = useState(false);
	const [maintenanceOpen, setMaintenanceOpen] = useState(false);
	const [onLight, setOnLight] = useState(false);
	const [overStickyBar, setOverStickyBar] = useState(false);

	// On the homepage, StickyHeaderNav's opaque white bar sits behind the icon
	// once #hero-nav has scrolled past — the icon needs to stay dark there
	// regardless of onLight, or it goes white-on-white against the bar. Other
	// pages have no #hero-nav, so this is a no-op.
	useEffect(() => {
		const target = document.getElementById("hero-nav");
		if (!target) return;

		const observer = new IntersectionObserver(([entry]) => {
			setOverStickyBar(!entry.isIntersecting && entry.boundingClientRect.top < 0);
		});
		observer.observe(target);
		return () => observer.disconnect();
	}, []);

	useEffect(() => {
		const sections = document.querySelectorAll<HTMLElement>("[data-nav-light]");
		if (sections.length === 0) return;

		// The fixed icon sits within the first ~64px of the viewport (top-4/
		// top-5 offset plus its own h-9 height) — shrink the observer's root
		// to that band so it fires only when a light-background section's
		// edge crosses it, not on every scroll frame.
		const ICON_BAND = 64;
		const intersecting = new Set<Element>();

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) intersecting.add(entry.target);
					else intersecting.delete(entry.target);
				}
				setOnLight(intersecting.size > 0);
			},
			{ rootMargin: `0px 0px -${window.innerHeight - ICON_BAND}px 0px` },
		);

		sections.forEach((section) => observer.observe(section));
		return () => observer.disconnect();
	}, []);

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
				className={`relative cursor-pointer z-20 flex h-9 w-9 items-center justify-center transition-colors duration-300 ${
					// Closed: dark once a light-background section (white/lime/
					// mauve) is scrolled behind the icon, white otherwise — unless
					// StickyHeaderNav's opaque white bar is covering it, which is
					// always light, so the icon stays dark regardless. Open: the
					// mobile overlay behind it is dark, the desktop panel is lime, so
					// those are hardcoded per breakpoint instead.
					open
						? "text-white md:text-[#120d0d]"
						: overStickyBar
							? "text-[#120d0d]"
							: onLight
								? "text-[#120d0d]"
								: "text-white"
				}`}
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

			{/* Mobile: full-screen overlay menu, no shape — the lime silhouette
			is desktop-only (see below). */}
			<div
				className={`fixed inset-0 z-10 bg-[var(--page-background)] transition-opacity duration-300 md:hidden ${
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
									<li
										key={entry.href}
										className={itemClassName}
										style={itemStyle}
									>
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
											maintenanceOpen
												? "grid-rows-[1fr] opacity-100"
												: "grid-rows-[0fr] opacity-0"
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

			{/* Desktop: full-height panel fixed to the right edge, no overlay */}
			<nav
				aria-label="Primary"
				className={`fixed inset-y-0 right-0 hidden md:block ${
					open ? "" : "pointer-events-none"
				}`}
			>
				{/* Slides in from the right and fades first (0ms delay, short
				duration); the links start staggering in from 100ms, so the
				panel is already in place by the time they arrive. The lime
				background is the brand's own curved silhouette asset (a soft
				bell/bird-breast shape) instead of a flat rectangle. */}
				<div
					className={`relative flex h-full items-stretch justify-end transition-all duration-200 ease-out ${
						open ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"
					}`}
				>
					<div className="relative h-full w-[360px] xl:w-[420px]">
						<Image
							src={MenuShape}
							alt=""
							aria-hidden="true"
							fill
							sizes="420px"
							className="object-fill"
							priority
						/>
					</div>
					<ul className="absolute inset-0 flex flex-col items-end justify-center gap-2 px-10 py-8 text-lg font-light text-[#120d0d]">
						{NAV_ENTRIES.map((entry, index) => {
							const itemClassName = `transition-all duration-500 ease-out ${
								open ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"
							}`;
							const itemStyle = {
								transitionDelay: open ? `${index * 80 + 100}ms` : "0ms",
							};

							if (entry.type === "link") {
								return (
									<li
										key={entry.href}
										className={itemClassName}
										style={itemStyle}
									>
										<Link
											href={entry.href}
											onClick={closeMenu}
											className="whitespace-nowrap"
										>
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
											maintenanceOpen
												? "grid-rows-[1fr] opacity-100"
												: "grid-rows-[0fr] opacity-0"
										}`}
									>
										<div className="min-h-0 flex flex-col items-end overflow-hidden pt-2">
											<div
												aria-hidden="true"
												className={`h-px self-end bg-[#120d0d]/30 transition-all duration-500 ease-out ${
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
																maintenanceOpen && open
																	? `${subIndex * 80 + 150}ms`
																	: "0ms",
														}}
													>
														<Link
															href={link.href}
															onClick={closeMenu}
															className="whitespace-nowrap font-light"
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
				</div>
			</nav>
		</div>
	);
}
