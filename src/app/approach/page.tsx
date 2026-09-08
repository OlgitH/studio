import BackHomeLink from "../components/BackHomeLink";
import PageMain from "../components/PageMain";
import PageBgImage from "../components/PageBgImage";

export default function ApproachPage() {
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
						<section className="mb-8">
							<h1 className="text-3xl font-bold mb-4">Our approach</h1>
							<p className="mb-4 body-text">
								We like to think we are friendly and approachable, and really
								try to get to know the business of our client. Your success is
								our success, and increasingly the role of a website developer is
								to ensure the company&apos;s whole brand, ethos and target
								audience is reflected in the website. This requires ongoing
								effort and a real passion for your business, so we try to
								approach each new project like it our own business.
							</p>
							<p className="mb-4 body-text">
								We often work small businesses who are time poor, not especially
								tech savvy, and would rather hand off their website and digital
								marketing than manage it themselves, and understand the value
								that this gives them as they can focus on delivering for their
								clients.
							</p>
						</section>
						<section>
							<h2 className=" text-2xl font-bold mb-4">Holistic Approach</h2>
							<p className="mb-4 body-text">
								We offer a holistic, all-round service covering website
								maintenance, content and SEO, and ongoing monitoring, so you
								have one point of contact instead of juggling several suppliers.
							</p>
						</section>
					</div>
				</section>
			</PageMain>
		</>
	);
}
