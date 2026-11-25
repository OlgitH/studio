import { SOCIAL_LINKS, type SocialId } from "../lib/social";

// Solid brand glyphs (Font Awesome paths), filled in currentColor so they
// read against the circle (white on black, black on lime). Each keeps its own
// viewBox, cropped to the glyph, so they sit centred at the same size.
const ICONS: Record<SocialId, { viewBox: string; path: string }> = {
	instagram: {
		viewBox: "0 32 448 448",
		path: "M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z",
	},
	linkedin: {
		viewBox: "0 0 448 448",
		path: "M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z",
	},
	facebook: {
		viewBox: "0 0 320 512",
		path: "M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z",
	},
};

type SocialLinksProps = {
	/** "column" stacks the buttons, matching the hero's vertical nav list. */
	direction?: "row" | "column";
	size?: "sm" | "md" | "lg";
	/** "lime" for dark backgrounds (e.g. the black hero), where black circles would vanish. */
	tone?: "black" | "lime";
	className?: string;
};

const TONES = {
	black: "bg-black text-white",
	lime: "bg-[var(--color-highlight)] text-black",
};

const SIZES = {
	sm: { button: "h-7 w-7", icon: "h-3 w-3" },
	md: { button: "h-8 w-8", icon: "h-3.5 w-3.5" },
	lg: { button: "h-10 w-10", icon: "h-4 w-4" },
};

export default function SocialLinks({
	direction = "row",
	size = "md",
	tone = "black",
	className = "",
}: SocialLinksProps) {
	const { button, icon } = SIZES[size];

	return (
		<ul
			aria-label="Greencrown Studio on social media"
			className={`flex gap-2 ${direction === "column" ? "flex-col" : "flex-row flex-wrap"} ${className}`}
		>
			{SOCIAL_LINKS.map(({ id, label, href }) => (
				<li key={id}>
					<a
						href={href}
						target="_blank"
						rel="noopener noreferrer"
						aria-label={`${label} (opens in a new tab)`}
						title={label}
						className={`${button} flex items-center justify-center rounded-full ${TONES[tone]} transition-transform duration-200 hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-highlight)]`}
					>
						<svg
							viewBox={ICONS[id].viewBox}
							fill="currentColor"
							aria-hidden="true"
							className={icon}
						>
							<path d={ICONS[id].path} />
						</svg>
					</a>
				</li>
			))}
		</ul>
	);
}
