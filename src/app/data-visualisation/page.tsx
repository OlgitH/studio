import Link from "next/link";
import BackHomeLink from "../components/BackHomeLink";

export default function DataVisualisationPage() {
	return (
		<>
			<BackHomeLink />
			<main className="mx-auto flex min-h-dvh max-w-4xl flex-col justify-end overflow-hidden p-6 pb-8 pt-24 md:min-h-0 md:justify-start md:overflow-visible md:p-8">
				<h1 className="text-3xl font-bold mb-4">Data visualisation</h1>
				<p className="mb-8 max-w-2xl">
					Explore current data visualisation work and reports.
				</p>
				<Link href="/data-visualisation/bristol-jobs" className="underline">
					View Bristol job market analysis
				</Link>
			</main>
		</>
	);
}
