import BackHomeLink from "../components/BackHomeLink";
import PageMain from "../components/PageMain";
import PageBgImage from "../components/PageBgImage";
import PageContainer from "../components/PageContainer";
import SocialLinks from "../components/SocialLinks";
import BookCallButton from "../components/BookCallButton";

export default function ContactPage() {
	return (
		<>
			<BackHomeLink />
			<PageMain
				bgImage={
					<PageBgImage
						src="/bird-blur-3.png"
						width={2000}
						height={1000}
						opacityClassName="opacity-40"
						maxWidthClassName="max-w-4xl"
					/>
				}
			>
				<PageContainer className="font-light">
					<div className="relative z-10 max-w-2xl">
					<h1 className="text-3xl font-bold mb-4">Contact</h1>
					<p className="mb-4 body-text">
						Pick a time that suits you for a website analysis call, or get in
						touch directly below.
					</p>
					<p className="mb-8">
						<BookCallButton />
					</p>
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
					<h2 className="mt-8 mb-4 text-xl font-bold">Follow us</h2>
					<SocialLinks size="lg" />
					</div>
				</PageContainer>
			</PageMain>
		</>
	);
}
