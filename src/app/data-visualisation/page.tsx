import Link from "next/link";
import BackHomeLink from "../components/BackHomeLink";

export default function DataVisualisationPage() {
	return (
		<>
			<BackHomeLink />
			<main className="mx-auto max-w-4xl p-8">
				<h1 className="text-3xl font-bold mb-4">Data visualisation</h1>
				<p className="mb-8 max-w-2xl">
					Explore current data visualisation work and reports.
				</p>
				<Link href="/data-visualisation/jobs" className="underline">
					View Bristol job market analysis
				</Link>
			</main>
		</>
	);
}
