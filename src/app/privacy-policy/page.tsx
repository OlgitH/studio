import type { Metadata } from "next";
import type { ReactNode } from "react";
import BackHomeLink from "../components/BackHomeLink";
import PageMain from "../components/PageMain";
import PageContainer from "../components/PageContainer";

// DRAFT — hidden from search engines and not linked from the footer until it
// has been checked by a solicitor and the [CONFIRM: …] items are filled in.
// When approved: remove the draft banner below, delete the `robots` line, and
// link it from the footer and the cookie policy.
export const metadata: Metadata = {
	title: "Privacy Policy — Greencrown Studio",
	robots: { index: false, follow: false },
};

// A bright tag marking something only the business owner can supply.
function Confirm({ children }: { children: ReactNode }) {
	return (
		<mark className="rounded bg-yellow-300 px-1 font-normal text-black">
			[CONFIRM: {children}]
		</mark>
	);
}

export default function PrivacyPolicyPage() {
	return (
		<>
			<BackHomeLink />
			<PageMain>
				<PageContainer className="font-light pb-16">
					<div className="blog-prose max-w-2xl">
						<p
							role="note"
							className="mb-8 rounded border border-yellow-300 bg-yellow-300/10 p-4 text-sm"
						>
							<strong>DRAFT — not yet reviewed by a solicitor.</strong>{" "}
							{
								"Anything highlighted in yellow and marked CONFIRM needs your own details or a decision. This page is hidden from search engines and isn't linked from the footer. When it's approved, remove this box and the robots setting in the page file."
							}
						</p>

						<h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
						<p className="text-white/60 mb-8">
							Last updated: 20 November 2026 (draft)
						</p>

						<p>
							This policy explains how Greencrown Studio looks after personal
							data when you visit our website (greencrown.studio), get in touch
							with us, or work with us. It&apos;s written to comply with the UK
							GDPR, the Data Protection Act 2018 and the Privacy and Electronic
							Communications Regulations (PECR). For cookies and similar
							technologies, see our Cookie Policy.
						</p>

						<h2>1. Who we are</h2>
						<p>
							Greencrown Studio is a creative website design, development and
							digital marketing practice based in Bath, Somerset. We are the
							&ldquo;controller&rdquo; of the personal data described in this
							policy.
						</p>
						<ul>
							<li>
								Legal name and status:{" "}
								<Confirm>
									your legal name, whether you trade as a sole trader or a
									limited company, and the company number if there is one
								</Confirm>
							</li>
							<li>Address: 10 Palace Yard Mews, Bath BA1 2NH</li>
							<li>
								Email:{" "}
								<a href="mailto:olly@greencrown.studio">
									olly@greencrown.studio
								</a>
							</li>
							<li>Phone: +44 1225 699150</li>
							<li>
								ICO registration number:{" "}
								<Confirm>
									your registration number, or why you are exempt from the data
									protection fee
								</Confirm>
							</li>
						</ul>

						<h2>2. What we collect, why, and for how long</h2>
						<table>
							<thead>
								<tr>
									<th>Who / what</th>
									<th>Information</th>
									<th>Why we use it</th>
									<th>Lawful basis</th>
									<th>How long</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>People who contact us by email or phone</td>
									<td>Name, contact details, and what you tell us</td>
									<td>To reply and to discuss possible work</td>
									<td>
										Legitimate interests; steps at your request before a
										contract
									</td>
									<td>
										<Confirm>e.g. 12 months after our last contact</Confirm>
									</td>
								</tr>
								<tr>
									<td>Clients</td>
									<td>
										Contact and business details, project content and
										correspondence, invoices and payment records
									</td>
									<td>
										To deliver and support the services you ask for, and to keep
										our accounts
									</td>
									<td>
										Contract; legal obligation (accounting and tax records)
									</td>
									<td>
										<Confirm>
											e.g. project files for the life of the work plus an agreed
											period; accounting records for 6 years
										</Confirm>
									</td>
								</tr>
								<tr>
									<td>Everyone who visits the website</td>
									<td>
										Technical data our host records automatically: IP address,
										browser and device type, pages requested, date and time
									</td>
									<td>To deliver the site, keep it secure and fix problems</td>
									<td>Legitimate interests</td>
									<td>
										<Confirm>
											your host&apos;s log retention period (check Vercel&apos;s
											settings and documentation)
										</Confirm>
									</td>
								</tr>
								<tr>
									<td>Visitors who accept analytics cookies</td>
									<td>
										Google Analytics identifiers, pages viewed, approximate
										location and device (IP addresses are anonymised)
									</td>
									<td>To understand how the site is used and improve it</td>
									<td>Consent, which you can withdraw at any time</td>
									<td>
										Cookies last up to 2 years;{" "}
										<Confirm>
											the data-retention period set in your Google Analytics
											account
										</Confirm>
									</td>
								</tr>
								<tr>
									<td>Your cookie choices</td>
									<td>Whether you accepted or rejected analytics</td>
									<td>To respect your preference</td>
									<td>Legitimate interests (and PECR)</td>
									<td>
										Stored only on your own device, until you clear it. We never
										receive it.
									</td>
								</tr>
							</tbody>
						</table>
						<p>
							We don&apos;t ask you to complete forms on this website; people
							contact us by email or phone. We don&apos;t make decisions about
							you using automated processing or profiling.
						</p>

						<h2>3. Our private tools</h2>
						<p>
							We offer some private tools, such as a task board, to people
							we&apos;ve invited. They are protected by a password and they
							don&apos;t use analytics. The content of a board you create stays
							in your own browser: it is not sent to or stored on our servers.
							If you export it as a file or share it as a link, that is your
							choice, and the copy you send is outside our control. Please
							don&apos;t put passwords, financial details or other people&apos;s
							personal data, and in particular children&apos;s names, ages or
							photos, on a board.
						</p>

						<h2>4. Who we share data with</h2>
						<p>
							We don&apos;t sell your personal data. We use a small number of
							trusted providers who handle it on our behalf, under written terms
							that limit what they can do with it:
						</p>
						<ul>
							<li>Vercel Inc. — hosts this website.</li>
							<li>
								Google LLC — website analytics (only if you consent) and{" "}
								<Confirm>
									any other Google services you use, such as email, Drive or
									Docs
								</Confirm>
								.
							</li>
							<li>
								<Confirm>
									your email provider, accountant or bookkeeper, invoicing and
									payment providers, and any project or communication tools that
									hold client data
								</Confirm>
							</li>
						</ul>
						<p>
							The site also embeds video from Vimeo. If you play a video, Vimeo
							may collect data about you under its own privacy policy and
							cookies.
						</p>
						<p>
							We may also share data where the law requires, or to protect our
							legal rights.
						</p>

						<h2>5. Transfers outside the UK</h2>
						<p>
							Some of our providers, including Vercel and Google, are based in
							or process data in the United States and other countries. Where
							that happens we rely on an approved safeguard, such as the UK
							Extension to the EU-US Data Privacy Framework or the International
							Data Transfer Agreement or Addendum.{" "}
							<Confirm>
								check the transfer safeguard each provider relies on and update
								this paragraph to match
							</Confirm>
						</p>

						<h2>6. Keeping your data secure</h2>
						<p>
							We use sensible technical and organisational measures, including
							encrypted connections (HTTPS), password-protected access to our
							private tools, and limiting access to client data to the people
							who need it.{" "}
							<Confirm>
								add anything else that is true for you, e.g. two-step
								verification, encrypted devices, a password manager
							</Confirm>
						</p>

						<h2>7. Your rights</h2>
						<p>You have the right to:</p>
						<ul>
							<li>be told how your data is used (this policy);</li>
							<li>ask for a copy of the data we hold about you;</li>
							<li>ask us to correct anything that is wrong or incomplete;</li>
							<li>ask us to delete your data, in some circumstances;</li>
							<li>ask us to restrict how we use it, in some circumstances;</li>
							<li>receive your data in a portable format, where it applies;</li>
							<li>
								object to our use of your data based on legitimate interests;
							</li>
							<li>
								withdraw your consent at any time, for example by changing your
								cookie preferences.
							</li>
						</ul>
						<p>
							To use any of these rights, email{" "}
							<a href="mailto:olly@greencrown.studio">olly@greencrown.studio</a>
							. We will reply within one month. If you&apos;re unhappy with how
							we&apos;ve handled your data, you can complain to the Information
							Commissioner&apos;s Office at{" "}
							<a
								href="https://ico.org.uk"
								target="_blank"
								rel="noopener noreferrer"
							>
								ico.org.uk
							</a>{" "}
							or on 0303 123 1113. We would appreciate the chance to put things
							right first.
						</p>

						<h2>8. Children</h2>
						<p>
							Our website and services are aimed at businesses and adults and we
							don&apos;t knowingly collect children&apos;s personal data.{" "}
							<Confirm>
								if you work on projects that involve children&apos;s artwork,
								names or ages (for example a children&apos;s book client), say
								how this is handled: that the client is responsible for
								permissions, and what you do or don&apos;t keep
							</Confirm>
						</p>

						<h2>9. Changes to this policy</h2>
						<p>
							We may update this policy from time to time. The date at the top
							shows when it was last changed.
						</p>

						<h2>10. Contact us</h2>
						<p>
							Questions about this policy or your data? Email{" "}
							<a href="mailto:olly@greencrown.studio">olly@greencrown.studio</a>{" "}
							or write to Greencrown Studio, 10 Palace Yard Mews, Bath BA1 2NH.
						</p>
					</div>
				</PageContainer>
			</PageMain>
		</>
	);
}
