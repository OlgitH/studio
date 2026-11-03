import type { Metadata } from "next";
import Link from "next/link";
import BackHomeLink from "../components/BackHomeLink";
import PageMain from "../components/PageMain";
import CtaButton from "../components/CtaButton";
import PageBgImage from "../components/PageBgImage";
import PageContainer from "../components/PageContainer";

export const metadata: Metadata = {
	title: "Pricing | Greencrown Studio",
	description:
		"How much does a website cost? Fixed, time-based pricing for builds from £280/day, monthly care plans from £15 (WordPress) or £60 (Payload), and one-to-one training.",
};

const buildPricing = [
	{ days: "1 day", cost: "£280", notes: "Standard rate (£280/day)" },
	{ days: "2 days", cost: "£560", notes: "Standard rate (£280/day)" },
	{ days: "3 days", cost: "£825", notes: "£275/day" },
	{ days: "4 days", cost: "£1,080", notes: "£270/day" },
	{ days: "5 days", cost: "£1,325", notes: "£265/day" },
	{ days: "6 days", cost: "£1,560", notes: "£260/day" },
	{ days: "8 days", cost: "£2,000", notes: "£250/day" },
	{ days: "9 days", cost: "£2,205", notes: "£245/day" },
	{ days: "10 days", cost: "£2,400", notes: "£240/day" },
	{ days: "12 days", cost: "£2,760", notes: "£230/day" },
	{ days: "15 days", cost: "£3,300", notes: "£220/day (max discount)" },
];

type Plan = {
	name: string;
	price: string;
	hours: string;
	included: string;
	recommended?: boolean;
};

const wordpressPlans: Plan[] = [
	{
		name: "Basic",
		price: "£15",
		hours: "—",
		included:
			"Hosting, one backup a month and automatic WordPress core security updates. Plugin updates, fixes, changes and recovering a hacked or broken site are not included (£30/hour).",
	},
	{
		name: "Care",
		price: "£60",
		hours: "1",
		included:
			"Everything in Basic, plus weekly backups, plugin updates, and restoring your site from backup if it breaks or is hacked. Extra clean-up uses your monthly hour first, then £30/hour.",
	},
	{
		name: "Plus",
		price: "£150",
		hours: "4",
		included:
			"Everything in Care, with 4 hours a month for changes, a blog post or a small feature.",
	},
	{
		name: "Growth",
		price: "£240",
		hours: "7",
		included:
			"Everything in Plus, with 7 hours a month for design changes, new features and SEO content.",
		recommended: true,
	},
	{
		name: "Pro",
		price: "£450",
		hours: "16",
		included:
			"Everything in Growth, plus priority turnaround (within 2 working days) and a monthly check-in call.",
	},
	{
		name: "Partner",
		price: "£800",
		hours: "32",
		included:
			"Everything in Pro, plus same-week delivery of larger features and a quarterly strategy and SEO review.",
	},
];

const payloadPlans: Plan[] = [
	{
		name: "Care",
		price: "£60",
		hours: "1",
		included:
			"Vercel hosting and database, database backups, Payload and security updates (tested before release) and 1 hour of changes.",
	},
	{
		name: "Plus",
		price: "£150",
		hours: "4",
		included:
			"Everything in Care, with 4 hours a month for changes, a blog post or a small feature.",
	},
	{
		name: "Growth",
		price: "£240",
		hours: "7",
		included:
			"Everything in Plus, with 7 hours a month for design changes, new features and SEO content.",
		recommended: true,
	},
	{
		name: "Pro",
		price: "£450",
		hours: "16",
		included:
			"Everything in Growth, plus priority turnaround (within 2 working days) and a monthly check-in call.",
	},
	{
		name: "Partner",
		price: "£800",
		hours: "32",
		included:
			"Everything in Pro, plus same-week delivery of larger features and a quarterly strategy and SEO review.",
	},
];

const trainingPricing = [
	{ session: "1 hour training session", cost: "£60" },
	{ session: "2 hour training session", cost: "£120" },
	{ session: "Full day training session", cost: "£280" },
];

