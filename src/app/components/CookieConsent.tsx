"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
	COOKIE_CONSENT_EVENT,
	getStoredConsent,
	storeConsent,
} from "../lib/cookieConsent";

export default function CookieConsent() {
	const [visible, setVisible] = useState(false);
	const [expanded, setExpanded] = useState(false);
	// Off by default — an unchecked box left unchecked must never count as
	// consent, so "Save preferences" only turns analytics on if the visitor
	// actively ticks it themselves.
	const [analyticsChecked, setAnalyticsChecked] = useState(false);

	useEffect(() => {
		setVisible(getStoredConsent() === null);

		const onChange = (event: Event) => {
			const consent = (event as CustomEvent<{ analytics: boolean } | null>)
				.detail;
			setVisible(consent === null);
			if (consent === null) {
				setExpanded(false);
				setAnalyticsChecked(false);
			}
		};

		window.addEventListener(COOKIE_CONSENT_EVENT, onChange);
		return () => window.removeEventListener(COOKIE_CONSENT_EVENT, onChange);
	}, []);

	if (!visible) return null;

	return (
		<div
			role="region"
			aria-label="Cookie consent"
			className="fixed inset-x-0 bottom-0 z-[70] border-t border-white/10 bg-[#120d0d] px-6 py-5 text-sm font-light text-white shadow-[0_-4px_20px_rgba(0,0,0,0.4)] md:px-8"
		>
			<div className="mx-auto flex w-full max-w-4xl flex-col gap-4">
				<div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between md:gap-6">
					<p className="max-w-2xl text-white/80">
						We use essential cookies to make this site work, and — with your
						consent — analytics cookies to help us understand how it&apos;s
						used. See our{" "}
						<Link
							href="/cookie-policy"
							className="underline underline-offset-2 hover:text-white"
						>
							Cookie Policy
						</Link>{" "}
						for details.
					</p>
					<div className="flex flex-shrink-0 flex-wrap gap-3">
						<button
							type="button"
							onClick={() => storeConsent(false)}
							className="rounded-full border border-white/30 px-4 py-2 whitespace-nowrap hover:border-white"
						>
							Reject non-essential
						</button>
						<button
							type="button"
							onClick={() => setExpanded((value) => !value)}
							aria-expanded={expanded}
							className="rounded-full border border-white/30 px-4 py-2 whitespace-nowrap hover:border-white"
						>
							Manage preferences
						</button>
						<button
							type="button"
							onClick={() => storeConsent(true)}
							className="rounded-full bg-[var(--color-highlight)] px-4 py-2 whitespace-nowrap font-normal text-[#120d0d] hover:brightness-95"
						>
							Accept all
						</button>
					</div>
				</div>

				{expanded && (
					<div className="flex flex-col gap-4 border-t border-white/10 pt-4">
						<label className="flex items-start gap-3">
							<input
								type="checkbox"
								checked
								disabled
								className="mt-1 accent-[var(--color-highlight)]"
							/>
							<span>
								<span className="block font-normal">Necessary</span>
								<span className="block text-white/60">
									Required for the site to work. These can&apos;t be switched
									off.
								</span>
							</span>
						</label>
						<label className="flex items-start gap-3">
							<input
								type="checkbox"
								checked={analyticsChecked}
								onChange={(event) => setAnalyticsChecked(event.target.checked)}
								className="mt-1 accent-[var(--color-highlight)]"
							/>
							<span>
								<span className="block font-normal">Analytics</span>
								<span className="block text-white/60">
									Google Analytics — helps us see how visitors use the site so
									we can improve it. See{" "}
									<Link
										href="/cookie-policy"
										className="underline underline-offset-2 hover:text-white"
									>
										Cookie Policy
									</Link>
									.
								</span>
							</span>
						</label>
						<div>
							<button
								type="button"
								onClick={() => storeConsent(analyticsChecked)}
								className="rounded-full bg-[var(--color-highlight)] px-4 py-2 font-normal text-[#120d0d] hover:brightness-95"
							>
								Save preferences
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
