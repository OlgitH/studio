import type { ReactNode } from "react";

export type ContentSectionVariant = "standard" | "white" | "lime" | "mauve";
export type ContentSectionWidth = "narrow" | "wide";

const VARIANT_CLASSES: Record<ContentSectionVariant, string> = {
	standard: "",
	white: "bg-white text-[#120d0d]",
	lime: "bg-[var(--color-highlight)] text-[#120d0d]",
	mauve: "bg-[#f7f0d4] text-[#120d0d]",
};

// "narrow" is the .content-container text-column width (max-w-2xl), used by
// BlogSection. "wide" matches PageContainer's hero width (max-w-4xl) for
// bands that need to align with a PageContainer-wrapped section above them.
const WIDTH_CLASSES: Record<ContentSectionWidth, string> = {
	narrow: "content-container",
	wide: "mx-auto w-full max-w-4xl px-6 md:px-8",
};

// Full-width coloured band with a centred content column inside it. Used by
// BlogSection for parsed markdown, and free to reuse on any other page that
// wants the same standard/white/lime/mauve banding around plain JSX.
export default function ContentSection({
	variant,
	width = "narrow",
	className = "",
	children,
}: {
	variant: ContentSectionVariant;
	width?: ContentSectionWidth;
	className?: string;
	children: ReactNode;
}) {
	return (
		<section className={`w-full py-10 ${VARIANT_CLASSES[variant]} ${className}`}>
			<div className={WIDTH_CLASSES[width]}>{children}</div>
		</section>
	);
}
