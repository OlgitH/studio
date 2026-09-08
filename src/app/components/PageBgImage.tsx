import Image from "next/image";

// Below this viewport width the image sits at a fixed pixel size instead of
// shrinking with the viewport; at and above it, it scales as 75vw (capped by
// maxWidthClassName). Keep in sync with the "w-[788px]" / "min-[1051px]"
// values below — Tailwind needs those written out literally to generate the
// CSS, so they can't be built from these constants at runtime.
const VW_BREAKPOINT = 1051;
const VW_FRACTION = 0.75;
const FIXED_MOBILE_PX = 788; // Math.round(VW_BREAKPOINT * VW_FRACTION)

// Pixel value for each max-w-* class this component supports, used only to
// compute the `sizes` attribute (not for the className, which stays literal
// so Tailwind's build-time scan can pick it up).
const MAX_WIDTH_PX = {
	"max-w-2xl": 672,
	"max-w-3xl": 768,
	"max-w-4xl": 896,
} as const;

// Default placement: right-center on mobile (below VW_BREAKPOINT), top-right
// from VW_BREAKPOINT up. Pass `positionClassName` to override per page.
export const TOP_RIGHT_POSITION =
	"top-[50vh] right-0 -translate-y-[50vh] -translate-x-[10vw] origin-top-right ";

type PageBgImageProps = {
	src: string;
	width: number;
	height: number;
	opacityClassName: string;
	maxWidthClassName: keyof typeof MAX_WIDTH_PX;
	positionClassName?: string;
	priority?: boolean;
};

export default function PageBgImage({
	src,
	width,
	height,
	opacityClassName,
	maxWidthClassName,
	positionClassName = TOP_RIGHT_POSITION,
	priority = false,
}: PageBgImageProps) {
	const maxWidthPx = MAX_WIDTH_PX[maxWidthClassName];
	const mobilePx = Math.min(FIXED_MOBILE_PX, maxWidthPx);
	const vwCapBreakpoint = Math.round(maxWidthPx / VW_FRACTION);
	const sizes = `(max-width: ${VW_BREAKPOINT - 1}px) ${mobilePx}px, (max-width: ${vwCapBreakpoint}px) ${VW_FRACTION * 100}vw, ${maxWidthPx}px`;

	return (
		<Image
			src={src}
			alt=""
			width={width}
			height={height}
			sizes={sizes}
			quality={60}
			priority={priority}
			aria-hidden="true"
			className={`absolute z-0 w-[788px] ${maxWidthClassName} h-auto object-contain ${opacityClassName} pointer-events-none ${positionClassName} min-[1051px]:w-full`}
		/>
	);
}
