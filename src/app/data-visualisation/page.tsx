import Link from "next/link";
import BackHomeLink from "../components/BackHomeLink";
import PageMain from "../components/PageMain";

export default function DataVisualisationPage() {
	return (
		<>
			<BackHomeLink />
			<PageMain>
				<h1 className="text-3xl font-bold mb-4">Data visualisation</h1>

				<p className="mb-8 body-text">
					We can produce insightful and engaging reports and slide decks
					for presentations from live datasets, for you to tell the story
					you need to tell to persuade and impress. Fast turnaround and
					affordable pricing. Get in touch if you would like to enquire
					about our services.
				</p>

				<section className="mb-8 max-w-2xl" aria-labelledby="examples-heading">
					<h2 id="examples-heading" className="text-xl font-semibold mb-2">
						Examples
					</h2>
					<p className="body-text mb-2">
						Explore current data visualisation work and reports.
					</p>
					<Link href="/data-visualisation/bristol-jobs" className="underline">
						View Bristol job market analysis
					</Link>
				</section>
			</PageMain>
		</>
	);
}
