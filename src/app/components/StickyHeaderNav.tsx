"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Logo from "@/../public/logo/logo-white-no-bird.svg";
import AnchorNavLink from "./AnchorNavLink";

// Fixed copy of the hero's logo + nav row, revealed once #hero-nav (the
// hero's own copy) has scrolled out of view above the viewport, so the
// links stay reachable while scrolling through the lower sections.
export default function StickyHeaderNav() {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const target = document.getElementById("hero-nav");
		if (!target) return;

		const observer = new IntersectionObserver(([entry]) => {
			setVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0);
		});

		observer.observe(target);
		return () => observer.disconnect();
	}, []);

	return (
		<div
			className={`fixed inset-x-0 top-0 z-40 hidden bg-white text-[#120d0d] shadow-[0_2px_12px_rgba(0,0,0,0.15)] transition-transform duration-300 sm:block ${
				visible ? "translate-y-0" : "pointer-events-none -translate-y-full"
			}`}
		>
			<div className="mx-auto flex w-full items-center justify-between gap-8 px-[20px] py-[22px] xl:w-[1080px] xl:py-[26px]">
				<Image
					src={Logo}
					alt="Greencrown Studio"
					width={140}
					className="h-auto w-36 invert"
				/>
				<nav aria-label="Primary" className="primary-nav">
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
					</ul>
				</nav>
			</div>
		</div>
	);
}
