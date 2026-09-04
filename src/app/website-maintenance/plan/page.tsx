import type { Metadata } from "next";
import Link from "next/link";
import BackHomeLink from "../../components/BackHomeLink";
import PageMain from "../../components/PageMain";

export const metadata: Metadata = {
	title: "Website Maintenance Plan | Greencrown Studio",
	description:
		"Your website, looked after — technically, visually and strategically — for one monthly fee. From £280/month for your first 6 months.",
};

const whatsIncluded = [
	{
		heading: "Keep it running",
		body: "We handle the technical upkeep that keeps your site fast, secure and online — backups, server management, and clearing out old files and images that quietly slow things down. The boring-but-essential stuff, done in the background.",
	},
	{
		heading: "Keep it improving",
		body: "Every month we analyse how your site is actually performing — which pages and posts are ranking, which keywords are working, where you're showing up in search — and act on it. Nothing here is guesswork; every change is based on real traffic and engagement data.",
	},
	{
		heading: "Keep it growing",
		body: "Guided by that same data, we help you create content that compounds — blog posts, case studies, photography and video. You stay in control and sign off everything before it goes live; we bring the ideas, the writing support and the schedule to make it happen consistently.",
	},
];

const monthlyReport = [
	"Traffic and visitor trends",
	"Engagement from your target audience",
	"Search rankings and visibility",
	"Page speed and Core Web Vitals",
	"Conversions — enquiries, sign-ups and sales",
];

const benefits = [
	{
		heading: "Peace of mind.",
		body: "It's being looked after. You don't have to think about it.",
	},
	{
		heading: "Visible progress.",
		body: "A monthly report shows real movement — traffic, rankings, enquiries — not just \"we did some work.\"",
	},
	{
		heading: "No HR headache.",
		body: "You get the benefit of a developer, an SEO analyst and a content editor, without hiring, managing or running payroll for any of them.",
	},
	{
		heading: "Less reliance on paid ads.",
		body: "As organic traffic grows, you need to spend less chasing visitors through Google, Facebook and Instagram ads.",
	},
	{
		heading: "A consistent brand.",
		body: "We keep your site and content calibrated to your identity and your audience, so everything published still looks and sounds like you.",
	},
];

const faqs = [
	{
		question: "What's the difference between this and a one-off maintenance fix?",
		answer:
			"A one-off fix solves today's problem. The Maintenance Plan is ongoing — we're watching your data every month, so issues get caught early and improvements compound over time instead of your site slowly losing ground.",
	},
	{
		question: "Do I have to approve content before it's published?",
		answer:
			"Yes, always. We create drafts and suggestions guided by what the data shows is working, but nothing goes live without your sign-off.",
	},
	{
		question: "What if I only want some of this?",
		answer:
			"The core plan (server management, monitoring, reporting) is the foundation. Content and photography can be added on as much or as little as you need, month to month.",
	},
	{
		question: "How is the £280 introductory rate different from the £320 rate?",
		answer:
			"It's the same plan — the reduced rate is simply to make the first 6 months easier while we build up the data and momentum that make the reporting most valuable.",
	},
	{
		question: "Is there a contract?",
		answer: "No long-term lock-in. Just 30 days' notice if you ever want to pause or stop.",
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

export default function WebsiteMaintenancePlanPage() {
	return (
		<>
			<BackHomeLink />
			<PageMain>
				<section className="mb-10 max-w-2xl" aria-labelledby="plan-heading">
					<h1 id="plan-heading" className="text-3xl font-bold mb-4">
						Website Maintenance Plan
					</h1>
					<p className="mb-4 body-text">
						Your website, looked after — technically, visually and strategically — for one
						monthly fee. A website isn&apos;t a one-off project, it&apos;s a living asset. Left
						alone, it quietly loses speed, security and search visibility. Our Maintenance Plan
						means someone is always keeping an eye on it, acting on what the data shows, and
						reporting back — so you don&apos;t have to think about it.
					</p>
					<p className="mb-4 body-text">
						<strong>From £280/month for your first 6 months</strong> (£320/month thereafter).
					</p>
					<p className="body-text">
						<Link href="/contact" className="underline">
							Get in touch
						</Link>
					</p>
				</section>

				<section className="mb-10 max-w-2xl" aria-labelledby="included-heading">
					<h2 id="included-heading" className="text-xl font-semibold mb-2">
						What&apos;s included
					</h2>
					<div className="space-y-4">
						{whatsIncluded.map((item) => (
							<div key={item.heading}>
								<h3 className="font-normal mb-1">{item.heading}</h3>
								<p className="body-text">{item.body}</p>
							</div>
						))}
					</div>
				</section>

				<section className="mb-10 max-w-2xl" aria-labelledby="monthly-report-heading">
					<h2 id="monthly-report-heading" className="text-xl font-semibold mb-2">
						What you get every month
					</h2>
					<p className="mb-2 body-text">A straightforward report showing:</p>
					<ul className="list-disc pl-5 space-y-1 font-light">
						{monthlyReport.map((item) => (
							<li key={item}>{item}</li>
						))}
					</ul>
					<p className="mt-4 body-text">
						No jargon, no dashboards to decode — just a clear view of what&apos;s changed and
						what we&apos;re doing next.
					</p>
				</section>

				<section className="mb-10 max-w-2xl" aria-labelledby="benefits-heading">
					<h2 id="benefits-heading" className="text-xl font-semibold mb-2">
						What it means for you
					</h2>
					<div className="space-y-3">
						{benefits.map((item) => (
							<p key={item.heading} className="body-text">
								<strong>{item.heading}</strong> {item.body}
							</p>
						))}
					</div>
				</section>

				<section className="mb-10 max-w-2xl" aria-labelledby="pricing-heading">
					<h2 id="pricing-heading" className="text-xl font-semibold mb-2">
						Pricing
					</h2>
					<p className="mb-4 body-text">
						<strong>£280/month</strong> for the first 6 months, then <strong>£320/month</strong>{" "}
						ongoing.
					</p>
					<p className="mb-4 body-text">
						This covers the core plan: server management, monthly SEO analysis and reporting,
						and content guidance. Larger content production — video, photography shoots,
						in-depth case studies — is scoped and quoted separately, so your monthly fee stays
						predictable.
					</p>
					<p className="mb-4 body-text">No lock-in contracts. Cancel with 30 days&apos; notice.</p>
					<p className="body-text">
						<Link href="/contact" className="underline">
							Get in touch to tailor a plan for your site
						</Link>
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
								<dd className="body-text mt-1">{faq.answer}</dd>
							</div>
						))}
					</dl>
				</section>

				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
				/>
			</PageMain>
		</>
	);
}
