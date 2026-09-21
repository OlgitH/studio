import Link from "next/link";
import CookieSettingsButton from "./CookieSettingsButton";

export default function Footer() {
	const year = new Date().getFullYear();

	return (
		<footer className="relative z-10 border-t border-white/10 bg-[var(--page-background)] py-10 text-sm font-light text-white/80">
			<div className="mx-auto flex w-full flex-col gap-8 p-[20px] xl:w-[1080px] md:flex-row md:justify-between">
				<div className="flex max-w-xs flex-col gap-2">
					<Link href="/" className="text-base font-bold text-white">
						Greencrown Studio
					</Link>
					<p>
						All-in-one creative studio for small businesses, based in Bath,
						Somerset.
					</p>
				</div>

				<nav aria-label="Footer" className="flex flex-col gap-2">
					<Link href="/about" className="hover:text-white">
						About
					</Link>
					<Link href="/approach" className="hover:text-white">
						Approach
					</Link>
					<Link href="/pricing" className="hover:text-white">
						Pricing
					</Link>
					<Link href="/blog" className="hover:text-white">
						Blog
					</Link>
					<Link href="/contact" className="hover:text-white">
						Contact
					</Link>
				</nav>

				<div className="flex flex-col gap-2">
					<a href="mailto:olly@greencrown.studio" className="hover:text-white">
						olly@greencrown.studio
					</a>
					<a href="tel:+01225699150" className="hover:text-white">
						+44 1225 699150
					</a>
					<address className="not-italic">
						The Studio
						<br />
						10 Palace Yard Mews
						<br />
						Bath BA1 2NH
					</address>
				</div>
			</div>

			<div className="mx-auto mt-8 flex w-full flex-col gap-3 border-t border-white/10 p-[20px] pt-6 xl:w-[1080px] text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between">
				<p>© {year} Greencrown Studio. All rights reserved.</p>
				<div className="flex flex-wrap gap-x-4 gap-y-2">
					<Link
						href="/cookie-policy"
						className="underline underline-offset-2 hover:text-white"
					>
						Cookie Policy
					</Link>
					<CookieSettingsButton />
				</div>
			</div>
		</footer>
	);
}
