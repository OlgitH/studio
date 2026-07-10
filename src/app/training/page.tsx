import Link from "next/link";
import BackHomeLink from "../components/BackHomeLink";

const faqs = [
	{
		question: "Do I need any technical background?",
		answer:
			"No. Sessions start from wherever you're at, whether that's your first time editing a website or you already have some coding experience.",
	},
	{
		question: "What can a session cover?",
		answer:
			"Anything from updating content and posts yourself, to basic HTML and CSS, to getting comfortable using AI tools day to day, to understanding the traffic and engagement reports we send as part of maintenance.",
	},
	{
		question: "Can sessions be tailored to a specific tool or task?",
		answer:
			"Yes. Tell us what you're trying to achieve and we'll build the session around it, rather than a generic curriculum.",
	},
	{
		question: "What if I need more than one session?",
		answer:
			"That's fine — most people book a single session to start, then come back as new questions come up. There's no ongoing commitment required.",
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

export default function TrainingPage() {
	return (
		<>
			<BackHomeLink />
			<main className="mx-auto flex min-h-dvh max-w-4xl flex-col justify-end overflow-hidden p-6 pb-8 pt-24 md:min-h-0 md:justify-start md:overflow-visible md:p-8">
				<h1 className="text-3xl font-bold mb-4">One-to-one training</h1>

				<p className="mb-8 max-w-2xl font-light">
					Prefer to learn to do certain tasks yourself rather than hand them
					off? One-to-one training sessions are tailored to what you need,
					so you leave able to do it again on your own next time.
				</p>

				<section className="mb-6 max-w-2xl" aria-labelledby="what-sessions-cover-heading">
					<h2 id="what-sessions-cover-heading" className="text-xl font-semibold mb-2">
						What sessions can cover
					</h2>
					<ul className="list-disc pl-5 space-y-1 font-light">
						<li>Updating content and posts on your own website</li>
						<li>Basic HTML and CSS</li>
						<li>Using AI tools confidently in your day-to-day work</li>
						<li>Reading and understanding your traffic and engagement reports</li>
					</ul>
				</section>

				<section className="mb-8 max-w-2xl" aria-labelledby="pricing-heading">
					<h2 id="pricing-heading" className="text-xl font-semibold mb-2">
						Pricing
					</h2>
					<p className="font-light">
						Sessions run from £60 for an hour up to £360 for a full day. See
						the{" "}
						<Link href="/pricing" className="underline">
							full training pricing
						</Link>{" "}
						for details.
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
			</main>
		</>
	);
}
