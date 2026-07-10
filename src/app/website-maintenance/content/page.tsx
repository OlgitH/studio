import BackHomeLink from "../../components/BackHomeLink";
import Link from "next/link";

const faqs = [
	{
		question: "Why does publishing content regularly help a business grow?",
		answer:
			"Fresh content gives search engines a reason to keep crawling and re-ranking your site, and gives visitors a reason to keep coming back. Businesses that blog consistently generate around 67% more leads than those that don't.",
	},
	{
		question: "How often should we be publishing?",
		answer:
			"Most businesses see a real return from around 2-4 pieces a month, but the strongest results come at higher frequency: companies publishing 16+ posts a month generate roughly 4.5x more leads than those publishing less than five.",
	},
	{
		question: "Isn't quality more important than quantity?",
		answer:
			"Yes, and it's not a trade-off — both matter. A steady publishing schedule of well-researched, genuinely useful content consistently outperforms occasional posts, and outperforms frequent shallow ones too.",
	},
	{
		question: "What kind of content actually moves the needle?",
		answer:
			"Content that answers real questions your customers are asking, backed by expertise, keeps working long after it's published, driving organic traffic and enquiries without you having to pay for that same visibility every month.",
	},
];

const faqSchema = {
	"@context": "https://schema.org",
	"@type": "FAQPage",
	mainEntity: faqs.map((faq) => ({
		"@type": "Question",
		name: faq.question,
		acceptedAnswer: {
			"@type": "Answer",
			text: faq.answer,
		},
	})),
};

export default function ContentGrowthPage() {
	return (
		<>
			<BackHomeLink />
			<main className="mx-auto flex min-h-dvh max-w-4xl flex-col justify-end overflow-hidden p-6 pb-8 pt-24 md:min-h-0 md:justify-start md:overflow-visible md:p-8">
				<h1 className="text-3xl font-bold mb-4">Fresh Content</h1>

				<p className="mb-4 max-w-2xl font-light">
					Publishing content regularly is one of the most reliable ways to grow your business. 
					It gives search engines fresh material to index, gives
					potential customers a reason to keep returning, and builds up a bank of
					pages that keep attracting traffic long after they&apos;re published. A
					website that only gets built once and left alone stops earning its keep
					&mdash; one that&apos;s added to consistently keeps compounding in value.
				</p>

				<section className="mb-6 max-w-2xl" aria-labelledby="why-it-works-heading">
					<h2 id="why-it-works-heading" className="text-xl font-semibold mb-2">
						Why it works
					</h2>
					<p className="font-light">
						Research into blogging and content marketing consistently backs this up.
						Businesses that blog generate around 67% more leads than those that
						don&apos;t, and marketers who prioritise content are roughly 13x more
						likely to see a positive return on their investment. The businesses
						publishing most often see the biggest gains &mdash; companies posting 16
						or more times a month generate about 4.5x more leads than those posting
						fewer than five.
					</p>
				</section>

				<section className="mb-6 max-w-2xl" aria-labelledby="what-good-looks-like-heading">
					<h2 id="what-good-looks-like-heading" className="text-xl font-semibold mb-2">
						What good, regular content looks like
					</h2>
					<ul className="list-disc pl-5 space-y-1 font-light">
						<li>Answers questions your customers are actually asking</li>
						<li>Published on a consistent, sustainable schedule</li>
						<li>Well-researched and genuinely useful, not just filler</li>
						<li>Linked into the rest of your site so it supports other pages</li>
						<li>Reviewed and refreshed over time, not left to go stale</li>
					</ul>
				</section>

				<section className="mb-8 max-w-2xl" aria-labelledby="faq-heading">
					<h2 id="faq-heading" className="text-xl font-semibold mb-2">
						Frequently asked questions
					</h2>
					<dl className="space-y-4">
						{faqs.map((faq) => (
							<div key={faq.question}>
								<dt className="font-light text-[#e3ffb3]">{faq.question}</dt>
								<dd className="font-light mt-1">{faq.answer}</dd>
							</div>
						))}
					</dl>
				</section>

				<p className="mb-8">
					<Link
						href="https://www.oliverberman.net"
						className="underline"
						target="_blank"
						rel="noopener noreferrer"
					>
						Website portfolio
					</Link>
				</p>

				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
				/>
			</main>
		</>
	);
}
