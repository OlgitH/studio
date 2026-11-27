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
						Book a free review of your current website, or a call to plan a new
						one. Or get in touch directly below.
					</p>
					<p className="mb-8 flex flex-wrap gap-3">
						<BookCallButton variant="charcoal" />
						<BookCallButton variant="charcoal" href="/plan-your-website">
							Plan your website
						</BookCallButton>
					</p>
					<p className="mb-4">
						<a href="mailto:olly@greencrown.studio" className="underline">
							olly@greencrown.studio
						</a>
					</p>
					<p className="mb-4">
						<a href="tel:+441225699150" className="underline">
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
					{/* Heading and icons on one line: bare lime icons as on the
					homepage hero, a size smaller (16px) so they sit within the
					heading's capitals. gap-3 matches the gap between the icons; the
					3px lift centres them on the capitals rather than the heading's
					full line box (which includes descender room). Measured. */}
					<div className="mt-8 flex items-center gap-3">
						<h2 className="text-xl font-bold">Follow us</h2>
						<SocialLinks
							size="sm"
							shape="bare"
							tone="lime"
							className="-translate-y-[3px]"
						/>
					</div>
					</div>
				</PageContainer>
			</PageMain>
		</>
	);
}
