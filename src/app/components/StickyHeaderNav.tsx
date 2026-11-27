"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Logo from "@/../public/logo/logo-white-no-bird.svg";
import AnchorNavLink from "./AnchorNavLink";
import { SocialIcon } from "./SocialLinks";
import { SOCIAL_LINKS } from "../lib/social";

// Fixed copy of the hero's logo + nav row, revealed once #hero (the
// original hero viewport) has scrolled out of view above the viewport, so
// the links stay reachable while scrolling through the lower sections. On
// mobile the nav links are dropped (the burger menu covers those) and only
// the logo shows, since #hero-nav itself is hidden below the sm breakpoint.
// The social icons sit at the end of the row (from sm up; on mobile they're
// in the burger menu). Right padding keeps the row clear of the fixed burger
// button, and the nav only appears from lg up where it fits beside it.
export default function StickyHeaderNav() {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const target = document.getElementById("hero");
		if (!target) return;

		// Trigger slightly before #hero's bottom actually reaches the
		// viewport top, so the slide-in finishes right as the black section
		// ends, instead of visibly lagging behind it.
		const observer = new IntersectionObserver(
			([entry]) => {
				setVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0);
			},
			{ rootMargin: "-180px 0px 0px 0px" },
		);

		observer.observe(target);
		return () => observer.disconnect();
	}, []);

	return (
		<>
			<div
				className={`fixed inset-x-0 top-0 z-40 bg-white text-[#120d0d] shadow-[0_2px_12px_rgba(0,0,0,0.15)] transition-transform duration-150 ${
					visible ? "translate-y-0" : "pointer-events-none -translate-y-full"
				}`}
			>
				<div className="mx-auto flex w-full items-center justify-between gap-8 pl-[20px] pr-[20px] py-[22px] sm:pr-[110px] xl:w-[1080px] xl:pr-[20px] xl:py-[26px]">
					<Image
						src={Logo}
						alt="Greencrown Studio"
						width={140}
						className="h-auto w-36 invert"
					/>
					<nav aria-label="Primary" className="primary-nav hidden lg:block">
						<ul className="flex items-center gap-6 text-base font-light">
							<li>
								<Link href="/about">about</Link>
							</li>
							<li>
								<AnchorNavLink
									targetId="website-maintenance"
									className="whitespace-nowrap"
								>
									website maintenance
								</AnchorNavLink>
							</li>
							<li>
								<AnchorNavLink
									targetId="business-processes"
									className="whitespace-nowrap"
								>
									AI business processes
								</AnchorNavLink>
							</li>
							<li>
								<AnchorNavLink targetId="training">training</AnchorNavLink>
							</li>
							<li>
								<AnchorNavLink
									targetId="case-studies"
									className="whitespace-nowrap"
								>
									case studies
								</AnchorNavLink>
							</li>
						</ul>
					</nav>
					<ul
						aria-label="Greencrown Studio on social media"
						className="hidden items-center gap-3 sm:flex"
					>
						{SOCIAL_LINKS.map(({ id, label, href }) => (
							<li key={id}>
								<a
									href={href}
									target="_blank"
									rel="noopener noreferrer"
									aria-label={`${label} (opens in a new tab)`}
									title={label}
									className="flex h-7 items-center transition-opacity hover:opacity-60"
								>
									<SocialIcon id={id} className="h-[18px] w-auto" />
								</a>
							</li>
						))}
					</ul>
				</div>
			</div>

			{/* Back to top: a small white quarter circle in the bottom-left
			corner with a dark arrow, shown and hidden along with this header.
			It's outside the header div because the header's translate would
			otherwise make "fixed" relative to the header, not the screen. */}
			<button
				type="button"
				onClick={() =>
					window.scrollTo({
						top: 0,
						behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
							.matches
							? "auto"
							: "smooth",
					})
				}
				aria-label="Back to top"
				title="Back to top"
				tabIndex={visible ? undefined : -1}
				className={`fixed bottom-0 left-0 z-40 h-[40px] w-[40px] cursor-pointer rounded-tr-full bg-white text-[#120d0d] shadow-[0_0_12px_rgba(0,0,0,0.15)] transition-opacity duration-150 hover:text-black/60 ${
					visible ? "opacity-100" : "pointer-events-none opacity-0"
				}`}
			>
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2.5"
					strokeLinecap="round"
					strokeLinejoin="round"
					aria-hidden="true"
					className="absolute bottom-[8px] left-[8px] h-3.5 w-3.5"
				>
					<line x1="12" y1="19" x2="12" y2="5" />
					<polyline points="5 12 12 5 19 12" />
				</svg>
			</button>
		</>
	);
}
