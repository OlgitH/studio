import type { ReactNode } from "react";
import FadeInOnView from "./FadeInOnView";

export default function PageMain({
	children,
	bgImage,
}: {
	children: ReactNode;
	bgImage?: ReactNode;
}) {
	return (
		// Full width, no cap: full-bleed children (ContentSection,
		// ServiceSplash) can then sit alongside PageContainer-wrapped content
		// and still share this one <main> landmark. Anything that wants the
		// site's central hero width wraps itself in PageContainer instead.
		//
		// overflow-hidden stays on through 1050px to match PageBgImage's
		// VW_BREAKPOINT — below that width the bg image is a fixed pixel size
		// and can overflow horizontally, so it must stay clipped.
		<main className="relative flex w-full min-h-dvh flex-col justify-end overflow-hidden pb-8 pt-40 md:min-h-0 md:justify-start min-[1051px]:overflow-visible">
			{/* Rendered outside FadeInOnView: that wrapper carries a translate-y
			transform for its fade/slide-in animation, which would otherwise
			become the containing block for the bg image's absolute positioning
			— and since it's also the flex item pushed around by justify-end/
			justify-start above, the image's position would drift depending on
			how tall each page's content is. */}
			{bgImage}
			<FadeInOnView>{children}</FadeInOnView>
		</main>
	);
}
