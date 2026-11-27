import Link from "next/link";

import { CARE_PLANS } from "../lib/carePlans";

// WordPress care plans (the common case, so priced up front), plus a
// Tailored card for custom-built sites and other platforms. Every card leads
// to the "Plan your website" call (not a checkout: the right plan depends on
// seeing the site first), carrying the chosen plan so the call page can
// confirm it and pass it into the booking.

export default function CarePlanCards() {
	return (
		<section aria-labelledby="care-plans-heading">
			<h2 id="care-plans-heading" className="mb-2 text-2xl font-semibold">
				WordPress care plans
			</h2>
			<p className="body-text mb-6">
				Monthly plans to keep your WordPress site secure, backed up and moving
				forward. Not on WordPress? We look after custom-built sites and other
				platforms too, with a plan tailored to you.
			</p>

			<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				{CARE_PLANS.map((plan) => (
					<div
						key={plan.name}
						className={`relative flex flex-col rounded-2xl p-6 ${
							plan.featured
								? "bg-[var(--color-highlight)] text-[#120d0d]"
								: plan.grey
									? "bg-[#e6e4e1] text-[#120d0d]"
									: "bg-white text-[#120d0d]"
						}`}
					>
						{plan.featured && (
							<span className="absolute -top-3 left-6 rounded-full bg-[#120d0d] px-3 py-1 text-xs font-bold text-[var(--color-highlight)]">
								Recommended
							</span>
						)}
						<h3 className="text-xl font-bold">{plan.name}</h3>
						<p className="mb-4 text-sm opacity-70">{plan.tagline}</p>
						<p className="mb-4">
							<span className="text-3xl font-bold">{plan.price}</span>{" "}
							<span className="text-sm opacity-70">{plan.priceNote}</span>
						</p>
						<ul className="mb-6 flex-1 space-y-2 text-sm">
							{plan.features.map((feature) => (
								<li key={feature} className="flex gap-2">
									<span aria-hidden="true">✓</span>
									<span>{feature}</span>
								</li>
							))}
						</ul>
						<Link
							href={`/plan-your-website?plan=${plan.slug}`}
							className={`inline-block rounded-full px-5 py-2 text-center whitespace-nowrap text-sm font-bold no-underline transition-colors ${
								plan.featured
									? "bg-[#120d0d] text-white hover:bg-[#2a2424]"
									: "bg-[#2a2424] text-[var(--color-highlight)] hover:bg-[#3a3333]"
							}`}
						>
							{plan.cta}
						</Link>
					</div>
				))}
			</div>

			<ul className="mt-6 space-y-1 text-sm text-white/70">
				<li>
					Hosting-only Basic from £15 a month. Plus (4 hours, £150) and Partner
					(28 hours, £800) plans also available.
				</li>
				<li>
					All plans can be cancelled at any time. Unused hours don&apos;t roll
					over.
				</li>
				<li>Work outside a plan is charged at £60 an hour.</li>
			</ul>
		</section>
	);
}
