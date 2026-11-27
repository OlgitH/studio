"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

// Appears once the hero's contact details (#hero-contact) have scrolled out
// of view above the viewport, so these shortcuts are only offered once the
// email/phone themselves are no longer on screen: an envelope button to the
// contact page.
export default function FloatingContactButtons() {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const target = document.getElementById("hero-contact");
		if (!target) return;

		const observer = new IntersectionObserver(([entry]) => {
			setVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0);
		});

		observer.observe(target);
		return () => observer.disconnect();
	}, []);

	return (
		<div
			className={`fixed right-4 bottom-4 z-50 flex flex-col items-end gap-3 transition-all duration-300 xl:right-5 xl:bottom-5 ${
				visible
					? "translate-y-0 opacity-100"
					: "pointer-events-none translate-y-4 opacity-0"
			}`}
		>
			{/* One envelope button in place of separate Call / Email pills. It
			goes to the contact page, which has both the phone number and the
			email address. Charcoal with a lime icon (#2a2424), matching the site's
			booking button style. */}
			<Link
				href="/contact"
				aria-label="Contact us"
				title="Contact us"
				className="flex h-11 w-11 items-center justify-center rounded-full bg-[#2a2424] text-[var(--color-highlight)] shadow-md transition-colors hover:bg-[#3a3333]"
			>
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					aria-hidden="true"
					className="h-5 w-5"
				>
					<rect x="2" y="4" width="20" height="16" rx="2" />
					<polyline points="22 6 12 13 2 6" />
				</svg>
			</Link>
		</div>
	);
}
