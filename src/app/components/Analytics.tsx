"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { COOKIE_CONSENT_EVENT, getStoredConsent } from "../lib/cookieConsent";

// PECR requires analytics cookies to be opt-in, so Google Analytics is only
// ever injected once the visitor has actively consented — never on load,
// and never just because a valid GA id is configured.
export default function Analytics({ gaId }: { gaId: string }) {
	const [analyticsAllowed, setAnalyticsAllowed] = useState(false);

	useEffect(() => {
		setAnalyticsAllowed(getStoredConsent()?.analytics ?? false);

		const onChange = (event: Event) => {
			const consent = (event as CustomEvent<{ analytics: boolean } | null>)
				.detail;
			setAnalyticsAllowed(consent?.analytics ?? false);
		};

		window.addEventListener(COOKIE_CONSENT_EVENT, onChange);
		return () => window.removeEventListener(COOKIE_CONSENT_EVENT, onChange);
	}, []);

	if (!analyticsAllowed) return null;

	return (
		<>
			<Script
				src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
				strategy="afterInteractive"
			/>
			<Script id="google-analytics" strategy="afterInteractive">
				{`
					window.dataLayer = window.dataLayer || [];
					function gtag(){dataLayer.push(arguments);}
					gtag('js', new Date());
					gtag('config', '${gaId}', { anonymize_ip: true });
				`}
			</Script>
		</>
	);
}
