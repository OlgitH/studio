import type { Metadata } from "next";
import Link from "next/link";
import BackHomeLink from "../components/BackHomeLink";
import PageMain from "../components/PageMain";
import CtaButton from "../components/CtaButton";
import BookCallButton from "../components/BookCallButton";
import PageBgImage from "../components/PageBgImage";
import PageContainer from "../components/PageContainer";
import CarePlanCards from "../components/CarePlanCards";
import FaqAccordion from "../components/FaqAccordion";

export const metadata: Metadata = {
	title: "Pricing | Greencrown Studio",
	description:
		"How much does a website cost? Fixed, time-based quotes for website builds, and WordPress care plans from £60 a month, with tailored plans for custom-built sites. Book a free website review.",
	alternates: { canonical: "/pricing" },
};

// Shown on the page (FaqAccordion) as well as in the FAQ structured data:
// Google expects structured data to match content visitors can see.
const faqs = [
	{
		question: "How much does a website cost?",
		answer:
			"Honestly? Nobody can say up front — it's a bit like asking how long a piece of string is, since every business needs something different. What we can tell you is how we price it: a fixed, time-based cost for building your site, agreed before any work starts, then a monthly care plan from £60 a month if you want your site looked after and kept evolving.",
	},
	{
		question: "How is a website build priced?",
		answer:
			"On a day rate. We scope how many days your build needs and agree the total upfront, and the more days booked, the lower the day rate. Book a free website review and we'll put together a quote.",
	},
	{
		question: "Is the price agreed before you start work?",
		answer:
			"Yes. We scope out how many days your build will need and agree a fixed total cost upfront, so there are no surprises once work begins.",
	},
	{
		question: "What happens after the site is built?",
		answer:
			"Most clients move on to a monthly care plan: Care (£60 a month, 1 hour), Growth (£240 a month, 7 hours) or Pro (£450 a month, 14 hours). Growth is the one we recommend for most businesses. Plus (£150, 4 hours) and Partner (£800, 28 hours) plans are also available, as is hosting-only Basic from £15 a month.",
	},
	{
		question: "Do you look after sites that aren't built on WordPress?",
		answer:
			"Yes. We look after custom-built sites and other platforms on a plan tailored to the site, and can move you off website builders such as Wix, Squarespace or Ionos.",
	},
	{
		question: "Do unused hours roll over?",
		answer:
			"No. Hours are for each month and don't roll over. All plans can be cancelled at any time.",
	},
	{
		question: "What if I need more than my plan includes?",
		answer:
			"Work outside your plan is charged at £60 an hour. On Basic, if your site is hacked or breaks, getting it working again is charged by the hour, and a hack clean-up typically takes 2 to 4 hours. Care and above include restoring from backup.",
	},
	{
		question: "Can you move my site to a new platform?",
		answer:
			"Yes. On a Pro or Partner plan, your monthly hours can cover a migration over a couple of months instead of a one-off rebuild fee. If you ever leave a custom-built site, we hand over the code and hosting, and support after handover is £60 an hour.",
	},
	{
		question: "Do you offer training as well as building sites?",
		answer:
			"Yes, one-to-one training is available if you'd rather learn to do certain tasks yourself, such as updating content or basic coding. Sessions run from an hour to a full day and are tailored to what you need. Contact us to arrange one.",
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

const serviceSchema = {
	"@context": "https://schema.org",
	"@type": "Service",
	serviceType: "Website design, development and maintenance",
	provider: {
		"@type": "Organization",
		name: "Greencrown Studio",
		url: "https://www.greencrown.studio",
	},
	areaServed: "GB",
	// Care plan prices match the cards on the page (CarePlanCards); builds,
	// tailored plans and training are quoted per client, so no price.
	offers: [
		...[
			{ name: "Care", price: "60", hours: 1 },
			{ name: "Growth", price: "240", hours: 7 },
			{ name: "Pro", price: "450", hours: 14 },
		].map((plan) => ({
			"@type": "Offer",
			name: `WordPress care plan: ${plan.name}`,
			description: `Monthly WordPress hosting, backups, updates and ${plan.hours} hour${plan.hours === 1 ? "" : "s"} of changes, content and SEO work.`,
			priceCurrency: "GBP",
			price: plan.price,
			priceSpecification: {
				"@type": "UnitPriceSpecification",
				price: plan.price,
				priceCurrency: "GBP",
				unitText: "MONTH",
			},
		})),
		{
			"@type": "Offer",
			name: "Tailored care plan",
			description:
				"Care plans for custom-built sites and other platforms, tailored to the site.",
		},
		{
			"@type": "Offer",
			name: "Website build (time-based)",
			description:
				"Fixed, time-based pricing for website builds, agreed upfront, with lower day rates for larger projects.",
		},
		{
			"@type": "Offer",
			name: "One-to-one training",
			description: "One-to-one training sessions tailored to your needs.",
		},
	],
};

const structuredData = {
	"@context": "https://schema.org",
	"@graph": [faqSchema, serviceSchema],
};

export default function PricingPage() {
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
				<PageContainer className="z-10">
				<section className="max-w-2xl font-light mb-10" aria-labelledby="pricing-heading">
					<h1 id="pricing-heading" className="text-3xl font-bold mb-4">
						How much does a website cost?
					</h1>
					<p className="mb-4 body-text">
						Honestly? Nobody can say without seeing the details of the site required &mdash; it&apos;s a bit like asking how long a
						piece of string is. Every business needs something different, so a one-size price
						tag would only be a guess.
					</p>
					<p className="mb-4 body-text">
						What we can offer is a predictable way of getting there: a fixed price
						for building your site, agreed before we start, and then &mdash; if you want your
						site to keep evolving and take advantage of website marketing &mdash; an ongoing
						maintenance package to match.
					</p>
					<p className="mb-4 body-text">
						Care plans start at £60 a month. For a build, book a free website
						review and we&apos;ll come back with a clear, fixed price.
					</p>
					<p className="flex flex-wrap items-center gap-3 body-text">
						<BookCallButton />
						<CtaButton href="/contact">Contact us</CtaButton>
					</p>
				</section>

				<section className="mb-10 max-w-2xl" aria-labelledby="build-pricing-heading">
					<h2 id="build-pricing-heading" className="text-xl font-bold mb-2">
						Website builds &mdash; fixed, time-based pricing
					</h2>
					<p className="mb-4 body-text">
						We scope how many days your build needs and agree the total upfront, so
						there are no surprises once work begins. The more days booked, the lower
						the day rate.
					</p>
					<p className="body-text">
						<BookCallButton href="/plan-your-website?plan=build">
							Plan your website
						</BookCallButton>
					</p>
				</section>

				{/* Same cards as /website-maintenance, so prices match site-wide.
				Wider than the text sections so the four cards fit. */}
				<div className="mb-6">
					<CarePlanCards />
				</div>
				<section className="mb-10 max-w-2xl" aria-labelledby="care-notes-heading">
					<h3 id="care-notes-heading" className="text-lg font-bold mb-2">
						Good to know
					</h3>
					<ul className="list-disc pl-5 space-y-1 mb-4 font-light">
						<li>
							Higher plans include monitoring and reporting on traffic and
							engagement, so you can see the real-world impact over time.
						</li>
						<li>
							Custom-built sites are looked after on a tailored plan: features
							are built for your site rather than installed as plugins, and if
							you ever leave, we hand over the code and hosting.
						</li>
						<li>
							Moving to a new platform: Pro or Partner hours can cover the
							migration over a couple of months instead of a one-off rebuild fee.
						</li>
					</ul>
					<p className="body-text">
						<Link href="/website-maintenance" className="underline">
							See what&apos;s included in website maintenance
						</Link>
					</p>
				</section>

				<section className="mb-10 max-w-2xl" aria-labelledby="training-heading">
					<h2 id="training-heading" className="text-xl font-bold mb-2">
						One-to-one training
					</h2>
					<p className="mb-4 body-text">
						Prefer to learn to do some tasks yourself &mdash; updating WordPress posts, coding,
						or even building an AI program? Sessions are tailored to what you need.{" "}
						<Link href="/training" className="underline">
							Read more about training
						</Link>
						.
					</p>
					<p className="mb-4 body-text">
						Sessions run from an hour to a full day.
					</p>
					<p className="body-text">
						<CtaButton href="/contact">Contact us to arrange training</CtaButton>
					</p>
				</section>

				

				<section className="mb-10 max-w-2xl" aria-labelledby="faq-heading">
					<h2 id="faq-heading" className="text-xl font-bold mb-4">
						Frequently asked questions
					</h2>
					<FaqAccordion faqs={faqs} />
				</section>

				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
				/>
				</PageContainer>
			</PageMain>
		</>
	);
}
