import type { Metadata } from "next";
import BookingLanding from "../components/BookingLanding";
import { getCarePlan } from "../lib/carePlans";

// Booking page for the "Plan your website" call: where the care plan cards
// and new-build buttons lead (the free website review stays for ads). Same
// layout as /free-website-review (BookingLanding). A ?plan=<slug> from a
// plan card is confirmed in the intro and prefilled into the booking notes,
// so Olly sees it before the call. Not for search: it's a step in a
// journey, not a page people search for.
export const metadata: Metadata = {
	title: "Plan your website | Greencrown Studio",
	description:
		"Book a free call to plan your website or care plan with Greencrown Studio in Bath.",
	robots: { index: false, follow: true },
};

export default async function PlanYourWebsitePage({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	const { plan: planParam } = await searchParams;
	const slug = typeof planParam === "string" ? planParam : undefined;
	const plan = getCarePlan(slug);
	const isBuild = slug === "build";

	const prefillNotes = plan
		? plan.slug === "tailored"
			? "Interested in a tailored plan."
			: `Interested in the ${plan.name} plan (${plan.price} ${plan.priceNote}).`
		: isBuild
			? "Interested in a new website build."
			: undefined;

	const intro =
		plan && plan.slug !== "tailored" ? (
			<>
				You&apos;re interested in{" "}
				<strong className="font-bold">
					{plan.name} ({plan.price} {plan.priceNote})
				</strong>
				. Book a free call with Olly at Greencrown Studio, and we&apos;ll check
				it&apos;s the right fit for your site before anything starts.
			</>
		) : plan ? (
			<>
				A free call with Olly at Greencrown Studio. Tell us about your site and
				what you need, and we&apos;ll put together a plan tailored to it.
			</>
		) : (
			<>
				A free call with Olly at Greencrown Studio, to talk through what you
				need: a new website, a move off a website builder, or keeping an
				existing site looked after.
			</>
		);

	return (
		<BookingLanding
			heading="Plan your website"
			intro={intro}
			bullets={[
				"What you need your website to do",
				"Which plan fits, or a plan tailored to you",
				<>No website yet? That&apos;s fine, book anyway</>,
			]}
			calLink="olly-berman/plan-your-website"
			conversionEvent="book_plan_call"
			prefill={prefillNotes ? { notes: prefillNotes } : undefined}
		/>
	);
}
