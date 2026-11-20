"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";
import { useEffect, useSyncExternalStore } from "react";
import {
	getConsentState,
	getServerConsentState,
	subscribeConsent,
} from "../lib/cookieConsent";

// PECR requires analytics cookies to be opt-in, so Google Analytics is only
// ever injected once the visitor has actively consented — never on load,
// and never just because a valid GA id is configured.
//
// Pages under /tools are never measured: the task board can be opened from a
// share link that carries a client's board in the URL, and that must never be
// sent to Google. Besides not loading the script there, we set GA's own
// opt-out flag, so a visitor who has already loaded it on another page and
// then navigates (or pastes a link) into /tools still sends nothing.
const NO_ANALYTICS_PREFIX = "/tools";

export default function Analytics({ gaId }: { gaId: string }) {
	const pathname = usePathname();
	const excluded = pathname.startsWith(NO_ANALYTICS_PREFIX);
	const analyticsAllowed =
		useSyncExternalStore(
			subscribeConsent,
			getConsentState,
			getServerConsentState,
		) === "analytics";

	useEffect(() => {
		(window as unknown as Record<string, unknown>)[`ga-disable-${gaId}`] =
			excluded;
	}, [excluded, gaId]);

	if (!analyticsAllowed || excluded) return null;

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
