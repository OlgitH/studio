import type { ReactNode } from "react";

export default function PageMain({ children }: { children: ReactNode }) {
	return (
		// overflow-hidden stays on through 1050px to match PageBgImage's
		// VW_BREAKPOINT — below that width the bg image is a fixed pixel size
		// and can overflow horizontally, so it must stay clipped.
		<main className="relative mx-auto flex w-full min-h-dvh max-w-4xl flex-col justify-end overflow-hidden px-6 pb-8 pt-40 md:min-h-0 md:justify-start md:px-8 md:pb-8 min-[1051px]:overflow-visible">
			{children}
		</main>
	);
}
