import type { Metadata } from "next";
import Link from "next/link";
import BackHomeLink from "../components/BackHomeLink";
import PageMain from "../components/PageMain";
import CtaButton from "../components/CtaButton";
import BookCallButton from "../components/BookCallButton";
import PageBgImage from "../components/PageBgImage";
import PageContainer from "../components/PageContainer";

export const metadata: Metadata = {
	title: "Pricing | Greencrown Studio",
	description:
		"How much does a website cost? Fixed, time-based pricing for website builds, monthly care and growth plans, and one-to-one training, all tailored to your business. Contact us for a quote.",
};

type Plan = {
	name: string;
	hours: string;
	included: string;
	recommended?: boolean;
};

const wordpressPlans: Plan[] = [
	{
		name: "Basic",
		hours: "—",
		included:
			"Hosting, one backup a month and automatic WordPress core security updates. Plugin updates, fixes, changes and recovering a hacked or broken site are charged separately at our hourly rate.",
	},
	{
		name: "Care",
		hours: "1",
		included:
			"Everything in Basic, plus weekly backups, plugin updates, and restoring your site from backup if it breaks or is hacked. Extra clean-up uses your monthly hour first, then our hourly rate.",
	},
	{
		name: "Plus",
		hours: "4",
		included:
			"Everything in Care, with 4 hours a month for changes, a blog post or a small feature.",
	},
	{
		name: "Growth",
		hours: "7",
		included:
			"Everything in Plus, with 7 hours a month for design changes, new features and SEO content.",
		recommended: true,
	},
	{
		name: "Pro",
		hours: "16",
		included:
			"Everything in Growth, plus priority turnaround (within 2 working days) and a monthly check-in call.",
	},
	{
		name: "Partner",
		hours: "32",
		included:
			"Everything in Pro, plus same-week delivery of larger features and a quarterly strategy and SEO review.",
	},
];

const payloadPlans: Plan[] = [
	{
		name: "Care",
		hours: "1",
		included:
			"Vercel hosting and database, database backups, Payload and security updates (tested before release) and 1 hour of changes.",
	},
	{
		name: "Plus",
		hours: "4",
		included:
			"Everything in Care, with 4 hours a month for changes, a blog post or a small feature.",
	},
	{
		name: "Growth",
		hours: "7",
		included:
			"Everything in Plus, with 7 hours a month for design changes, new features and SEO content.",
		recommended: true,
	},
	{
		name: "Pro",
		hours: "16",
		included:
			"Everything in Growth, plus priority turnaround (within 2 working days) and a monthly check-in call.",
	},
	{
		name: "Partner",
		hours: "32",
		included:
			"Everything in Pro, plus same-week delivery of larger features and a quarterly strategy and SEO review.",
	},
];

