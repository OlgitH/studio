import Link from "next/link";
import BackHomeLink from "../components/BackHomeLink";
import PageMain from "../components/PageMain";

export default function AboutPage() {
	return (
		<>
			<BackHomeLink />
			<PageMain>
                <section className="max-w-2xl font-light mb-10 ">
					<h1 className="text-3xl font-bold mb-4">About</h1>
					<p className="mb-4 ">
						Greencrown Studio is your personalised creative department. We like to work with small companies, or individuals, from all industries - including artists, architects, engineering and manufacturing.  We can help you to simplify your tech and make it work for you, instead of bringing noise and headaches. 
					</p>
					<p className="mb-4">
						For examples of work take a look at Oliver Berman's <Link href="https://www.oliverberman.net" className="underline" target="_blank" rel="noopener noreferrer">website</Link> 
					</p>
                </section>
				<section className="max-w-2xl font-light">
					<h2 className="mb-4 text-xl font-bold">Services</h2>
					<ul>
						<li>Website Design</li>
						<li>Website Development</li>
						<li>
							<Link href="/website-maintenance" className="underline">
								Website maintenance
							</Link>
						</li>
						<li>SEO and marketing</li>
						<li>
							<Link href="/business-processes" className="underline">
								AI business processes
							</Link>
						</li>
						<li>Graphic design</li>
						<li>
							<Link href="/data-visualisation" className="underline">
								Data visualisation
							</Link>
						</li>
					</ul>
				</section>

			</PageMain>
		</>
	);
}
