import BackHomeLink from "../components/BackHomeLink";
import PageMain from "../components/PageMain";

export default function ContactPage() {
	return (
		<>
			<BackHomeLink />
			<PageMain>
				<section className="max-w-2xl font-light">
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
				</section>
			</PageMain>
		</>
	);
}
