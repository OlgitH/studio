"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

// The corner mark is fixed and white, which disappears once a page scrolls a
// white ContentSection underneath it. Past the scroll threshold we fade the
// corner mark out and slide in a StickyHeaderNav-style white bar instead,
// with just the back-home lockup (no page links) in black — via the same
// `invert` trick StickyHeaderNav uses on its logo, since bird-icon.svg is a
// flat white fill. Pages that already manage their own scroll header (e.g.
// bristol-jobs' ScrollHeader) pass scrollBar={false} to opt out.
export default function BackHomeLink({
	scrollBar = true,
}: {
	scrollBar?: boolean;
}) {
	const [scrolled, setScrolled] = useState(false);

	useEffect(() => {
		if (!scrollBar) return;

		const onScroll = () => setScrolled(window.scrollY > 80);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, [scrollBar]);

	return (
		<>
			<Link
				href="/"
				className={`back-home-link transition-opacity duration-200 ${
					scrollBar && scrolled
						? "pointer-events-none opacity-0"
						: "opacity-100"
				}`}
				aria-label="Back home"
			>
				<Image
					src="/bird-icon.svg"
					alt="Greencrown mark"
					width={160}
					height={94}
					priority
				/>
			</Link>

			{scrollBar && (
				<div
					className={`fixed inset-x-0 top-0 z-40 bg-white text-[#120d0d] shadow-[0_2px_12px_rgba(0,0,0,0.15)] transition-transform duration-300 ${
						scrolled
							? "translate-y-0"
							: "pointer-events-none -translate-y-full"
					}`}
				>
					<Link
						href="/"
						aria-label="Back home"
						className="mx-auto flex w-full items-center gap-3 px-[20px] py-[22px] xl:w-[1080px] xl:py-[26px]"
					>
						<Image
							src="/bird-icon.svg"
							alt="Greencrown mark"
							width={56}
							height={28}
							className="h-auto w-14 invert"
						/>
					</Link>
				</div>
			)}
		</>
	);
}
