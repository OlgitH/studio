import type { Metadata } from "next";
import BackHomeLink from "../components/BackHomeLink";
import PageMain from "../components/PageMain";
import PageContainer from "../components/PageContainer";
import CookieSettingsButton from "../components/CookieSettingsButton";

export const metadata: Metadata = {
	title: "Cookie Policy — Greencrown Studio",
	description:
		"How Greencrown Studio uses cookies and similar technologies, and how to manage your preferences.",
};

export default function CookiePolicyPage() {
	return (
		<>
			<BackHomeLink />
			<PageMain>
				<PageContainer className="font-light pb-16">
					<div className="blog-prose max-w-2xl">
						<h1 className="text-3xl font-bold mb-4">Cookie Policy</h1>
						<p className="text-white/60 mb-8">Last updated: 21 September 2026</p>

						<p>
							This policy explains what cookies and similar technologies are,
							which ones this website (greencrown.studio) uses, and how you can
							control them. It&apos;s written to comply with the UK GDPR and
							the Privacy and Electronic Communications Regulations (PECR).
						</p>

						<h2>1. What are cookies?</h2>
						<p>
							Cookies are small text files placed on your device when you visit
							a website. They&apos;re widely used to make sites work, work more
							efficiently, and to provide information to the site&apos;s owner.
							Similar technologies — such as data stored in your browser&apos;s
							local storage — are covered by this policy too.
						</p>

						<h2>2. Cookies we use</h2>
						<p>
							We keep this to the minimum needed to run the site and, where you
							agree, to understand how it&apos;s used. Nothing beyond strictly
							necessary storage is set until you actively consent.
						</p>
						<table>
							<thead>
								<tr>
									<th>Name</th>
									<th>Purpose</th>
									<th>Duration</th>
									<th>Type</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>gc-cookie-consent</td>
									<td>
										Remembers your cookie preferences. Stored in your
										browser&apos;s local storage, not as a cookie.
									</td>
									<td>Until you clear it</td>
									<td>Strictly necessary</td>
								</tr>
								<tr>
									<td>_ga, _ga_*</td>
									<td>
										Google Analytics — distinguishes visitors and tracks usage
										of the site in aggregate, so we can see what&apos;s working
										and fix what isn&apos;t.
									</td>
									<td>Up to 2 years</td>
									<td>Analytics (requires your consent)</td>
								</tr>
								<tr>
									<td>player, vuid and related</td>
									<td>
										Set by Vimeo when a video embedded on this site (e.g. on
										the About page) is loaded, to support playback and gather
										aggregate viewing statistics.
									</td>
									<td>Up to 2 years</td>
									<td>Third-party embedded content</td>
								</tr>
							</tbody>
						</table>

						<h2>3. Managing your preferences</h2>
						<p>
							When you first visit, a banner lets you accept all cookies,
							reject everything beyond what&apos;s strictly necessary, or choose
							exactly which categories to allow. You can change your mind at
							any time — click below to reopen your preferences:
						</p>
						<p>
							<CookieSettingsButton className="underline underline-offset-2 hover:text-[var(--color-highlight)] font-normal" />
						</p>
						<p>
							You can also block or delete cookies using your browser&apos;s own
							settings. Doing so may affect how parts of this and other sites
							work.
						</p>

						<h2>4. Third-party cookies</h2>
						<p>
							Some cookies are set by services we embed rather than by us
							directly. Their own policies explain how they use that data:
						</p>
						<ul>
							<li>
								<a
									href="https://policies.google.com/technologies/cookies"
									target="_blank"
									rel="noopener noreferrer"
								>
									Google Analytics cookie policy
								</a>
							</li>
							<li>
								<a
									href="https://vimeo.com/cookie_policy"
									target="_blank"
									rel="noopener noreferrer"
								>
									Vimeo cookie policy
								</a>
							</li>
						</ul>

						<h2>5. Changes to this policy</h2>
						<p>
							We may update this policy from time to time, for example if we
							start using a new tool that sets cookies. Check back here
							periodically for the current version.
						</p>

						<h2>6. Contact us</h2>
						<p>
							If you have questions about this policy or how we handle your
							data, contact us at{" "}
							<a href="mailto:olly@greencrown.studio">
								olly@greencrown.studio
							</a>
							. If you&apos;re unhappy with how we&apos;ve handled your data,
							you can also complain to the UK Information Commissioner&apos;s
							Office at{" "}
							<a
								href="https://ico.org.uk"
								target="_blank"
								rel="noopener noreferrer"
							>
								ico.org.uk
							</a>
							.
						</p>
					</div>
				</PageContainer>
			</PageMain>
		</>
	);
}
