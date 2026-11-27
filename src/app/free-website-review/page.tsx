import type { Metadata } from "next";
import BookingLanding from "../components/BookingLanding";

// Google Ads landing page (layout shared with /plan-your-website, see
// BookingLanding). Kept out of search results: it exists for ad traffic and
// would only compete with the real pages.
export const metadata: Metadata = {
	title: "Book a Free Website Review | Greencrown Studio, Bath",
	description:
		"Book a free, no-obligation website review with a Bath web designer. We'll look at your site together and show you what to improve.",
	robots: { index: false, follow: true },
};

export default function FreeWebsiteReviewPage() {
	return (
		<BookingLanding
			heading="Book a free website review"
			intro={
				<>
					A free, no-obligation 20-minute video call with Olly, a web designer
					based in Bath. We&apos;ll look at your website together and show you
					what&apos;s holding it back, and what to do about it.
				</>
			}
			bullets={[
				<>What&apos;s working, and what isn&apos;t</>,
				"How easily customers can find you on Google",
				"Whether to fix what you have, or move off a website builder",
			]}
			calLink="olly-berman/website-review"
			conversionEvent="book_free_review"
		/>
	);
}
