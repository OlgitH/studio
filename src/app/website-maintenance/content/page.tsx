import BackHomeLink from "../../components/BackHomeLink";
import PageMain from "../../components/PageMain";
import FaqAccordion from "../../components/FaqAccordion";
import CtaButton from "../../components/CtaButton";
import PageBgImage from "../../components/PageBgImage";

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
			<PageMain
				bgImage={
					<PageBgImage
						src="/bird-blur-3.png"
						width={2000}
						height={1000}
						opacityClassName="opacity-40"
						maxWidthClassName="max-w-4xl"
					/>
				}
			>
				<div className="relative z-10">
				<h1 className="text-3xl font-bold mb-4">Fresh Content</h1>

				<p className="mb-4 body-text">
					Publishing content regularly is one of the most reliable ways to grow your business.
					It gives search engines fresh material to index, gives
					potential customers a reason to keep returning, and builds up a bank of
					pages that keep attracting traffic long after they&apos;re published. A
					website that only gets built once and left alone stops earning its keep
					&mdash; one that&apos;s added to consistently keeps compounding in value.
				</p>

				<section className="mb-10 max-w-2xl" aria-labelledby="why-it-works-heading">
					<h2 id="why-it-works-heading" className="text-2xl font-semibold mb-4">
						Why it works
					</h2>
					<p className="body-text">
						Research into blogging and content marketing consistently backs this up.
						Businesses that blog generate around 67% more leads than those that
						don&apos;t, and marketers who prioritise content are roughly 13x more
						likely to see a positive return on their investment. The businesses
						publishing most often see the biggest gains &mdash; companies posting 16
						or more times a month generate about 4.5x more leads than those posting
						fewer than five.
					</p>
				</section>

				<section className="mb-10 max-w-2xl" aria-labelledby="what-good-looks-like-heading">
					<h2 id="what-good-looks-like-heading" className="text-2xl font-semibold mb-4">
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
					<h2 id="faq-heading" className="text-xl font-semibold mb-4">
						Frequently asked questions
					</h2>
					<FaqAccordion faqs={faqs} />
				</section>

				<p className="mb-8 body-text">
					<CtaButton
						href="https://www.oliverberman.net"
						target="_blank"
						rel="noopener noreferrer"
					>
						Portfolio website
					</CtaButton>
				</p>

				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
				/>
				</div>
			</PageMain>
		</>
	);
}
