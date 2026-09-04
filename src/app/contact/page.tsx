import Image from "next/image";
import BackHomeLink from "../components/BackHomeLink";
import PageMain from "../components/PageMain";

export default function ContactPage() {
	return (
		<>
			<BackHomeLink />
			<PageMain>
				<section className="relative max-w-4xl font-light">
					<Image
						src="/hummingbird.png"
						alt=""
						width={900}
						height={1200}
						aria-hidden="true"
						className="absolute -top-10 -left-10 z-0 w-[280px] h-auto object-contain opacity-40 pointer-events-none origin-top-left md:w-[500px]"
					/>
					<div className="relative z-10 max-w-2xl">
					<h1 className="text-3xl font-bold mb-4">Contact</h1>
					<p className="mb-4">
						<a href="mailto:olly@greencrown.studio" className="underline">
							olly@greencrown.studio
						</a>
					</p>
					<p className="mb-4">
						<a href="tel:+01225699150" className="underline">
							+44 1225 699150
						</a>
					</p>
					<p>
						The Studio
						<br />
						10 Palace Yard Mews
						<br />
						Bath BA1 2NH
					</p>
					</div>
				</section>
			</PageMain>
		</>
	);
}
