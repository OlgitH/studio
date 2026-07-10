import Link from "next/link";
import BackHomeLink from "../components/BackHomeLink";
import PageMain from "../components/PageMain";

const faqs = [
	{
		question: "What counts as a \"business process\" here?",
		answer:
			"Anything repetitive that eats up your time without needing your judgement every time — replying to routine enquiries, chasing quotes, logging orders, pulling together reports, or moving information between the tools you already use.",
	},
	{
		question: "Do I need to be technical to use this?",
		answer:
			"No. We handle the setup and explain it in plain terms, then hand over something you or your team can run day to day without needing to understand how it works under the hood.",
	},
	{
		question: "Will this replace staff, or just save them time?",
		answer:
			"It's built to save time, not replace people. The aim is to take the repetitive parts off your plate so you and your team can spend more time on the work that actually needs a human.",
	},
	{
		question: "How do we get started?",
		answer:
			"We start with a short conversation about where your time is going and which tasks feel repetitive or draining. From there we scope a fixed-price project to automate the highest-impact ones first.",
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

export default function BusinessProcessesPage() {
	return (
		<>
			<BackHomeLink />
			<PageMain>
				<h1 className="text-3xl font-bold mb-4">AI business processes</h1>

				<p className="mb-8 max-w-2xl font-light">
					Small businesses lose a lot of hours to admin that doesn&apos;t need
					a human eye every time &mdash; replying to the same enquiries,
					chasing paperwork, updating spreadsheets, writing up reports. We use
					AI and simple automation to take that repetitive work off your
					plate, so you can spend your time on the parts of the business that
					actually need you.
				</p>

				<section className="mb-6 max-w-2xl" aria-labelledby="what-we-help-with-heading">
					<h2 id="what-we-help-with-heading" className="text-xl font-semibold mb-2">
						What we help with
					</h2>
					<ul className="list-disc pl-5 space-y-1 font-light">
						<li>Automating repetitive admin tasks and data entry</li>
						<li>AI-assisted handling of routine customer enquiries</li>
						<li>Streamlining reporting, so figures are ready without the chase</li>
						<li>Connecting up the tools you already use, so information stops getting re-typed</li>
						<li>Simple internal tools built around how your business actually works</li>
					</ul>
				</section>

				<section className="mb-8 max-w-2xl" aria-labelledby="why-it-works-heading">
					<h2 id="why-it-works-heading" className="text-xl font-semibold mb-2">
						Why it works
					</h2>
					<p className="font-light">
						Time-poor businesses don&apos;t need more software &mdash; they
						need fewer manual steps. By automating the repetitive parts first,
						you get time back straight away, and every process we streamline
						compounds into hours saved every single week.
					</p>
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
			</PageMain>
		</>
	);
}
