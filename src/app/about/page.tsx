"use client";

import Link from "next/link";
import Script from "next/script";
import BackHomeLink from "../components/BackHomeLink";
import PageMain from "../components/PageMain";

export default function AboutPage() {
	return (
		<>
			<BackHomeLink />
			<PageMain>
                <section className="max-w-4xl font-light mb-10 ">
					<h1 className="text-3xl font-bold mb-4">About</h1>
					<div className="flex flex-col gap-4 md:flex-row md:items-start">
						<div className="md:w-3/5">
							<p className="mb-4 text-pretty body-text">
								Greencrown Studio is your personalised creative department. We&nbsp;like to work with small companies, or individuals, from all industries - including artists, architects, engineering and manufacturing.  We can help you to simplify your tech and make it work for you, instead of bringing noise and headaches.
							</p>
							<p className="mb-4 text-pretty body-text">
								For examples of work take a look at Oliver Berman's <Link href="https://www.oliverberman.net" className="underline" target="_blank" rel="noopener noreferrer">website</Link>
							</p>
						</div>
						<div className="md:w-2/5">
							<div
								className="relative aspect-[9/16] select-none"
								onContextMenu={(e) => e.preventDefault()}
							>
								<iframe
									src="https://player.vimeo.com/video/1215538268?badge=0&autopause=0&player_id=0&app_id=58479&title=0&byline=0&portrait=0"
									frameBorder="0"
									allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
									referrerPolicy="strict-origin-when-cross-origin"
									className="absolute inset-0 h-full w-full"
									title="intro_video"
								/>
							</div>
						</div>
					</div>
					<Script src="https://player.vimeo.com/api/player.js" strategy="lazyOnload" />
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
