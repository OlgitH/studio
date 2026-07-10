import BackHomeLink from "../../components/BackHomeLink";
import Link from "next/link";

const faqs = [
	{
		question: "What does website monitoring actually involve?",
		answer:
			"It means regularly reviewing traffic, engagement and search performance data after a site goes live, then using those findings to guide updates, fixes and content changes.",
	},
	{
		question: "How often will I get updates?",
		answer:
			"Reporting is typically monthly, though we can review more frequently around launches, campaigns or seasonal peaks if that suits your business better.",
	},
	{
		question: "Why does ongoing monitoring matter for SEO?",
		answer:
			"Search engines reward sites that keep improving. Tracking rankings and visitor behaviour lets us spot drops early and act before they cost you traffic or enquiries.",
	},
	{
		question: "Can you focus on a specific target audience?",
		answer:
			"Yes. We can segment reporting around a particular audience, location or campaign, so you can see exactly how that group is engaging with your site.",
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

export default function MonitoringProgressPage() {
	return (
		<>
			<BackHomeLink />
			<main className="mx-auto flex min-h-dvh max-w-4xl flex-col justify-end overflow-hidden p-6 pb-8 pt-24 md:min-h-0 md:justify-start md:overflow-visible md:p-8">
				<h1 className="text-3xl font-bold mb-4">Monitoring website improvements</h1>

				<p className="mb-4 max-w-2xl font-light">
					Website monitoring is the ongoing practice of tracking how a site performs after
					launch, measuring traffic, engagement and search visibility so improvements are
					made on real data rather than guesswork. A successful website needs regular
					maintenance, frequent updates and honest reviews, so it&apos;s crucial you can
					actually see the changes happening &mdash; whether that&apos;s overall visitor
					numbers or growth from a specific target audience you care about. We handle that
					tracking for you.
				</p>

				<section className="mb-6 max-w-2xl" aria-labelledby="what-we-track-heading">
					<h2 id="what-we-track-heading" className="text-xl font-semibold mb-2">
						What we track
					</h2>
					<ul className="list-disc pl-5 space-y-1 font-light">
						<li>Traffic and visitor trends over time</li>
						<li>Engagement from your target audience</li>
						<li>Search engine rankings and visibility</li>
						<li>Page speed and Core Web Vitals</li>
						<li>Conversions &mdash; enquiries, sign-ups and sales</li>
					</ul>
				</section>

				<section className="mb-6 max-w-2xl" aria-labelledby="why-it-matters-heading">
					<h2 id="why-it-matters-heading" className="text-xl font-semibold mb-2">
						Why ongoing monitoring matters
					</h2>
					<p className="font-light">
						A website isn&apos;t a one-off project &mdash; it&apos;s a living asset. Search
						engines and visitor behaviour shift constantly, so a site that isn&apos;t
						reviewed regularly can quietly lose rankings and traffic without you ever
						knowing why. Monitoring closes that gap: it catches small issues early, proves
						what&apos;s working, and gives us the evidence to prioritise the next round of
						improvements.
					</p>
				</section>

				<section className="mb-8 max-w-2xl" aria-labelledby="faq-heading">
					<h2 id="faq-heading" className="text-xl font-semibold mb-2">
						Frequently asked questions
					</h2>
					<dl className="space-y-4">
						{faqs.map((faq) => (
							<div key={faq.question}>
								<dt className="font-medium">{faq.question}</dt>
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
