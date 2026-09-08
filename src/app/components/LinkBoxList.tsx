import Link from "next/link";

type LinkBoxItem = {
	label: string;
	href?: string;
};

export default function LinkBoxList({ items }: { items: LinkBoxItem[] }) {
	return (
		<ul className="space-y-2">
			{items.map(({ label, href }) =>
				href ? (
					<li key={label}>
						<Link
							href={href}
							className="flex items-center justify-between gap-4 bg-[var(--color-highlight)] px-4 py-3 font-bold text-black underline"
						>
							<span>{label}</span>
							<svg
								className="h-4 w-4 flex-shrink-0"
								viewBox="0 0 20 20"
								fill="none"
								stroke="currentColor"
								strokeWidth={2}
								strokeLinecap="round"
								strokeLinejoin="round"
								aria-hidden="true"
							>
								<path d="M7.5 5L12.5 10L7.5 15" />
							</svg>
						</Link>
					</li>
				) : (
					<li
						key={label}
						className="bg-[var(--color-highlight)] px-4 py-3 font-bold text-black"
					>
						{label}
					</li>
				),
			)}
		</ul>
	);
}
