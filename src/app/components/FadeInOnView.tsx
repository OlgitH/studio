"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

type FadeInOnViewProps = {
	children: ReactNode;
	className?: string;
	threshold?: number;
};

export default function FadeInOnView({
	children,
	className = "",
	threshold = 0,
}: FadeInOnViewProps) {
	const ref = useRef<HTMLDivElement>(null);
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setIsVisible(true);
					observer.unobserve(el);
				}
			},
			{ threshold },
		);
		observer.observe(el);
		return () => observer.disconnect();
	}, [threshold]);

	return (
		<div
			ref={ref}
			className={`transition-all duration-700 ease-out ${
				isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
			} ${className}`}
		>
			{children}
		</div>
	);
}
