import BackHomeLink from "../components/BackHomeLink";
import PageMain from "../components/PageMain";
import PageBgImage from "../components/PageBgImage";

export default function ContactPage() {
	return (
		<>
			<BackHomeLink />
			<PageMain>
				<section className="relative max-w-4xl font-light">
					<PageBgImage
						src="/bird-blur-3.png"
						width={2000}
						height={1000}
						opacityClassName="opacity-40"
						maxWidthClassName="max-w-4xl"
						positionClassName="-translate-x-[40vw] -top-[90vh] md:-top-[10vh] md:translate-x-[20vw]"
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
