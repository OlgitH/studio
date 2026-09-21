type Faq = {
	question: string;
	answer: string;
};

export default function FaqAccordion({ faqs }: { faqs: Faq[] }) {
	return (
		<div className="space-y-2">
			{faqs.map((faq) => (
				<details key={faq.question} className="group">
					<summary className="flex list-none items-center justify-between gap-4 bg-[var(--color-highlight)] px-4 py-3 font-bold text-black cursor-pointer [&::-webkit-details-marker]:hidden">
						<span>{faq.question}</span>
						<svg
							className="h-4 w-4 flex-shrink-0 transition-transform duration-200 group-open:rotate-180"
							viewBox="0 0 20 20"
							fill="none"
							stroke="currentColor"
							strokeWidth={2}
							strokeLinecap="round"
							strokeLinejoin="round"
							aria-hidden="true"
						>
							<path d="M5 7.5L10 12.5L15 7.5" />
						</svg>
					</summary>
					<div className="bg-[#f7f0d4] px-4 py-3 text-[#120d0d]">
						<p className="body-text">{faq.answer}</p>
					</div>
				</details>
			))}
		</div>
	);
}
