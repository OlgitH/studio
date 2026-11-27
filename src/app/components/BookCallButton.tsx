// Cal.com booking link for a free website review call. Kept here so every
// button on the site points at the same event.
export const BOOKING_URL = "https://cal.com/olly-berman/website-review";

type BookCallButtonProps = {
	/**
	 * "solid" matches CtaButton; "outline" sits beside a CtaButton as the
	 * secondary action; "link" is bold lime text with no button shape or icon
	 * (the homepage hero).
	 * "charcoal" is bold lime text on a pill only just lighter than the page
	 * background (the homepage hero).
	 */
	variant?: "solid" | "outline" | "link" | "charcoal";
	children?: React.ReactNode;
	className?: string;
};

export default function BookCallButton({
	variant = "solid",
	children = "Book a free website review",
	className = "",
}: BookCallButtonProps) {
	const link = variant === "link";
	const iconless = link || variant === "charcoal";
	const variantClasses = {
		solid:
			"rounded-full px-6 py-2 bg-white text-black hover:bg-[var(--color-highlight)]",
		outline:
			"rounded-full px-6 py-2 border border-white text-white hover:border-[var(--color-highlight)] hover:text-[var(--color-highlight)]",
		link: "text-[var(--color-highlight)] underline-offset-4 hover:underline",
		charcoal:
			"rounded-full px-6 py-2 bg-[#2a2424] text-[var(--color-highlight)] no-underline hover:bg-[#3a3333]",
	}[variant];

	return (
		<a
			href={BOOKING_URL}
			target="_blank"
			rel="noopener noreferrer"
			className={`inline-flex items-center gap-2 font-bold transition-colors ${link ? "" : "no-underline"} ${variantClasses} ${className}`}
		>
			{!iconless && (
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					aria-hidden="true"
					className="h-4 w-4"
				>
					<rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
					<line x1="16" y1="2" x2="16" y2="6" />
					<line x1="8" y1="2" x2="8" y2="6" />
					<line x1="3" y1="10" x2="21" y2="10" />
				</svg>
			)}
			{children}
			<span className="sr-only"> (opens in a new tab)</span>
		</a>
	);
}
