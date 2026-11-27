// Cal.com booking link for a website analysis call. Kept here so every
// button on the site points at the same event.
export const BOOKING_URL = "https://cal.com/olly-berman/website-analysis";

type BookCallButtonProps = {
	/** "solid" matches CtaButton; "outline" sits beside a CtaButton as the secondary action. */
	variant?: "solid" | "outline";
	children?: React.ReactNode;
	className?: string;
};

export default function BookCallButton({
	variant = "solid",
	children = "Book a website analysis",
	className = "",
}: BookCallButtonProps) {
	const variantClasses =
		variant === "solid"
			? "bg-white text-black hover:bg-[var(--color-highlight)]"
			: "border border-white text-white hover:border-[var(--color-highlight)] hover:text-[var(--color-highlight)]";

	return (
		<a
			href={BOOKING_URL}
			target="_blank"
			rel="noopener noreferrer"
			className={`inline-flex items-center gap-2 rounded-full px-6 py-2 font-bold no-underline transition-colors ${variantClasses} ${className}`}
		>
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
			{children}
			<span className="sr-only"> (opens in a new tab)</span>
		</a>
	);
}
