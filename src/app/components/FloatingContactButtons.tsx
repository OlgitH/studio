"use client";

import { useEffect, useState } from "react";

// Appears once the hero's contact details (#hero-contact) have scrolled out
// of view above the viewport, so these shortcuts are only offered once the
// email/phone themselves are no longer on screen.
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

	const buttonClassName =
		"rounded-full bg-white px-5 py-3 text-sm font-bold text-black shadow-md";

	return (
		<div
			className={`fixed right-4 bottom-4 z-50 flex flex-col items-end gap-3 transition-all duration-300 xl:right-5 xl:bottom-5 ${
				visible
					? "translate-y-0 opacity-100"
					: "pointer-events-none translate-y-4 opacity-0"
			}`}
		>
			<a href="tel:+01225699150" className={buttonClassName}>
				Call now
			</a>
			<a href="mailto:olly@greencrown.studio" className={buttonClassName}>
				Email
			</a>
		</div>
	);
}
