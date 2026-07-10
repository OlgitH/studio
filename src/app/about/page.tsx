import Link from "next/link";
import BackHomeLink from "../components/BackHomeLink";

export default function AboutPage() {
	return (
		<>
			<BackHomeLink />
			<main className="mx-auto flex min-h-dvh max-w-4xl flex-col justify-end overflow-hidden p-6 pb-8 pt-24 md:min-h-0 md:justify-start md:overflow-visible md:p-8">
                <section className="max-w-2xl font-light mb-10 ">
					<h1 className="text-3xl font-bold mb-4">About</h1>
					<p className="mb-4 ">
						Greencrown Studio is your personalised creative department. We like to work with small to medium sized companies, or individuals, from all industries - including artists, architects, engineering and manufacturing.  We can help you to simplify your tech and make it work for you, instead of bringing noise and headaches. 
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
						<li>AI business processes</li>
						<li>Graphic design</li>
						<li>
							<Link href="/data-visualisation" className="underline">
								Data visualisation
							</Link>
						</li>
					</ul>
				</section>
				
			</main>
		</>
	);
}