const faqs = [
	{
		question: "How much does a website cost?",
		answer:
			"Honestly? Nobody can say up front — it's a bit like asking how long a piece of string is, since every business needs something different. What we can tell you is how we price it: a fixed, time-based cost for building your site, agreed before any work starts, followed by a monthly care plan from £15 (WordPress) or £60 (Payload) if you want your site looked after and kept evolving.",
	},
	{
		question: "How is a website build priced?",
		answer:
			"On a simple day rate of £280 for the first two days, then a discount that increases by £5 for every extra day booked, down to a maximum discount of £220/day. For example, 5 days works out at £1,325 (£265/day), and 15 days works out at £3,300 (£220/day), a £900 saving over the standard rate.",
	},
	{
		question: "Is the price agreed before you start work?",
		answer:
			"Yes. We scope out how many days your build will need and agree a fixed total cost upfront, so there are no surprises once work begins.",
	},
	{
		question: "What happens after the site is built?",
		answer:
			"Most clients move on to a monthly plan. Plans run from £15 to £800 a month depending on how many hours of changes, content and SEO work you want each month. Growth (£240 for 7 hours) is the one we recommend for most businesses.",
	},
	{
		question: "What's the difference between WordPress and Payload plans?",
		answer:
			"WordPress sites can be kept secure with automatic core updates, so there's a low-cost Basic tier for hosting and security. Payload sites need regular tested updates to avoid breaking on the next deploy, so Care (£60) is the minimum. Features on Payload are built rather than installed as plugins, so they come out of your plan hours or are quoted at £30/hour.",
	},
	{
		question: "Do unused hours roll over?",
		answer:
			"No. Hours are for each month and don't roll over. All plans can be cancelled at any time.",
	},
	{
		question: "What if I need more than my plan includes?",
		answer:
			"Anything outside your plan is charged at £30/hour. On WordPress Basic, if your site is hacked or breaks, getting it working again is charged at £30/hour, and a hack clean-up typically takes 2 to 4 hours. Care and above include restoring from backup.",
	},
	{
		question: "Can you move my site from WordPress to Payload?",
		answer:
			"Yes. On a Pro or Partner plan, your monthly hours can cover a migration over a couple of months instead of a one-off rebuild fee. If you ever want to take a Payload site elsewhere, we hand over the code repository and transfer the Vercel project. Support after handover is £30/hour.",
	},
	{
		question: "Do you offer training as well as building sites?",
		answer:
			"Yes, one-to-one training is available if you'd rather learn to do certain tasks yourself, such as updating content or basic coding. Sessions are tailored to what you need, from £60 for an hour up to £280 for a full day.",
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
	offers: [
		{
			"@type": "Offer",
			name: "Website build (time-based)",
			priceCurrency: "GBP",
			priceSpecification: {
				"@type": "UnitPriceSpecification",
				price: "280",
				priceCurrency: "GBP",
				unitText: "DAY",
			},
			description:
				"Fixed, time-based pricing for website builds from £280 per day, with volume discounts for larger projects.",
		},
		{
			"@type": "Offer",
			name: "WordPress website care plans",
			priceCurrency: "GBP",
			price: "15",
			description:
				"Monthly WordPress hosting, backups and maintenance plans from £15 per month, up to £800 per month with 32 hours of changes, content and SEO work.",
		},
		{
			"@type": "Offer",
			name: "Payload website care plans",
			priceCurrency: "GBP",
			price: "60",
			description:
				"Monthly Payload CMS hosting, backups, tested updates and development hours from £60 per month, up to £800 per month with 32 hours.",
		},
		{
			"@type": "Offer",
			name: "One-to-one training",
			priceCurrency: "GBP",
			price: "60",
			description: "One-to-one training sessions, from £60 per hour, tailored to your needs.",
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
							Price / month
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
							<td className="py-2 pr-4">{plan.price}</td>
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
				</section>

				<section className="mb-10 max-w-2xl" aria-labelledby="build-pricing-heading">
					<h2 id="build-pricing-heading" className="text-xl font-bold mb-2">
						Website builds &mdash; fixed, time-based pricing
					</h2>
					<p className="mb-4 body-text">
						We scope how many days your build needs and agree the total upfront. The more days
						booked, the lower the day rate.
					</p>
					<div className="overflow-x-auto">
						<table className="w-full border-collapse text-left font-light">
							<caption className="sr-only">Website build pricing by days of work</caption>
							<thead>
								<tr className="border-b border-white/20">
									<th scope="col" className="py-2 pr-4 font-medium">
										Build time
									</th>
									<th scope="col" className="py-2 pr-4 font-medium">
										Total cost
									</th>
									<th scope="col" className="py-2 font-medium">
										Notes
									</th>
								</tr>
							</thead>
							<tbody>
								{buildPricing.map((row) => (
									<tr key={row.days} className="border-b border-white/10">
										<th scope="row" className="py-2 pr-4 font-normal">
											{row.days}
										</th>
										<td className="py-2 pr-4">{row.cost}</td>
										<td className="py-2">{row.notes}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
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
						installed, so they come out of your plan hours or are quoted at £30/hour.
					</p>
					<PlanTable plans={payloadPlans} caption="Payload monthly plan pricing" />

					<h3 className="text-lg font-bold mt-8 mb-2">Good to know</h3>
					<ul className="list-disc pl-5 space-y-1 mb-4 font-light">
						<li>Prices are per month. All plans can be cancelled at any time.</li>
						<li>Unused hours don&apos;t roll over.</li>
						<li>Anything outside your plan is charged at £30/hour.</li>
						<li>
							Moving from WordPress to Payload: Pro or Partner hours can cover the migration over
							a couple of months instead of a one-off rebuild fee.
						</li>
						<li>
							Payload handover: we hand over the code repository and transfer the Vercel project.
							Support after handover is £30/hour.
						</li>
					</ul>
					<p className="body-text">
						<CtaButton href="/website-maintenance">
							See what&apos;s included in website maintenance
						</CtaButton>
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
					<div className="overflow-x-auto">
						<table className="w-full border-collapse text-left font-light">
							<caption className="sr-only">One-to-one training session pricing</caption>
							<thead>
								<tr className="border-b border-white/20">
									<th scope="col" className="py-2 pr-4 font-medium">
										Session
									</th>
									<th scope="col" className="py-2 font-medium">
										Cost
									</th>
								</tr>
							</thead>
							<tbody>
								{trainingPricing.map((row) => (
									<tr key={row.session} className="border-b border-white/10">
										<th scope="row" className="py-2 pr-4 font-normal">
											{row.session}
										</th>
										<td className="py-2">{row.cost}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
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
