"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import MenuShape from "@/../public/SVG/menu-overlay.svg";
import MobileMenuArtboard from "@/../public/2x/white-mobile-overlay@2x.png";

type NavEntry =
	| { type: "link"; href: string; label: string }
	| {
			type: "submenu";
			label: string;
			links: { href: string; label: string }[];
	  };

const NAV_ENTRIES: NavEntry[] = [
	{ type: "link", href: "/", label: "Home" },
	{ type: "link", href: "/about", label: "About" },
	{ type: "link", href: "/approach", label: "Approach" },
	{
		type: "submenu",
		label: "Website maintenance",
		links: [
			{ href: "/website-maintenance", label: "Website maintenance" },
			{ href: "/website-maintenance/plan", label: "Maintenance plan" },
			{ href: "/website-maintenance/content", label: "Content" },
			{
				href: "/website-maintenance/monitoring-progress",
				label: "monitoring progress",
			},
			// { href: "/website-maintenance/photography", label: "Photography" },
		],
	},
	// { type: "link", href: "/data-visualisation", label: "data visualisation" },
	{ type: "link", href: "/business-processes", label: "AI business processes" },
	{ type: "link", href: "/training", label: "Training" },
	{ type: "link", href: "/case-studies", label: "Case studies" },
	{ type: "link", href: "/blog", label: "Blog" },
	{ type: "link", href: "/contact", label: "Contact" },
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
		// Bled off the corner: the circle is bigger than the viewport slot it
		// sits in, offset up and right so only a crescent shows. The icon is
		// positioned off-centre within that crescent (not flex-centred) so it
		// lines up with StickyHeaderNav's logo/nav row instead of sitting at
		// the circle's own midpoint. z-60 keeps it above StickyHeaderNav
		// (z-40) and the menu overlay/panel (z-10) at all times, open or
		// closed, so it never disappears behind either.
		<div className="fixed -top-12 -right-12 z-[60] xl:-top-16 xl:-right-16">
			<button
				type="button"
				onClick={() => setOpen((value) => !value)}
				aria-expanded={open}
				aria-controls="site-menu"
				aria-label={open ? "Close menu" : "Open menu"}
				className={`relative z-20 h-32 w-32 cursor-pointer rounded-full bg-[var(--color-highlight)] text-[#120d0d] xl:h-40 xl:w-40 ${
					open ? "" : "shadow-[0_2px_12px_rgba(0,0,0,0.25)]"
				}`}
			>
				<span className="absolute top-[74px] right-[68px] block h-4 w-6 xl:top-[94px] xl:right-[84px]">
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

			{/* Mobile: full-screen overlay menu. The artboard PNG is transparent
			over its top ~quarter, so the dark page background shows through
			there before the lime shape takes over underneath it. */}
			<div
				className={`fixed inset-0 z-10 overflow-hidden bg-[var(--page-background)] transition-opacity duration-300 md:hidden ${
					open ? "opacity-100" : "pointer-events-none opacity-0"
				}`}
			>
				<Image
					src={MobileMenuArtboard}
					alt=""
					aria-hidden="true"
					fill
					sizes="100vw"
					className="object-cover object-bottom"
					priority
				/>
				<nav
					id="site-menu"
					aria-label="Primary"
					className="relative flex h-full w-full items-center justify-center"
				>
					<ul className="flex flex-col items-center gap-6 text-xl font-semibold text-[#120d0d]">
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
											<ul className="mt-4 mb-4 flex flex-col items-center gap-4 text-base">
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
															className="font-normal text-[#120d0d]"
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
					{/* drop-shadow (not box-shadow) follows the PNG's own alpha
					silhouette instead of this div's rectangular edges, so the
					shadow traces the curve rather than the invisible straight
					sides of the box. */}
					<div className="relative h-full w-[360px] drop-shadow-[-6px_6px_20px_rgba(0,0,0,0.35)] xl:w-[420px]">
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
					<ul className="absolute inset-0 flex flex-col items-end justify-center gap-2 px-10 py-8 text-lg font-semibold text-[#120d0d]">
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
															className="whitespace-nowrap font-normal"
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
