import type { ReactNode } from "react";

// The site's central hero-width column (max-w-4xl) — this used to be baked
// into PageMain itself, but PageMain is now full width so pages can also
// render full-bleed children (ContentSection, ServiceSplash) alongside it.
// Wrap a page's width-capped content in this. For the narrower max-w-2xl
// text-column width, see ContentSection's own .content-container instead.
export default function PageContainer({
	children,
	className = "",
}: {
	children: ReactNode;
	className?: string;
}) {
	return (
		<div className={`relative mx-auto w-full max-w-4xl px-6 md:px-8 ${className}`}>
			{children}
		</div>
	);
}