const faqs = [
	{
		question: "How much does a website cost?",
		answer:
			"Honestly? Nobody can say up front — it's a bit like asking how long a piece of string is, since every business needs something different. What we can tell you is how we price it: a fixed, time-based cost for building your site, agreed before any work starts, followed by a monthly plan if you want your site looked after and kept evolving. Contact us and we'll put together a tailored quote.",
	},
	{
		question: "How is a website build priced?",
		answer:
			"On a day rate. We scope how many days your build needs and agree the total upfront, and the more days booked, the lower the day rate. Get in touch for a tailored quote.",
	},
	{
		question: "Is the price agreed before you start work?",
		answer:
			"Yes. We scope out how many days your build will need and agree a fixed total cost upfront, so there are no surprises once work begins.",
	},
	{
		question: "What happens after the site is built?",
		answer:
			"Most clients move on to a monthly plan. Plans range from simple hosting and security through to several days a month of changes, content and SEO work. Growth is the one we recommend for most businesses. Contact us and we'll tailor a plan to your site.",
	},
	{
		question: "What's the difference between WordPress and Payload plans?",
		answer:
			"WordPress sites can be kept secure with automatic core updates, so there's a low-cost Basic tier for hosting and security. Payload sites need regular tested updates to avoid breaking on the next deploy, so Care is the minimum. Features on Payload are built rather than installed as plugins, so they come out of your plan hours or are quoted separately.",
	},
	{
		question: "Do unused hours roll over?",
		answer:
			"No. Hours are for each month and don't roll over. All plans can be cancelled at any time.",
	},
	{
		question: "What if I need more than my plan includes?",
		answer:
			"Anything outside your plan is charged at our hourly rate. On WordPress Basic, if your site is hacked or breaks, getting it working again is charged by the hour, and a hack clean-up typically takes 2 to 4 hours. Care and above include restoring from backup.",
	},
	{
		question: "Can you move my site from WordPress to Payload?",
		answer:
			"Yes. On a Pro or Partner plan, your monthly hours can cover a migration over a couple of months instead of a one-off rebuild fee. If you ever want to take a Payload site elsewhere, we hand over the code repository and transfer the Vercel project. Support after handover is charged by the hour.",
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
	// No prices: everything is quoted per client, so each offer just
	// describes the service.
	offers: [
		{
			"@type": "Offer",
			name: "Website build (time-based)",
			description:
				"Fixed, time-based pricing for website builds, agreed upfront, with lower day rates for larger projects.",
		},
		{
			"@type": "Offer",
			name: "WordPress website care plans",
			description:
				"Monthly WordPress hosting, backups and maintenance plans, up to 32 hours a month of changes, content and SEO work.",
		},
		{
			"@type": "Offer",
			name: "Payload website care plans",
			description:
				"Monthly Payload CMS hosting, backups, tested updates and development hours, up to 32 hours a month.",
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

function PlanTable({ plans, caption }: { plans: Plan[]; caption: string }) {
	return (
		<div className="overflow-x-auto">
			<table className="w-full border-collapse text-left font-light">
				<caption className="sr-only">{caption}</caption>
				<thead>
					<tr className="border-b border-white/20">
						<th scope="col" className="py-2 pr-4 font-medium">
							Plan
						</th>
						<th scope="col" className="py-2 pr-4 font-medium">
							Hours / month
						</th>
						<th scope="col" className="py-2 font-medium">
							What&apos;s included
						</th>
					</tr>
				</thead>
				<tbody>
					{plans.map((plan) => (
						<tr key={plan.name} className="border-b border-white/10 align-top">
							<th scope="row" className="py-2 pr-4 font-normal">
								{plan.name}
								{plan.recommended && <span className="block text-sm font-medium">Recommended</span>}
							</th>
							<td className="py-2 pr-4">{plan.hours}</td>
							<td className="py-2">{plan.included}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

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
						Every quote is tailored to your business, so tell us what you need and
						we&apos;ll come back with a clear, fixed price.
					</p>
					<p className="flex flex-wrap items-center gap-3 body-text">
						<CtaButton href="/contact">Contact us for a tailored plan</CtaButton>
						<BookCallButton variant="outline" />
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
						<CtaButton href="/contact">Contact us for a tailored quote</CtaButton>
					</p>
				</section>

				<section className="mb-10 max-w-2xl" aria-labelledby="maintenance-heading">
					<h2 id="maintenance-heading" className="text-xl font-bold mb-2">
						Ongoing maintenance &amp; growth
					</h2>
					<p className="mb-4 body-text">
						Once your site is live, a monthly plan keeps it fast, secure and up to date. Higher
						plans add hours each month for changes, new features, content and SEO, with
						monitoring and reporting on traffic and engagement so you can see your site&apos;s
						real-world impact over time. Choose the plan that matches how your site is built.
					</p>

					<h3 className="text-lg font-bold mt-6 mb-2">WordPress sites</h3>
					<PlanTable plans={wordpressPlans} caption="WordPress monthly plan pricing" />

					<h3 className="text-lg font-bold mt-8 mb-2">Payload sites</h3>
					<p className="mb-2 body-text">
						There&apos;s no Basic tier for Payload: a site that isn&apos;t kept updated is likely
						to break on the next deploy, so Care is the minimum. Features are built rather than
						installed, so they come out of your plan hours or are quoted separately.
					</p>
					<PlanTable plans={payloadPlans} caption="Payload monthly plan pricing" />

					<h3 className="text-lg font-bold mt-8 mb-2">Good to know</h3>
					<ul className="list-disc pl-5 space-y-1 mb-4 font-light">
						<li>Plans are billed monthly. All plans can be cancelled at any time.</li>
						<li>Unused hours don&apos;t roll over.</li>
						<li>Anything outside your plan is charged at our hourly rate.</li>
						<li>
							Moving from WordPress to Payload: Pro or Partner hours can cover the migration over
							a couple of months instead of a one-off rebuild fee.
						</li>
						<li>
							Payload handover: we hand over the code repository and transfer the Vercel project.
							Support after handover is charged by the hour.
						</li>
					</ul>
					<p className="mb-4 body-text">
						Every site is different, so we&apos;ll recommend the right plan for yours and
						tailor it to what you need.
					</p>
					<p className="flex flex-wrap items-center gap-x-6 gap-y-3 body-text">
						<CtaButton href="/contact">Contact us for a tailored plan</CtaButton>
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

				

				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
				/>
				</PageContainer>
			</PageMain>
		</>
	);
}
