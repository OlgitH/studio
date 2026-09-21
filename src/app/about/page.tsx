"use client";

import Script from "next/script";
import BackHomeLink from "../components/BackHomeLink";
import PageMain from "../components/PageMain";
import CtaButton from "../components/CtaButton";
import LinkBoxList from "../components/LinkBoxList";
import ContentSection from "../components/ContentSection";
import PageContainer from "../components/PageContainer";

export default function AboutPage() {
	return (
		<>
			<BackHomeLink />
			<PageMain>
				<PageContainer className="font-light mb-10">
					<h1 className="text-3xl font-bold mb-4">About</h1>
					<div className="flex flex-col gap-4 md:flex-row md:items-start">
						<div className="md:w-3/5">
							<p className="mb-4 text-pretty body-text">
								Greencrown Studio is your personalised creative department.
								We&nbsp;like to work with small companies, or individuals, from
								all industries - including artists, architects, engineering and
								manufacturing. We can help you to simplify your tech and make it
								work for you, instead of bringing noise and headaches.
							</p>
							<p className="mb-4 text-pretty body-text">
								For examples of work take a look at Oliver Berman&apos;s website
							</p>
							<p className="mb-4 body-text">
								<CtaButton
									href="https://www.oliverberman.net"
									target="_blank"
									rel="noopener noreferrer"
								>
									Portfolio website
								</CtaButton>
							</p>
						</div>
						<div className="md:w-2/5">
							<div
								className="relative aspect-[9/16] select-none before:content-[''] before:absolute before:inset-0 before:-translate-y-4 before:translate-x-4 before:bg-[var(--color-highlight)] before:pointer-events-none"
								onContextMenu={(e) => e.preventDefault()}
							>
								<iframe
									src="https://player.vimeo.com/video/1215538268?badge=0&autopause=0&player_id=0&app_id=58479&title=0&byline=0&portrait=0"
									frameBorder="0"
									allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
									referrerPolicy="strict-origin-when-cross-origin"
									className="absolute inset-0 h-full w-full bg-[#333]"
									title="intro_video"
								/>
							</div>
						</div>
					</div>
					<Script
						src="https://player.vimeo.com/api/player.js"
						strategy="lazyOnload"
					/>
				</PageContainer>
				<ContentSection variant="white" width="wide" className="font-light">
					<div className="w-full">
						<h2 className="mb-4 text-xl font-bold">Services</h2>
						<LinkBoxList
							items={[
								{ label: "Website Design" },
								{ label: "Website Development" },
								{ label: "Website maintenance", href: "/website-maintenance" },
								{ label: "SEO and marketing" },
								{ label: "AI business processes", href: "/business-processes" },
								{ label: "Graphic design" },
								{ label: "Data visualisation", href: "/data-visualisation" },
							]}
						/>
					</div>
				</ContentSection>
			</PageMain>
		</>
	);
}
