import BackHomeLink from "../components/BackHomeLink";
import PageMain from "../components/PageMain";

export default function ApproachPage() {
	return (
		<>
			<BackHomeLink />
			<PageMain>
                <section className="max-w-2xl font-light mb-10 ">
					<h1 className="text-3xl font-bold mb-4">Our approach</h1>
					<p className="mb-4 ">
						We like to think we are friendly and approachable, and really try to get to know the business of our client. Your success is our success, and increasingly the role of a website developer is to ensure the company&apos;s whole brand, ethos and target audience is reflected in the website. This requires ongoing effort and a real passion for your business, so we try to approach each new project like it our own business.
					</p>
					<p className="mb-4 ">
						We often work small businesses who are time poor, not especially tech savvy, and would rather hand off their website and digital marketing than manage it themselves, and understand the value that this gives them as they can focus on delivering for their clients. We offer a holistic, all-round service covering website maintenance, content and SEO, and ongoing monitoring, so you have one point of contact instead of juggling several suppliers.
					</p>
				
				</section>
			</PageMain>
		</>
	);
}
