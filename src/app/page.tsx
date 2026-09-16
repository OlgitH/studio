import Image from "next/image";
import Link from "next/link";
import Logo from "@/../public/logo/logo-white-no-bird.svg";
import PageBgImage from "./components/PageBgImage";
import ServiceSplash from "./components/ServiceSplash";
import FadeInOnView from "./components/FadeInOnView";
export default function Home() {
	return (
		<>
			<main className="home-main text-foreground min-h-svh w-full flex flex-col relative overflow-hidden">
				<PageBgImage
					src="/bird-blur-3.png"
					width={2000}
					height={1000}
					opacityClassName="opacity-40"
					maxWidthClassName="max-w-4xl"
					priority
				/>
				<FadeInOnView className="relative z-10 mx-auto flex flex-1 flex-col w-full p-[20px] xl:w-[1080px]">
					<div className="flex-1 grid grid-cols-[max-content_max-content] gap-x-10 gap-y-8 grid-rows-[auto_1fr_auto] xl:gap-x-[32px] xl:gap-y-0 xl:grid-cols-10 xl:grid-rows-[auto_1fr_auto]">
						<div className="col-start-1 col-span-4 row-start-1 self-start xl:col-start-1 xl:row-start- xl:self-start">
							<img
								src="/bird-icon.svg"
								alt="Greencrown mark"
								className="brand-icon h-auto w-40 xl:w-86"
							/>
						</div>
						<div className="col-start-1 row-start-2 self-start xl:col-start-1 xl:col-span-2 xl:row-start-3 xl:self-start">
							<Image
								src={Logo}
								alt="Greencrown Studio"
								width={140}
								className="brand-logo h-auto w-48"
							/>
						</div>
						<nav
							className="primary-nav hidden col-start-2 row-start-2 self-start justify-self-start sm:block xl:col-start-3 xl:col-span-2 xl:row-start-3 xl:self-start"
							aria-label="Primary"
						>
							<ul className="flex flex-col gap-1 text-xl leading-none font-light">
								<li>
									<Link href="/about">about</Link>
								</li>
								<li>
									<Link
										href="/website-maintenance"
										className="whitespace-nowrap"
									>
										website maintenance
									</Link>
								</li>
								<li>
									<Link
										href="/business-processes"
										className="whitespace-nowrap"
									>
										AI business processes
									</Link>
								</li>
								<li>
									<Link href="/training">training</Link>
								</li>
							</ul>
						</nav>
						<div className="col-span-2 max-w-[400px] row-start-3 self-end text-base leading-tight xl:col-start-5 xl:row-start-3 xl:col-span-6 xl:self-start">
							<p className="font-light">
								Greencrown Studio is your friendly creative department. Keep
								your website, branding, SEO and AI processes under one roof,
								simplifying your life and helping your business grow faster.
							</p>
						</div>
						<section className="mt-10 row-start-4 xl:col-start-1 font-light">
							<p>
								<a href="mailto:olly@greencrown.studio">
									olly@greencrown.studio
								</a>
							</p>
							<p>
								<a href="tel:+01225699150" className="whitespace-nowrap">
									+44 1225 699150
								</a>
							</p>
						</section>
					</div>
				</FadeInOnView>
			</main>
			<ServiceSplash
				variant="white"
				heading="We build and maintain websites"
				description="Turn an idea into a fully functioning website that works for you. Our experience and knowledge allows us to choose the right platform for your business and no overkill, which saves you money in the long term.  We also maintain it so you don't have to worry about downtime and can rest assured when things go wrong, someone is on hand to fix it for you before your customers know. All sites are set up with SEO in mind and to be monitored and improved on monthly, by you or by us."
				href="/website-maintenance"
				shapeImage={{ src: "/abstract-shape-2.jpg" }}
				// image={{ src: "/splash/training.jpg" }}
			/>
			<ServiceSplash
				variant="lime"
				heading="AI Business Processes"
				description="Increasingly, we are setting up automated processes for businesses, such as automatically creating a blog post from your laptop, or getting an atomatic report of your customers social media posts. The possibility is endless and it is unique to your business what will help you and save you time. Let us analyse where you could make use of AI, with our intro AI packages."
				href="/business-processes"
				shapeImage={{ src: "/abstract-shape.jpg" }}
				reverse
				// image={{ src: "/splash/ai-processes.png" }}
			/>
			<ServiceSplash
				variant="black"
				heading="One-to-One training"
				description="Prefer to learn to do it yourself? One-to-one sessions are tailored to what you need, so you leave able to do it again on your own."
				href="/training"
				shapeImage={{ src: "/abstract-shape-3.jpg" }}
				// image={{ src: "/splash/websites.png" }}
			/>
		</>
	);
}
