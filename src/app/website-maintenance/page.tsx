import BackHomeLink from "../components/BackHomeLink";
import PageMain from "../components/PageMain";
import CtaButton from "../components/CtaButton";
import LinkBoxList from "../components/LinkBoxList";
import PageBgImage from "../components/PageBgImage";
export default function WebsiteMaintenancePage() {
	return (
		<>
			<BackHomeLink />
			<PageMain>
				<section className="relative max-w-4xl font-light mb-10">
					<PageBgImage
						src="/bird-blur-3.png"
						width={2000}
						height={1000}
						opacityClassName="opacity-40"
						maxWidthClassName="max-w-4xl"
						positionClassName="-translate-x-[40vw] -top-[10vh] md:translate-x-[20vw]"
					/>
					<div className="relative z-10">
						<h1 className="text-3xl font-bold mb-4">Website maintenance</h1>
						<p className="mb-4 body-text">
							We help small businesses build and evolve their website over time,
							and monitor the performance, so you can be sure you are getting
							return on investment. It is crucial to have a fast, informative
							website that allows people to easily find you. Our website
							maintenance packages free up time for you and allow that growth to
							happen while you focus on delivering results to your clients.
						</p>
						<p className="mb-4 body-text">
							We have a background in web development and design, building sites
							from scratch as well as offering ongoing maintenance and content
							support once they&apos;re live. Whether you need a brand new build
							or someone to keep an existing site running smoothly, we can help.
						</p>
						<p className="mb-8 body-text">
							Our maintenance packages help keep your site looking fresh, secure
							and up to date. We handle the technical side, update content as
							your business changes, and make the whole process easy to use and
							understand — so you can see, at a glance, how your site is
							performing.
						</p>
						<p className="mb-8 body-text">
							As part of the package, we monitor and report on web engagement
							and traffic, so you can track the real-world impact of the
							improvements we make over time. Get in touch if you would like to
							discuss a package tailored to your site.
						</p>

						<h2 className="text-2xl font-semibold mb-4">
							Website maintenance services
						</h2>
						<div className="mb-8">
							<LinkBoxList
								items={[
									{
										label: "Maintenance Plan",
										href: "/website-maintenance/plan",
									},
									{
										label: "Fresh content",
										href: "/website-maintenance/content",
									},
									{
										label: "Monitoring website improvements",
										href: "/website-maintenance/monitoring-progress",
									},
									{
										label: "Bespoke photography",
										href: "/website-maintenance/photography",
									},
								]}
							/>
						</div>

						<p className="mb-8 body-text">
							<CtaButton
								href="https://www.oliverberman.net"
								target="_blank"
								rel="noopener noreferrer"
							>
								Portfolio website
							</CtaButton>
						</p>
					</div>
				</section>
			</PageMain>
		</>
	);
}
