import BackHomeLink from "../components/BackHomeLink";
import PageMain from "../components/PageMain";
import Link from "next/link";
export default function WebsiteMaintenancePage() {
	return (
		<>
			<BackHomeLink />
			<PageMain>
				<h1 className="text-3xl font-bold mb-4">Website maintenance</h1>
				<p className="mb-4 max-w-2xl font-light">We help small businesses build and evolve their website over time, and monitor the performance, so you can be sure you are getting return on investment. 
					It is crucial to have a fast, informative website that allows people to easily find you. Our website maintenance packages free up time for you and allow that growth to happen while you focus on delivering results to your clients. 
				</p>
				<p className="mb-4 max-w-2xl font-light">
					We have a background in web development and design, building sites from scratch as well as offering ongoing maintenance and content support once they&apos;re live. Whether you need a brand new build or someone to keep an existing site running smoothly, we can help.
				</p>
				<p className="mb-8 max-w-2xl font-light">
					Our maintenance packages help keep your site looking fresh, secure and up to date. We handle the technical side, update content as your business changes, and make the whole process easy to use and understand — so you can see, at a glance, how your site is performing.
				</p>
				<p className="mb-8 max-w-2xl font-light">
					As part of the package, we monitor and report on web engagement and traffic, so you can track the real-world impact of the improvements we make over time. Get in touch if you would like to discuss a package tailored to your site.
				</p>

				<h2 className="text-xl font-semibold mb-2">Website maintenance services</h2>
				<ul className="list-disc pl-5 space-y-1 font-light mb-8">
					<li>
						<Link href="/website-maintenance/plan" className="underline">
							Maintenance Plan
						</Link>
					</li>
					<li>
						<Link href="/website-maintenance/content" className="underline">
							Fresh content
						</Link>
					</li>
					<li>
						<Link href="/website-maintenance/monitoring-progress" className="underline">
							Monitoring website improvements
						</Link>
					</li>
					<li>
						<Link href="/website-maintenance/photography" className="underline">
							Bespoke photography
						</Link>
					</li>
				</ul>

				<p className="mb-8">
						<Link href="https://www.oliverberman.net" className="underline" target="_blank" rel="noopener noreferrer">Website portfolio</Link>
					</p>
			</PageMain>
		</>
	);
}
