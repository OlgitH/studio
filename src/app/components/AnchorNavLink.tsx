"use client";

import Link from "next/link";
import type { ReactNode } from "react";

type AnchorNavLinkProps = {
	targetId: string;
	className?: string;
	children: ReactNode;
};

// A same-page #hash Link that always re-scrolls to its target, even when
// the URL is already on that hash (a bare <a href="#x"> only scrolls on
// hashchange, so clicking it again after scrolling away does nothing).
export default function AnchorNavLink({
	targetId,
	className,
	children,
}: AnchorNavLinkProps) {
	return (
		<Link
			href={`#${targetId}`}
			className={className}
			onClick={(event) => {
				const el = document.getElementById(targetId);
				if (!el) return;

				event.preventDefault();
				el.scrollIntoView({ behavior: "smooth", block: "start" });
				history.pushState(null, "", `#${targetId}`);
			}}
		>
			{children}
		</Link>
	);
}
