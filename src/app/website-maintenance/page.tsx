import BackHomeLink from "../components/BackHomeLink";
import Link from "next/link";
export default function WebsiteMaintenancePage() {
	return (
		<>
			<BackHomeLink />
			<main className="mx-auto flex min-h-dvh max-w-4xl flex-col justify-end overflow-hidden p-6 pb-8 pt-24 md:min-h-0 md:justify-start md:overflow-visible md:p-8">
				<h1 className="text-3xl font-bold mb-4">Website maintenance</h1>
				<p className="mb-4 max-w-2xl font-light">
					We have a background in web development and design, building sites from scratch as well as offering ongoing maintenance and content support once they&apos;re live. Whether you need a brand new build or someone to keep an existing site running smoothly, we can help.
				</p>
				<p className="mb-8 max-w-2xl font-light">
					Our maintenance packages start from £300 per month and help keep your site looking fresh, secure and up to date. We handle the technical side, update content as your business changes, and make the whole process easy to use and understand — so you can see, at a glance, how your site is performing.
				</p>
				<p className="mb-8 max-w-2xl font-light">
					As part of the package, we monitor and report on web engagement and traffic, so you can track the real-world impact of the improvements we make over time. Get in touch if you would like to discuss a package tailored to your site.
				</p>
				<p className="mb-8">
						<Link href="https://www.oliverberman.net" className="underline" target="_blank" rel="noopener noreferrer">Website portfolio</Link>
					</p>
			</main>
		</>
	);
}
