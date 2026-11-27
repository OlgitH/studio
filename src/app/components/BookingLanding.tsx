import Image from "next/image";
import Link from "next/link";
import Logo from "@/../public/logo/logo-white-no-bird.svg";
import CalInlineEmbed from "./CalInlineEmbed";
import CaseStudiesAside from "./CaseStudiesAside";
import CookieSettingsButton from "./CookieSettingsButton";

const PHONE_DISPLAY = "01225 699150";
const PHONE_HREF = "tel:+441225699150";

type BookingLandingProps = {
	heading: string;
	/** The paragraph under the headline. */
	intro: React.ReactNode;
	/** Short "what we'll cover" points beside the headline (desktop). */
	bullets: React.ReactNode[];
	/** Cal.com link: "username/event-slug". */
	calLink: string;
	conversionEvent: string;
	prefill?: Record<string, string>;
};

// Shared layout for the booking pages (free website review, plan your
// website). Deliberately minimal: one headline, the booking calendar above
// the fold, the phone number, two case studies and little else to click
// (the burger menu and site footer are hidden on these routes, see
// lib/landingPages.ts).
export default function BookingLanding({
	heading,
	intro,
	bullets,
	calLink,
	conversionEvent,
	prefill,
}: BookingLandingProps) {
	return (
		<main className="min-h-svh w-full font-light">
			<div className="mx-auto w-full p-[20px] xl:w-[1080px]">
				<header className="flex items-center justify-between gap-4 py-2">
					{/* The only route to the rest of the site: there for anyone who
					wants to see more of the business, without a menu pulling
					everyone else away from booking. */}
					<Link href="/" aria-label="Greencrown Studio home">
						<Image
							src={Logo}
							alt="Greencrown Studio"
							width={140}
							className="h-auto w-36"
							priority
						/>
					</Link>
					<a
						href={PHONE_HREF}
						className="font-bold whitespace-nowrap text-[var(--color-highlight)]"
					>
						{PHONE_DISPLAY}
					</a>
				</header>

				{/* Intro in one row, then the calendar full width: at full width
				Cal.com switches to its side-by-side layout (calendar beside
				times), which is far shorter than the stacked one it uses in a
				narrow column. */}
				<section className="mt-8 grid gap-4 lg:mt-12 lg:grid-cols-2 lg:gap-12">
					<div>
						<h1 className="mb-4 text-3xl leading-tight font-bold sm:text-4xl">
							{heading}
						</h1>
						<p className="body-text">{intro}</p>
					</div>
					<div className="hidden lg:block lg:pt-2">
						<ul className="body-text mb-4 list-disc space-y-1 pl-5">
							{bullets.map((bullet, index) => (
								<li key={index}>{bullet}</li>
							))}
						</ul>
						<p className="body-text">
							Prefer to talk now? Call{" "}
							<a href={PHONE_HREF} className="font-bold underline">
								{PHONE_DISPLAY}
							</a>
						</p>
					</div>
				</section>

				<CalInlineEmbed
					calLink={calLink}
					conversionEvent={conversionEvent}
					prefill={prefill}
					className="mt-8 overflow-hidden rounded-2xl bg-[#1c1717]"
				/>

				<CaseStudiesAside className="mt-16" />

				<section className="mt-16 text-center" aria-labelledby="call-heading">
					<h2 id="call-heading" className="mb-2 text-xl font-bold">
						Rather talk it through?
					</h2>
					<p className="body-text mx-auto">
						Call{" "}
						<a href={PHONE_HREF} className="font-bold underline">
							{PHONE_DISPLAY}
						</a>
						, or find us at The Studio, 10 Palace Yard Mews, Bath BA1 2NH.
					</p>
				</section>

				<footer className="mt-16 flex flex-wrap gap-x-4 gap-y-2 border-t border-white/10 pt-6 text-xs text-white/60">
					<p>© {new Date().getFullYear()} Greencrown Studio</p>
					<Link
						href="/cookie-policy"
						className="underline underline-offset-2 hover:text-white"
					>
						Cookie Policy
					</Link>
					<CookieSettingsButton />
				</footer>
			</div>
		</main>
	);
}
