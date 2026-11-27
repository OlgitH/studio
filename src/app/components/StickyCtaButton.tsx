"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import CtaButton from "./CtaButton";

type StickyCtaButtonProps = {
	href: string;
	children: React.ReactNode;
};

// A CtaButton that stays where it's placed, and once it has scrolled up out
// of view, a copy appears fixed at the bottom right of the screen so the
// call to action is always within reach. Scrolling back up to the original
// hides the copy again.
const noopSubscribe = () => () => {};

export default function StickyCtaButton({
	href,
	children,
}: StickyCtaButtonProps) {
	const ref = useRef<HTMLSpanElement>(null);
	const [stuck, setStuck] = useState(false);
	// The portal target only exists in the browser: false on the server and
	// during hydration, true after, so server and client HTML match.
	const mounted = useSyncExternalStore(
		noopSubscribe,
		() => true,
		() => false,
	);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;

		const observer = new IntersectionObserver(([entry]) => {
			setStuck(!entry.isIntersecting && entry.boundingClientRect.top < 0);
		});

		observer.observe(el);
		return () => observer.disconnect();
	}, []);

	// The inline button is a span (no divs), as this is often placed inside a
	// <p>, where a div is invalid HTML that breaks hydration. The stuck copy is
	// portalled to <body>: page wrappers here use transforms (fade-ins), which
	// would otherwise make "fixed" relative to them instead of the screen.
	return (
		<>
			<span ref={ref} className="inline-block">
				<CtaButton href={href}>{children}</CtaButton>
			</span>
			{/* The stuck copy follows the homepage's floating envelope button:
			charcoal (#2a2424) with lime text, fixed bottom right. */}
			{mounted &&
				createPortal(
					<span
						aria-hidden={!stuck}
						className={`fixed right-4 bottom-4 z-50 block transition-all duration-300 xl:right-5 xl:bottom-5 ${
							stuck
								? "translate-y-0 opacity-100"
								: "pointer-events-none translate-y-4 opacity-0"
						}`}
					>
						<Link
							href={href}
							tabIndex={stuck ? undefined : -1}
							className="flex h-11 items-center rounded-full bg-[#2a2424] px-5 text-sm font-bold text-[var(--color-highlight)] no-underline shadow-md transition-colors hover:bg-[#3a3333]"
						>
							{children}
						</Link>
					</span>,
					document.body,
				)}
		</>
	);
}
