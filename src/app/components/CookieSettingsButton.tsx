"use client";

import { resetConsent } from "../lib/cookieConsent";

export default function CookieSettingsButton({
	className = "underline underline-offset-2 hover:text-white",
}: {
	className?: string;
}) {
	return (
		<button type="button" onClick={resetConsent} className={className}>
			Cookie settings
		</button>
	);
}
