import type { ReactNode } from "react";
import FadeInOnView from "./FadeInOnView";

// Unlike PageMain, this is full viewport width with no max-w cap and no
// overflow clipping — blog sections need to span edge-to-edge themselves
// rather than break out of a narrower, clipped parent.
export default function PageBlog({ children }: { children: ReactNode }) {
	return (
		<main className="relative flex w-full min-h-dvh flex-col pt-40 pb-8">
			<FadeInOnView>{children}</FadeInOnView>
		</main>
	);
}
