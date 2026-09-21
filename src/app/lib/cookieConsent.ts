// Consent choice is kept in localStorage, not a cookie — nothing is set on
// the visitor's device until they've actively chosen to allow it, and
// clearing it (via CookieConsent's "Cookie settings" trigger) re-opens the
// banner without a page reload.
export type CookieConsent = {
	necessary: true;
	analytics: boolean;
};

const STORAGE_KEY = "gc-cookie-consent";

export const COOKIE_CONSENT_EVENT = "cookie-consent-change";

export function getStoredConsent(): CookieConsent | null {
	if (typeof window === "undefined") return null;
	try {
		const raw = window.localStorage.getItem(STORAGE_KEY);
		if (!raw) return null;
		const parsed = JSON.parse(raw);
		if (typeof parsed?.analytics === "boolean") {
			return { necessary: true, analytics: parsed.analytics };
		}
		return null;
	} catch {
		return null;
	}
}

export function storeConsent(analytics: boolean) {
	if (typeof window === "undefined") return;
	const consent: CookieConsent = { necessary: true, analytics };
	try {
		window.localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
	} catch {
		// localStorage unavailable (private mode, storage disabled) — the
		// banner will simply reappear next visit, which is an acceptable
		// fallback rather than something to surface to the visitor.
	}
	window.dispatchEvent(
		new CustomEvent<CookieConsent>(COOKIE_CONSENT_EVENT, { detail: consent }),
	);
}

// Clears the stored choice and re-opens the banner, used by the "Cookie
// settings" link so visitors can change their mind at any time.
export function resetConsent() {
	if (typeof window === "undefined") return;
	try {
		window.localStorage.removeItem(STORAGE_KEY);
	} catch {
		// see storeConsent
	}
	window.dispatchEvent(
		new CustomEvent<CookieConsent | null>(COOKIE_CONSENT_EVENT, {
			detail: null,
		}),
	);
}
