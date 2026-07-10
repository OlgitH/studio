import type { Metadata } from "next";
import Link from "next/link";
import BackHomeLink from "../components/BackHomeLink";
import PageMain from "../components/PageMain";

export const metadata: Metadata = {
	title: "Pricing | Greencrown Studio",
	description:
		"How much does a website cost? We use fixed, time-based pricing for builds from £280/day, plus ongoing maintenance and one-to-one training.",
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

const trainingPricing = [
	{ session: "1 hour training session", cost: "£60" },
	{ session: "2 hour training session", cost: "£120" },
	{ session: "Full day training session", cost: "£360" },
];

const faqs = [
	{
		question: "How much does a website cost?",
		answer:
			"Honestly? Nobody can say up front — it's a bit like asking how long a piece of string is, since every business needs something different. What we can tell you is how we price it: a fixed, time-based cost for building your site, agreed before any work starts, followed by an optional ongoing maintenance package if you want your site to keep evolving and take advantage of website marketing.",
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
			"Most clients move on to an ongoing maintenance package, starting from £300 per month, covering updates, security, content changes and monitoring and reporting on traffic and engagement so your site keeps improving after launch.",
	},
	{
		question: "Do you offer training as well as building sites?",
		answer:
			"Yes, one-to-one training is available if you'd rather learn to do certain tasks yourself, such as updating content or basic coding. Sessions are tailored to what you need, from £60 for an hour up to £360 for a full day.",
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
			name: "Website build (time-based, per month)",
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
			name: "Website maintenance",
			priceCurrency: "GBP",
			price: "300",
			description:
				"Ongoing monthly maintenance covering updates, security, content changes, monitoring and reporting.",
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

export default function PricingPage() {
	return (
		<>
			<BackHomeLink />
			<PageMain>
				<section className="max-w-2xl font-light mb-10" aria-labelledby="pricing-heading">
					<h1 id="pricing-heading" className="text-3xl font-bold mb-4">
						How much does a website cost?
					</h1>
					<p className="mb-4">
						Honestly? Nobody can say without seeing the details of the site required &mdash; it&apos;s a bit like asking how long a
						piece of string is. Every business needs something different, so a one-size price
						tag would only be a guess.
					</p>
					<p className="mb-4">
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
                    <p>Initial build for small website starts at £70.</p>
                    </section>

                    
				<section className="mb-10 max-w-2xl" aria-labelledby="maintenance-heading">

					<div className="overflow-x-auto">
                        <h2 id="maintenance-heading" className="text-xl font-bold mb-2">Maintenance</h2>
						<table className="w-full border-collapse text-left font-light">
							<caption className="sr-only">
								Obgoing maintenance pricing by days dedicated per month
							</caption>
							<thead>
								<tr className="border-b border-white/20">
									<th scope="col" className="py-2 pr-4 font-medium">
										Days per month
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
					<p className="mb-4 font-light">
						Once your site is live, our maintenance packages start from{" "}
						<strong>£70 per month </strong> and keep it looking fresh, secure and up to date. We
						handle the technical side, update content as your business changes, and monitor and
						report on traffic and engagement so you can see your site&apos;s real-world impact
						over time.
					</p>
					<p className="font-light">
						<Link href="/website-maintenance" className="underline">
							See what&apos;s included in website maintenance
						</Link>
					</p>
				</section>

				<section className="mb-10 max-w-2xl" aria-labelledby="training-heading">
					<h2 id="training-heading" className="text-xl font-bold mb-2">
						One-to-one training
					</h2>
					<p className="mb-4 font-light">
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
			</PageMain>
		</>
	);
}
